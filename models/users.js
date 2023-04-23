const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: String,
    phone: {type:String,unique:true},
    email: String,
    Created_on: { type: Date, default: Date.now() },
    token :String,
    registrationToken:String,
    // Password Related
    password:String,
    resetPasswordToken:String,
    resetPasswordExpires:Date,
    Groups:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Groups"
    }],
});

module.exports = mongoose.model("User", UserSchema);
