const slider_collection = require("../../db/schemas/slider_schema")


const slider_provider = async (req, res) => {
    try {
        const sliders = await slider_collection.find()
        res.status(200).json(sliders)
    } catch (error) {
        const sliders = await slider_collection.find()
        res.status(200).json(sliders)
    }
};

module.exports = slider_provider;