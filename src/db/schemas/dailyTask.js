const mongoose = require("mongoose");

const dailyTaskSchema = new mongoose.Schema({
    taskListID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "daily_task_list",
        require: true
    },
    // title: {
    //     type: String,
    //     required: true,
    // },
    description: {
        type: String,
        required: true
    },
    img: {
        type: String,
    },
    taskLink: {
        type: String,
        require: true
    },
    autoApprove: {
        type: Boolean,
        require: true,
        default: true
    },
    tutorialLink: {
        type: String,
        require: false
    },
    terminateDate: {
        type: Date, 
    },

}, { timestamps: true })
const DailyTasks = new mongoose.model("daily_task", dailyTaskSchema)

module.exports = DailyTasks;