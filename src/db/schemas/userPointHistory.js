const mongoose = require("mongoose");


const userPointHistorySchema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user_collectionsss"
    }, 
    pointAmount: {
        type: Number,
        require: true,
    },
    source: {
        type: String,
        require: true,
        default: "Daily Task",
        enum: ["Daily Task"]
    }
}, {
    timestamps: true
})
const UserPointHistory = new mongoose.model("user_point_history", userPointHistorySchema)

module.exports = UserPointHistory;