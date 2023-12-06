const user_collection = require("../../db/schemas/user_schema");


const generation_list = async (req, res) => {
    try {
        const { generation } = await req.query
        const id = await req.id
        const user = await user_collection.findOne({ _id: id });
        // const userCopy = {...user}
        let userArray = []

        if (generation == 1) {
            user.generation_1.map(async (phoneNum) => {
                const currentUser = await user_collection.findOne({ phoneNumber: phoneNum })
                currentUser.password = null;
                userArray.push(currentUser)
                if (user.generation_1.length == userArray.length) {
                    res.status(200).json(userArray)
                }
            })
        } else if (generation == 2) {
            user.generation_2.map(async (phoneNum) => {
                const currentUser = await user_collection.findOne({ phoneNumber: phoneNum })
                currentUser.password = null;
                userArray.push(currentUser)
                if (user.generation_2.length == userArray.length) {
                    res.status(200).json(userArray)
                }
            })
        } else if (generation == 3) {
            user.generation_3.map(async (phoneNum) => {
                const currentUser = await user_collection.findOne({ phoneNumber: phoneNum })
                currentUser.password = null;
                userArray.push(currentUser)
                if (user.generation_3.length == userArray.length) {
                    res.status(200).json(userArray)
                }
            })
        } else if (generation == 4) {
            user.generation_4.map(async (phoneNum) => {
                const currentUser = await user_collection.findOne({ phoneNumber: phoneNum })
                currentUser.password = null;
                userArray.push(currentUser)
                if (user.generation_4.length == userArray.length) {
                    res.status(200).json(userArray)
                }
            })
        } else if (generation == 5) {
            user.generation_5.map(async (phoneNum) => {
                const currentUser = await user_collection.findOne({ phoneNumber: phoneNum })
                currentUser.password = null;
                userArray.push(currentUser)
                if (user.generation_5.length == userArray.length) {
                    res.status(200).json(userArray)
                }
            })
        } else if (generation == 6) {
            user.generation_6.map(async (phoneNum) => {
                const currentUser = await user_collection.findOne({ phoneNumber: phoneNum })
                currentUser.password = null;
                userArray.push(currentUser)
                if (user.generation_6.length == userArray.length) {
                    res.status(200).json(userArray)
                }
            })
        } else if (generation == 7) {
            user.generation_7.map(async (phoneNum) => {
                const currentUser = await user_collection.findOne({ phoneNumber: phoneNum })
                currentUser.password = null;
                userArray.push(currentUser)
                if (user.generation_7.length == userArray.length) {
                    res.status(200).json(userArray)
                }
            })
        } else if (generation == 8) {
            user.generation_8.map(async (phoneNum) => {
                const currentUser = await user_collection.findOne({ phoneNumber: phoneNum })
                currentUser.password = null;
                userArray.push(currentUser)
                if (user.generation_8.length == userArray.length) {
                    res.status(200).json(userArray)
                }
            })
        } else if (generation == 9) {
            user.generation_9.map(async (phoneNum) => {
                const currentUser = await user_collection.findOne({ phoneNumber: phoneNum })
                currentUser.password = null;
                userArray.push(currentUser)
                if (user.generation_9.length == userArray.length) {
                    res.status(200).json(userArray)
                }
            })
        } else if (generation == 10) {
            user.generation_10.map(async (phoneNum) => {
                const currentUser = await user_collection.findOne({ phoneNumber: phoneNum })
                currentUser.password = null;
                userArray.push(currentUser)
                if (user.generation_10.length == userArray.length) {
                    res.status(200).json(userArray)
                }
            })
        } else {
            res.status(500).json({faild: "failed to load data."})
        }
    } catch (error) {
        res.status(500).json({faild: "failed to load data."})
    }
};

module.exports = generation_list;