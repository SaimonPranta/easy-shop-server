const mongoose = require("mongoose");



const helpLineSocialSchema = new mongoose.Schema({
    img: {
        type: String,
        required: true,
    },
    label: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String, 
    },
    buttonName: {
        type: String,
        require: true
    },
    link: {
        type: String,
        require: true
    },
})
const helplineSocial = new mongoose.model("helpline_social", helpLineSocialSchema)

module.exports = helplineSocial;