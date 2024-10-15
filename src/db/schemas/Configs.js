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
        },
        tutorialVideoId: {
            type: String,
            require: true,
            default: ""
        }
    }),
    withdraw: new mongoose.Schema({
        withdrawCost: {
            type: Number,
            require: true,
            default: 0,
        },
        withdrawAmounts: [
            new mongoose.Schema({
                balance: {
                    type: Number,
                    require: true
                }
            })
        ],
        paymentMethods: new mongoose.Schema({
            bikash: {
                type: Boolean,
                require: true,
                default: false
            },
            nagad: {
                type: Boolean,
                require: true,
                default: false
            },
            rocket: {
                type: Boolean,
                require: true,
                default: false
            },
            upay: {
                type: Boolean,
                require: true,
                default: false
            }
        }),
        balances: new mongoose.Schema({
            mainBalance: {
                type: Boolean,
                require: true,
                default: false
            },
            salesBalance: {
                type: Boolean,
                require: true,
                default: false
            },
            taskBalance: {
                type: Boolean,
                require: true,
                default: false
            }
        }),
    }),


})
const Configs = new mongoose.model("configs", configsSchema)

module.exports = Configs;