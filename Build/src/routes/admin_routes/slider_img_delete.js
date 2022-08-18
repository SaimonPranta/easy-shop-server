const slider_collection = require("../../db/schemas/slider_schema");
const path = require('path');
const fs = require('fs-extra')

const slider_img_delete = async (req, res) => {
    try {
        const { id } = await req.query
        const imageContaienr = await slider_collection.findOneAndDelete({ _id: id })
        if (imageContaienr.img) {
            const iamgePath = await path.join(__dirname, `../../images/slider_img/${imageContaienr.img}`)
            fs.remove(iamgePath, (error) => {
                if (error) {
                    res.status(500).json({ failed: "Failed to delete image, please try again." })
                } else {
                    res.status(200).json({ sucess: "sucessfully deleted your image" })
                }
            })
        } else {
            res.status(500).json({ failed: "Failed to delete image, please try again." })
        }
    } catch (error) {
        res.status(500).json({ failed: "Failed to delete image, please try again." })
    }
}

module.exports = slider_img_delete;