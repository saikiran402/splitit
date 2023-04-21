const mongoose = require("mongoose");

const GroupSchema = new mongoose.Schema({
    GroupName: String,
    GroupDescription: Number,
    Created_on: { type: Date, default: Date.now() },
    Discussion: [{ name: String, message: String, createdAt: Date }],
    Expenses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Expenses"
    }],
    Members: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users"
        },
        joinedAt: Date
    }],
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    },
});

module.exports = mongoose.model("Groups", GroupSchema);
