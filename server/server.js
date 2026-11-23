const bcrypt = require("bcryptjs");
const cors = require("cors");
const express = require("express");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
require("dotenv").config();

const Alert = require("./models/alert");
const User = require("./models/user");

const auth = (req, res, next) => {
  const authorization = req.get("authorization") || "";
  const match = authorization.match(/^Bearer\s+([^\s]+)$/i);
  if (!match) return res.status(401).json({ message: "Sign in required." });
  try {
    const verified = jwt.verify(match[1], process.env.JWT_SECRET);
    if (!verified || typeof verified.userId !== "string") {
      return res.status(401).json({ message: "Invalid session." });
    }
    req.user = verified;
    return next();
  } catch (_error) {
    return res.status(401).json({ message: "Invalid session." });
  }
};

if (!process.env.MONGO_URI || !process.env.JWT_SECRET) {
  console.error("Required server configuration is missing.");
  process.exit(1);
}

const app = express();
app.disable("x-powered-by");
app.set("trust proxy", 1);
const allowedOrigins = new Set([
  "http://localhost:5173",
  "https://girls-safety-alert-1.onrender.com",
  process.env.CLIENT_ORIGIN
].filter(Boolean));
const authAttempts = new Map();
const sosAttempts = new Map();

function limitAuthAttempts(req, res, next) {
  const now = Date.now();
  const key = req.ip + ":" + req.path;
  const attempt = authAttempts.get(key);

  if (!attempt || attempt.resetAt <= now) {
    authAttempts.set(key, { count: 1, resetAt: now + 15 * 60 * 1000 });
    return next();
  }
  if (attempt.count >= 10) {
    return res.status(429).json({ message: "Too many attempts. Try again later." });
  }
  attempt.count += 1;
  return next();
}

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.has(origin)) return callback(null, true);
    return callback(new Error("Origin not allowed"));
  }
}));
app.use(express.json({ limit: "10kb" }));
app.use((_req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "no-referrer");
  next();
});

app.get("/", (_req, res) => res.json({ status: "ok" }));

app.post("/register", limitAuthAttempts, async (req, res) => {
  try {
    const { name, phone, password } = req.body || {};
    if (
      typeof name !== "string" || name.trim().length < 1 || name.trim().length > 80 ||
      typeof phone !== "string" || phone.trim().length < 7 || phone.trim().length > 20 ||
      typeof password !== "string" || password.length < 12 || password.length > 128
    ) {
      return res.status(400).json({
        message: "Enter a name, phone number, and password of at least 12 characters."
      });
    }

    const existingUser = await User.findOne({ phone: phone.trim() }).select("_id");
    if (existingUser) {
      return res.status(409).json({ message: "Phone already registered." });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    await User.create({
      name: name.trim(),
      phone: phone.trim(),
      password: hashedPassword
    });
    return res.status(201).json({ message: "User registered successfully." });
  } catch (_error) {
    return res.status(500).json({ message: "Unable to register right now." });
  }
});

app.post("/login", limitAuthAttempts, async (req, res) => {
  try {
    const { phone, password } = req.body || {};
    if (
      typeof phone !== "string" || typeof password !== "string" ||
      phone.length > 20 || password.length > 128
    ) {
      return res.status(401).json({ message: "Invalid phone or password." });
    }
    const user = await User.findOne({ phone: phone.trim() });
    const passwordMatches = user
      ? await bcrypt.compare(password, user.password)
      : false;
    if (!passwordMatches) {
      return res.status(401).json({ message: "Invalid phone or password." });
    }
    const token = jwt.sign(
      { userId: user._id.toString() },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    return res.json({ message: "Login successful.", token });
  } catch (_error) {
    return res.status(500).json({ message: "Unable to log in right now." });
  }
});

app.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .select("name phone emergencyContacts");
    if (!user) return res.status(404).json({ message: "Profile not found." });
    return res.json(user);
  } catch (_error) {
    return res.status(500).json({ message: "Unable to load profile." });
  }
});

app.put("/user/:id", auth, async (req, res) => {
  try {
    if (req.params.id !== req.user.userId) {
      return res.status(403).json({ message: "Not allowed." });
    }
    const { name, phone } = req.body || {};
    if (
      typeof name !== "string" || name.trim().length < 1 || name.trim().length > 80 ||
      typeof phone !== "string" || phone.trim().length < 7 || phone.trim().length > 20
    ) {
      return res.status(400).json({ message: "Enter a valid name and phone number." });
    }
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { $set: { name: name.trim(), phone: phone.trim() } },
      { new: true, runValidators: true }
    ).select("name phone emergencyContacts");
    if (!user) return res.status(404).json({ message: "Profile not found." });
    return res.json(user);
  } catch (_error) {
    return res.status(500).json({ message: "Unable to update profile." });
  }
});

app.post("/emergency-contact", auth, async (req, res) => {
  try {
    const { name, phone, consent } = req.body || {};
    if (
      typeof name !== "string" || name.trim().length < 1 || name.trim().length > 80 ||
      typeof phone !== "string" || phone.trim().length < 7 || phone.trim().length > 20 ||
      consent !== true
    ) {
      return res.status(400).json({
        message: "Enter valid contact details and confirm they agreed to receive SOS texts and location."
      });
    }
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { $push: { emergencyContacts: {
        name: name.trim(), phone: phone.trim(), consentedAt: new Date()
      } } },
      { new: true, runValidators: true }
    ).select("_id");
    if (!user) return res.status(404).json({ message: "Profile not found." });
    return res.json({ message: "Emergency contact added." });
  } catch (_error) {
    return res.status(500).json({ message: "Unable to add contact." });
  }
});

app.post("/sos", auth, async (req, res) => {
  let alert;
  try {
    const { location } = req.body || {};
    if (typeof location !== "string" || location.length > 100) {
      return res.status(400).json({ message: "A valid location is required." });
    }

    const coordinates = location.split(",").map((part) => Number(part.trim()));
    if (
      coordinates.length !== 2 || !coordinates.every(Number.isFinite) ||
      coordinates[0] < -90 || coordinates[0] > 90 ||
      coordinates[1] < -180 || coordinates[1] > 180
    ) {
      return res.status(400).json({ message: "A valid location is required." });
    }

    const now = Date.now();
    const previous = sosAttempts.get(req.user.userId);
    if (previous && previous.resetAt > now && previous.count >= 3) {
      return res.status(429).json({
        message: "SOS is temporarily rate limited. If you need immediate help, call 112."
      });
    }
    if (!previous || previous.resetAt <= now) {
      sosAttempts.set(req.user.userId, { count: 1, resetAt: now + 60_000 });
    } else {
      previous.count += 1;
    }

    const user = await User.findById(req.user.userId)
      .select("name phone emergencyContacts");
    if (!user) return res.status(404).json({ message: "Profile not found." });

    alert = await Alert.create({
      userId: req.user.userId,
      location,
      message: "Emergency Alert Triggered"
    });

    const optedInContacts = (user.emergencyContacts || []).filter((contact) =>
      contact.consentedAt && typeof contact.phone === "string"
    );
    if (optedInContacts.length === 0) {
      return res.status(503).json({
        alertRecorded: true,
        notificationStatus: "no_eligible_contacts",
        message: "SOS recorded, but no contacts have opted in to receive texts. Call 112 now if you need immediate help."
      });
    }

    const authKey = process.env.MSG91_AUTHKEY;
    const templateId = process.env.MSG91_SOS_TEMPLATE_ID;
    if (!authKey || !templateId) {
      return res.status(503).json({
        alertRecorded: true,
        notificationStatus: "not_configured",
        message: "SOS recorded, but text alerts are not configured yet. Call 112 now if you need immediate help."
      });
    }

    const mapUrl = "https://maps.google.com/?q=" + coordinates[0] + "," + coordinates[1];
    const recipients = [];
    const seenNumbers = new Set();
    for (const contact of optedInContacts) {
      const digits = contact.phone.replace(/\D/g, "");
      const mobile = digits.length === 10 ? "91" + digits
        : digits.length === 12 && digits.startsWith("91") ? digits
        : null;
      if (mobile && !seenNumbers.has(mobile)) {
        seenNumbers.add(mobile);
        recipients.push({
          mobiles: mobile,
          VAR1: String(user.name).slice(0, 80),
          VAR2: mapUrl,
          VAR3: String(user.phone).slice(0, 20)
        });
      }
    }
    if (recipients.length === 0) {
      return res.status(503).json({
        alertRecorded: true,
        notificationStatus: "no_valid_contacts",
        message: "SOS recorded, but no valid Indian mobile numbers were found. Call 112 now if you need immediate help."
      });
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    let providerResponse;
    try {
      providerResponse = await fetch("https://control.msg91.com/api/v5/flow", {
        method: "POST",
        headers: {
          accept: "application/json",
          authkey: authKey,
          "content-type": "application/json"
        },
        body: JSON.stringify({
          template_id: templateId,
          short_url: "0",
          realTimeResponse: "1",
          recipients
        }),
        signal: controller.signal
      });
    } finally {
      clearTimeout(timeout);
    }
    const providerResult = await providerResponse.json().catch(() => ({}));
    if (!providerResponse.ok || providerResult.type !== "success") {
      return res.status(502).json({
        alertRecorded: true,
        notificationStatus: "failed",
        message: "SOS recorded, but texts could not be submitted. Call 112 now if you need immediate help."
      });
    }
    return res.status(201).json({
      alertRecorded: true,
      notificationStatus: "submitted",
      message: "SOS submitted to the SMS provider. Delivery can take time; call 112 for immediate help."
    });
  } catch (_error) {
    if (alert) {
      return res.status(502).json({
        alertRecorded: true,
        notificationStatus: "failed",
        message: "SOS recorded, but texts could not be submitted. Call 112 now if you need immediate help."
      });
    }
    return res.status(500).json({ message: "Unable to record SOS alert." });
  }
});

app.get("/my-alerts", auth, async (req, res) => {
  try {
    const alerts = await Alert.find({ userId: req.user.userId })
      .sort({ createdAt: -1 });
    return res.json(alerts);
  } catch (_error) {
    return res.status(500).json({ message: "Unable to load alerts." });
  }
});

app.put("/alert/:id/resolve", auth, async (req, res) => {
  try {
    const alert = await Alert.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { $set: { status: "Resolved" } },
      { new: true }
    );
    if (!alert) return res.status(404).json({ message: "Alert not found." });
    return res.json({ message: "Alert resolved." });
  } catch (_error) {
    return res.status(500).json({ message: "Unable to resolve alert." });
  }
});

app.delete("/alert/:id", auth, async (req, res) => {
  try {
    const alert = await Alert.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId
    });
    if (!alert) return res.status(404).json({ message: "Alert not found." });
    return res.json({ message: "Alert deleted." });
  } catch (_error) {
    return res.status(500).json({ message: "Unable to delete alert." });
  }
});

app.use((err, _req, res, _next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({ message: "Invalid request body." });
  }
  if (err.message === "Origin not allowed") {
    return res.status(403).json({ message: "Origin not allowed." });
  }
  return res.status(500).json({ message: "Unexpected server error." });
});

async function startServer() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000
    });
    const port = Number(process.env.PORT) || 5000;
    app.listen(port, "0.0.0.0", () => {
      console.log("Girls Safety Alert backend is ready.");
    });
  } catch (_error) {
    console.error("Backend startup failed; check server configuration.");
    process.exit(1);
  }
}

startServer();
