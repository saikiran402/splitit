const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: String,
    phone: {type:String,unique:true},
    email: String,
    password:String,
    Created_on: { type: Date, default: Date.now() },
    token :String,
    registrationToken:String,
    Groups:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Groups"
    }],
});

module.exports = mongoose.model("User", UserSchema);
