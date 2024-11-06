
const user_collection = require("../../db/schemas/user_schema");

const all_user = async (req, res) => {
    try {
        const { page, search } = req.query;
        if (!search) {
            return res.status(500).json({ failed: "Failed to load data, please try again." })

        }
        const userLeangth = await user_collection.count()
        const limit = 10;
        const skip = userLeangth > Number(page) * limit ? userLeangth - Number(page) * limit : 0;
        let userArray = await user_collection.find({ $or: [{ phoneNumber: { $regex: search } }, { firstName: { $regex: new RegExp(search, "i") } }, { lastName: { $regex: new RegExp(search, "i") } }] }).limit(50).select("firstName lastName referNumber phoneNumber");

        if (userArray.length > 0) {
            res.status(200).json({ data: userArray })
        } else {
            res.status(500).json({ failed: "Failed to load data, please try again." })
        }

    } catch (error) {
        res.status(500).json({ failed: "Failed to load data, please try again." })

    }
};


module.exports = all_user;