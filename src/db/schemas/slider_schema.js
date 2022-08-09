const mongoose = require("mongoose");


const slider_schema = new mongoose.Schema({
    img: {
        type: String,
        required: true,
        unique: true
    }
})
const slider_collection = new mongoose.model("slider_collectionsss", slider_schema)

module.exports = slider_collection;