


const product_collection = require("../db/schemas/product_schema");


const root = async (req, res) => {
    try {
        const product = await product_collection.find({})
        console.log(product)
        res.send(product)
    } catch (error) {
        res.send("we are now online")
    }
};

module.exports = root;