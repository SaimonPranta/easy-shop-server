const mongoose = require("mongoose");


const product_schema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    dis: {
        type: String,
        required: true,
    },
    img: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
    },
    detailsArray: [
        new mongoose.Schema({
            property: {
                type: String,
                required: true
            },
            value: {
                type: String,
                required: true
            }
        })
    ],
    img: {
        type: String,
        required: true,
        unique: true
    }
});

const product_collection = new mongoose.model("product_collectionss", product_schema);

module.exports = product_collection;