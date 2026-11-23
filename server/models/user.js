const mongoose = require("mongoose");

const emergencyContactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  consentedAt: { type: Date, default: null }
}, { _id: true });

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  emergencyContacts: [emergencyContactSchema],
  location: {
    type: String,
    default: ""
  }
});

module.exports = mongoose.model("User", userSchema);
