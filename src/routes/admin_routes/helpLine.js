const router = require("express").Router()
const user_collection = require("../../db/schemas/user_schema")
const helplineSocial = require("../../db/schemas/helpLineSocial")
const path = require("path")
const fs = require("fs")
const { helpSocialDirectory } = require("../../constants/storageDirectory")


router.get("/", async (req, res) => {
    try {
        const data = await helplineSocial.find()
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
        let image = req.files
        if (!image) {
            return res.json({
                message: "Failed to add social"
            })
        }
        image = image.img;
        const extension = path.extname(image.name)
        image.name = `${image.name.replace(extension, "")}${Date.now()}${extension}`
        const createdInfo = await helplineSocial.create({ ...data, img: image.name })
        if (!createdInfo) {
            return res.json({
                message: "Failed to add social "
            })
        }
        await image.mv(path.join(__dirname, helpSocialDirectory(), image.name))
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
        const createdInfo = await helplineSocial.findOneAndDelete({ _id: id })
        console.log("createdInfo ==>>", createdInfo)

        if (!createdInfo) {
            return res.json({
                message: "Failed to delete social "
            })
        }

        const filePath = path.join(__dirname, helpSocialDirectory(), createdInfo.img)
        if (fs.existsSync(filePath)) {
            await fs.unlinkSync(filePath)
        }
        res.json({
            data: createdInfo,
            success: true,
            message: "Social item delete successfully"
        })
    } catch (error) {
        console.log(error)
        res.json({
            message: "Failed to delete social "
        })
    }
})

module.exports = router;