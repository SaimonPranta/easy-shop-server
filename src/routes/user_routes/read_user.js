const user_collection = require("../../db/schemas/user_schema");

const read_user = async (req, res) => {
    try {
        const phoneNumber = req.phoneNumber.toString()
        const userId = req.id;
        const user = await user_collection.findOne({ _id: userId, phoneNumber: phoneNumber });
        user.password = null;
        res.status(200).json(user)
    } catch (error) {
        res.status(200).json({})
    }
};


module.exports = read_user;

