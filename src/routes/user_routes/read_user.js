const user_collection = require("../../db/schemas/user_schema");

const read_user = async (req, res) => {
    try {
        const phoneNumber = req.phoneNumber;
        const userId = req.id;
        const user = await user_collection.findOne({ _id: userId, phoneNumber: phoneNumber });
        user.password = null;
        res.status(200).json(user)
    } catch (error) {
        console.log("")
    }
};


module.exports = read_user;