const mongoose = require("mongoose");

const dailyTaskListSchema = new mongoose.Schema({
    currentTaskID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "daily_task"
    }, 
    taskList: [
        new mongoose.Schema({
            taskID: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "daily_task",
                require: true,
            },
        })
    ],
    workedUserList: [
        new mongoose.Schema({
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "user_collectionsss",
                require: true,
            },
            taskID: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "daily_task",
                require: true,
            },
        }, {
            timestamps: true
        })
    ],
    taskStartDate: {
        type: Date,
        require: true,
    },
    taskExpireDate: {
        type: Date,
        require: true,
    },
    inactive: {
        type: Boolean,
        require: false
    }

}, { timestamps: true })
const DailyTaskList = new mongoose.model("daily_task_list", dailyTaskListSchema)

module.exports = DailyTaskList;