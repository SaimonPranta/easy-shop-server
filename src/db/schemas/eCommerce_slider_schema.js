const mongoose = require("mongoose");


const eCommerceSchema = new mongoose.Schema({
    img: {
        type: String,
        required: true,
        unique: true
    }
})
const ECommerceSlider = new mongoose.model("e-commerce-slider", eCommerceSchema)

module.exports = ECommerceSlider;