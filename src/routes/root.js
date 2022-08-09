const user_collection = require("../db/schemas/user_schema");


const root = async (req, res) => {
    try {
        res.send("we are now online")
    } catch (error) {
        console.log(error)
    }
};

module.exports = root;