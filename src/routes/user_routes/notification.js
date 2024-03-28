const router = require("express").Router()
const user_collection = require("../../db/schemas/user_schema")
const Notification = require("../../db/schemas/notification")
const path = require("path")
const fs = require("fs")

router.get("/", async (req, res) => {
    try {
        const data = await Notification.find({
            $or: [
                { "selectedUser.userID": req.id },
                { userID: { $exists: false } }
            ]
        })
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