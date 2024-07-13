const mongoose = require("mongoose");

const dailyTaskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
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
    tutorialLink: {
    
        tutorialLink
        
        
           
             sss: {
        type: String,
        require: false
    },
    taskStartDate: {
        type: Date,
        require:true,
    },
    taskExpireDate: {
        type: Date,
        require:true,
    },
    inactive: {
        type: Boolean,
        require: false
    }

}, { timestamps: true })
const DailyTasks = new mongoose.model("helpline_social", dailyTaskSchema)

module.exports = DailyTasks;