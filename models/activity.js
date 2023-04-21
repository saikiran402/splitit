const mongoose = require("mongoose");

const ActivitySchema = new mongoose.Schema({
    message: String,
    created_on: Date,
    groupId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Group"
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }

});

module.exports = mongoose.model("Activity", ActivitySchema);
