const mongoose = require("mongoose");
const alertSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    location: String,
    message: String,
    status: {
        type: String,
        default:"Pending"
    }
   
}, {
    timestamps: true
});
module.exports = mongoose.model("Alert",alertSchema);