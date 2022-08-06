
const user_collection = require("../../db/schemas/user_schema");

const all_user = async (req, res) => {
    try {
        const phoneNumber = await req.phoneNumber;
        const userId = await req.id;
        const user = await user_collection.findOne({ _id: userId, phoneNumber: phoneNumber });
        if (user.role === "admin") {
            const userArray = await user_collection.find();
            if (userArray.length > 0) {
                res.status(200).json(userArray)
            } else {
                res.status(500).json({ failed: "Failed to load data, please try again." })
            }
        } else {
            res.status(500).json({ failed: "Failed to load data, please try again." })
        }
    } catch (error) {

        res.status(500).json({ failed: "Failed to load data, please try again." })

    }
};


module.exports = all_user;