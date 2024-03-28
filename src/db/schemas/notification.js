const mongoose = require("mongoose");


const notificationSchema = new mongoose.Schema({
    img: {
        type: String,
    },
    description: {
        type: String,
        required: true
    },
    title: {
        type: String,
    },
    activeUser: {
        type: Boolean,
        default: false
    },
    nonActiveUser: {
        type: Boolean,
        default: false
    },
    expireTime: {
        type: Date,
    },
    selectedUser: [
        new mongoose.Schema({
            userID: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "user_collectionsss"
            }
        })
    ]

}, { timestamps: true })
const Notification = new mongoose.model("notification", notificationSchema)

module.exports = Notification;