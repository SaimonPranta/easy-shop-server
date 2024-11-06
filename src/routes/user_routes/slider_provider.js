const ECommerceSlider = require("../../db/schemas/eCommerce_slider_schema");
const slider_collection = require("../../db/schemas/slider_schema")


const slider_provider = async (req, res) => {
    try { 
        const {tab} = req.query
        let sliders = await slider_collection.find()
        if (tab === "Work Slider") {
         sliders = await slider_collection.find()
            
        } else  if (tab === "E-Commerce Slider") {
         sliders = await ECommerceSlider.find()
            
        } 
        res.status(200).json(sliders)
    } catch (error) { 
        res.status(200).json(sliders)
    }
};

module.exports = slider_provider;