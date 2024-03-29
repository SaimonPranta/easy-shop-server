const router = require("express").Router()
const user_collection = require("../../db/schemas/user_schema")
const Notification = require("../../db/schemas/notification")
const path = require("path")
const fs = require("fs")

router.get("/", async (req, res) => {
    try {
        const userInfo = await user_collection.findOne({ _id: req.id }).select("isActive")
        let userStatusQuery = {}
        if (userInfo.isActive) {
            userStatusQuery = {
                activeUser: true
            }
        } else {
            userStatusQuery = {
                nonActiveUser: true
            }
        }
        const data = await Notification.find({
            $or: [
                { ...userStatusQuery },
                { "selectedUser.userID": req.id },
                { userID: { $exists: false } },
                { expireTime: { $gt: new Date() } },
            ]
        }).sort({ createdAt: -1 })
        res.json({
            data: data
        })
    } catch (error) {
        res.json({
            message: "Failed to load social "
        })
    }
})



module.exports = router;