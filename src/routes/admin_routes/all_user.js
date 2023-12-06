
const user_collection = require("../../db/schemas/user_schema");

const all_user = async (req, res) => {
    try {
        const { page, search } = req.query;

        const phoneNumber = await req.phoneNumber;
        const userId = await req.id;
        const user = await user_collection.findOne({ _id: userId, phoneNumber: phoneNumber });
        if (user.role === "admin") {
            const userLeangth = await user_collection.count()
            const limit = 10;
            const skip = userLeangth > Number(page) * limit ? userLeangth - Number(page) * limit : 0;
            let userArray = []
            if (search) {
                userArray = await user_collection.find({ phoneNumber: { $regex: search } }).limit(50);
                //    userArray = await user_collection.find({ phoneNumber: { $regex: search ? search : "" } }).skip(skip).limit(limit);
            } else {
                userArray = await user_collection.find().skip(skip).limit(limit);
            }
 

            if (userArray.length > 0) {
                res.status(200).json(userArray)
            } else {
                res.status(500).json({ failed: "Failed to load data, please try again." })
            }
        } else {
            res.status(500).json({ failed: "Failed to load data, please try again." })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ failed: "Failed to load data, please try again." })

    }
};


module.exports = all_user;