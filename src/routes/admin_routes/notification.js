const router = require("express").Router()
const user_collection = require("../../db/schemas/user_schema")
const Notification = require("../../db/schemas/notification")
const path = require("path")
const fs = require("fs")


router.get("/", async (req, res) => {
    try {
        const data = await Notification.find().populate({
            path: 'selectedUser.userID',
            select: 'phoneNumber firstName lastName'
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
router.post("/", async (req, res) => {
    try {
        const data = JSON.parse(req.body.data)

        console.log("data ==>>", data)
        let image = req.files

        if (!data.description) {
            return res.json({
                message: "Failed to add social"
            })
        }

        if (data.expireTime) {
            const date = new Date(data.expireTime)
            date.setHours(11)
            date.setMinutes(59)
            date.setSeconds(59)
            data.expireTime = date
        }
        if (data.allowNotice) {
            if (data.allowNotice === "activeUser") {
                data.activeUser = true
            } else if (data.allowNotice === "nonActiveUser") {
                data.nonActiveUser = true
            } else if (data.allowNotice === "allUser") {
                data.activeUser = true
                data.nonActiveUser = true
            }
        }

         
        const createInfo = { ...data }
        if (image) {
            image = image.img;
            const extension = path.extname(image.name)
            image.name = `${image.name.replace(extension, "")}${Date.now()}${extension}`
            createInfo["img"] = image.name
        }
        const createdInfo = await Notification.create({ ...createInfo })
        if (!createdInfo) {
            return res.json({
                message: "Failed to add social "
            })
        }
        if (createdInfo.img) {
            await image.mv(path.join(__dirname, "../../../images/notification", image.name))
        }
        res.json({
            data: createdInfo
        })
    } catch (error) {
        res.json({
            message: "Failed to add social "
        })
    }
})
router.delete("/", async (req, res) => {
    try {
        const { id } = req.query
        const createdInfo = await Notification.findOneAndDelete({ _id: id })

        if (!createdInfo) {
            return res.json({
                message: "Failed to delete social "
            })
        }
        if (createdInfo.img) {
            const filePath = path.join(__dirname, "../../../images/notification", createdInfo.img)
            if (fs.existsSync(filePath)) {
                await fs.unlinkSync(filePath)
            }
        }

        res.json({
            data: createdInfo,
            success: true,
            message: "Social item delete successfully"
        })
    } catch (error) {
        res.json({
            message: "Failed to delete social "
        })
    }
})

module.exports = router;