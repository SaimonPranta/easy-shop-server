const user_collection = require("../db/schemas/user_schema");


const root = async (req, res) => {
    try {
        res.send("we are now online")
    } catch (error) {
        res.send("we are now online")
    }
};

module.exports = root;