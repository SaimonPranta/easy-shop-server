


const product_collection = require("../db/schemas/product_schema");
const { storageDirectory } = require('../constants/storageDirectory')

const root = async (req, res) => {
    try {  

        // const product = await product_collection.findOne({})
        res.json({storagePath: storageDirectory()})
    } catch (error) {
        res.send("we are now online")
    }
};


module.exports = root;