const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const auth = require("./middleware/auth");
const Alert =require("./models/alert");
const cors = require("cors");
const express = require("express"); //using express library
require("dotenv").config();
const connectDB = require("./config/db");
const User = require("./models/user");
console.log("URI =", process.env.MONGO_URI);
const app =express(); //creating server
app.use(express.json()); //understands json data and use in js object
app.use(cors({
    origin: ["http://localhost:5173",
    "https://girls-safety-alert.onrender.com"],
    credentials: true
}));
app.use(express.json());
connectDB();
app.get("/users",async(req,res) => {
    const users = await User.find();
   res.json(users);
});
app.post("/register", async(req,res) => {
    try{
        if(!req.body.name|| !req.body.phone || !req.body.password){
            return res.status(400).send("All fields are required");
        }
        const existingUser = await User.findOne({
            phone: req.body.phone
        });
        if(existingUser){
            return res.status(400).send("Phone already registered");
        }
        const hashedPassword =await
        bcrypt.hash(req.body.password, 10);
        const user = new User({
            name: req.body.name,
            phone: req.body.phone,
            password: hashedPassword
        });
        await user.save();
        res.send("User Registered Successfully");
    }catch (error) {
        console.log(error);
        res.status(500).send(error.message);
    }
});
app.post("/login",async(req,res) => {
    console.log("LOGIN REQUEST =",req.body);
    try{
        const user = await User.findOne({
            phone: req.body.phone
        });
        if(!user){
            return res.status(400).send("User not found");
        }
        const isMatch = await bcrypt.compare(
            req.body.password,
            user.password
        );
        console.log("Entered Password =",req.body.password);
        console.log("DB Password =",user.password);
        console.log("MATCH =", isMatch);
        if(!isMatch){
            return res.status(400).send("Invalid Password");
        }
        const token =jwt.sign(
            {
                userId: user._id
            },
            process.env.JWT_SECRET,
            {
                expiresIn:"7d"
            }
        );
        res.json({
            message:"Login Successful",
            token: token
        });;
    }catch(error){
        console.log(error);
        res.status(500).send(error.message);
    }
});
app.delete("/users/:id", async(req,res) => {
    await
    User.findByIdAndDelete(req.params.id);
    res.send("Users Deleted");
});
app.put("/users/:id", async(req,res) => {
    await
    User.findByIdAndUpdate(res.params.id,res.body);
    res.send("User Updated");
});
app.get("/count", async(req,res) =>{
    const count = await
    User.countDocuments();
    res.json({
        totalUsers: count
    });
});
app.delete("/user/:id", async(req,res) => {
    await
    User.findByIdAndDelete(req.params.id);
    res.send("User Deleted");
});
app.put("/user/:id",async(req,res) => {
    try{
        
       const user=await User.findByIdAndUpdate(req.params.id, {
         name: req.body.name,
         phone: req.body.phone
     },{new: true});
    res.json("User");
    }catch(error){
        res.status(500).send(error.mesage);
    }
});
app.put("/user/:id/emergency-contact", async(req,res) =>{
    console.log("ID =",req.params.id);
    console.log("BODY =",req.body);
    const user = await
    User.findById(req.params.id);
    user.emergencyContacts.push({
        name:req.body.name,
        phone:req.body.phone
    });
    await user.save();
    console.log("Contacts After Save =",user.emergencyContacts);

    res.send("Emergency Contact Added");
});
app.get("/profile", auth,async(req,res) =>{
    const user = await
    User.findById(req.user.userId);
    res.json(user);
});
app.post("/sos", auth, async(req,res) =>{
    console.log("SOS route hit");
    console.log(req.user);

    try{
        const alert = new Alert({
            userId: req.user.userId,
            location: req.body.location,
            message: "Emergency Alert Triggered"
        });

        await alert.save();
        const user = await User.findById(req.user.userId);
        console.log("Emergency Contacts");
        console.log(user.emergencyContacts);
        res.send("SOS Alert Sent");
    }catch(error){
        console.log(error);
        res.status(500).send(error.message);
    }
});
app.get("/alerts", async(req,res) => {
    const alerts = await Alert.find();
    res.json(alerts);
});
app.get("/my-alerts", auth, async(req,res) => {
    const alerts =await Alert.find({
        userId: req.user.userId
    });
    res.json(alerts);
});
app.put("/alert/:id/resolve", async(req,res) => {
    console.log("Resolve API Hit");
    console.log(req.params.id);
    try {
        await Alert.findByIdAndUpdate(req.params.id, {
            status: "Resolved"
        });
        res.send("Alert Resolved");
    }catch(error) {
        console.log(error);
        res.status(500).send(error.message);
    }
});
app.delete("/alert/:id", async(req,res) => {
    try{
        await Alert.findByIdAndDelete(req.params.id);
        res.send("Alert Deleted");
    }catch(error){
        console.log(error);
        res.status(500).send(error.message);
    }
});
app.listen(5000,() => {
    console.log("Girls Safety Alert Backend Started");    //server open in port 5000
});