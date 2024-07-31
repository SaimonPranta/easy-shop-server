const mongoose = require("mongoose");

const userTaskHistorySchema = new mongoose.Schema({
    taskListID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "daily_task_list",
        require: true
    }, 
    dailyTaskID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "daily_task",
        require: true
    }, 
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user_collectionsss",
        require: true
    }, 
    completed: {
        type: Boolean,
        required: true,
        default: true,
    },
    rejected: {
        type: Boolean, 
        required: true,
        default: false,
    },
    

}, { timestamps: true })
const UserTaskHIstory = new mongoose.model("user_task_history", userTaskHistorySchema)

module.exports = UserTaskHIstory;