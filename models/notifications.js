const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({
    title: String,
    description: String,
    amount: Number,
    paidBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    groupId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Group"
    },
    paid_on:Date,
    image:String

});

module.exports = mongoose.model("Notification", NotificationSchema);
