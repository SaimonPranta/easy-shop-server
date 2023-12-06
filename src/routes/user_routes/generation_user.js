const user_collection = require("../../db/schemas/user_schema");

const generation_user = async (req, res) => {
    try {
        const id = await req.id
        const hostUser = await user_collection.findOne({ _id: id })
        if (hostUser._id) {
            const arrayOfUser = await [...hostUser.generation_1, ...hostUser.generation_2, ...hostUser.generation_3, ...hostUser.generation_4, ...hostUser.generation_5, ...hostUser.generation_6, ...hostUser.generation_7, ...hostUser.generation_8, ...hostUser.generation_9, ...hostUser.generation_10]
            const userDetailsArray = await user_collection.find({ phoneNumber: arrayOfUser },
                {
                    password: 0
                })

            res.status(200).json(userDetailsArray)
        } else {
            res.status(500).json({ failed: "faild to load user" })
        }
    } catch (error) {
        res.status(500).json({ failed: "faild to load user" })
    }
}

module.exports = generation_user