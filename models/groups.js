const mongoose = require("mongoose");

const GroupSchema = new mongoose.Schema({
    GroupName: String,
    GroupDescription: String,
    Created_on: { type: Date, default: Date.now() },
    Discussion: [{ name: String, message: String, createdAt: Date }],
    Expenses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Expenses"
    }],
    Members: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        joinedAt: Date
    }],
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
});

module.exports = mongoose.model("Groups", GroupSchema);
