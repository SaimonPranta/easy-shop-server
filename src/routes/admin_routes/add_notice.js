const fs = require('fs-extra')


const add_notice = async (req, res) => {
    try {
        const text = req.body.text

        // const imageUpload = await image.mv(`${__dirname}/../../../src/images/slider_img/${image.name}`)



    } catch (error) {
        res.status(200).json({ failed: "Failed to upload image, please try again" })

    }
}
module.exports = add_notice;