const fs = require('fs-extra')
const slider_collection = require("../../db/schemas/slider_schema");

const add_slider_img = async (req, res) => {
    try {
        const image = await req.files.image
        if (
            image.mimetype !== "image/jpg" &&
            image.mimetype !== "image/png" &&
            image.mimetype !== "image/jpeg"
        ) {
            res.status(500).send({ failed: "Only .jpg .png or .jpeg format allowed!" })
        } else if (image.size >= "1500012") {
            res.status(500).send({ failed: "File are too large!" })
        } else {
            const extention = await image.mimetype.split("/")[1]
            image.name = await image.name.split(".")[0] + Math.floor(Math.random() * 10) + Date.now() + "." + extention
            const imageUpload = await image.mv(`${__dirname}/../../../src/images/slider_img/${image.name}`)

            const imgInfo = await {
                img: image.name
            }
            const imgOutPut = await slider_collection(imgInfo)
            const createdUser = await imgOutPut.save()
            if (createdUser._id) {
                const allIamge = await slider_collection.find({})
                res.status(200).json({ sucess: "Iamge upload sucessfull" })
            } else {
                res.status(200).json({ failed: "Failed to upload image, please try again" })
            }
        }
    } catch (error) {
        res.status(200).json({ failed: "Failed to upload image, please try again" })

    }
}


module.exports = add_slider_img;