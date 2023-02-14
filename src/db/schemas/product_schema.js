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
    price: {
        type: Number,
        required: true,
    },
    discount: {
        type: Number,
        required: true,
        default: 0
    },
    img: {
        type: String,
        required: true,
        unique:true
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
    trific: {
        type: Number,
        required: true,
        default: 0,
    },
    viewAs: {
        type: String,
        default: "general",
    }
}, {
    timestamps: true
});



const product_collection = new mongoose.model("product_collectionss", product_schema);

module.exports = product_collection;