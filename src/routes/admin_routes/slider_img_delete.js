const slider_collection = require("../../db/schemas/slider_schema")


const slider_img_delete = async (req, res) => {
    try {
        const { id } = req.query
        if (id) {
            const deleteSlider = await slider_collection.deleteOne({ _id: id })
            if (deleteSlider.deletedCount > 0) {
                res.status(200).json({ sucess: "sucess" })
            } else {
                res.status(500).json({ failed: "Failed to Delete Iamge, please try again." })
            }
        }
    } catch (error) {
        res.status(500).json({ failed: "Failed to Delete Iamge, please try again." })

    }
}

module.exports = slider_img_delete;