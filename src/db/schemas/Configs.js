const mongoose = require("mongoose");

const configsSchema = new mongoose.Schema({
    dailyTask: new mongoose.Schema({
        taskRewardsList: {
            type: Array,
            require: true,
            default: [],
        },
        maximumAmount: {
            type: Number,
            require: true,
            default: 0
        }
    })


})
const Configs = new mongoose.model("configs", configsSchema)

module.exports = Configs;