const user_collection = require("../db/schemas/user_schema");


const root = async (req, res) => {
    try {
        const currentUserForBalance = await user_collection.findOne({ phoneNumber: 187284398 })

        const balanceCount = await Math.floor(currentUserForBalance.balance) + 5
        const incomeBalanceCount = await Math.floor(currentUserForBalance.totalIncome) + 5
        const currentUser = await user_collection.findOneAndUpdate(
            { phoneNumber: 187284398 },
            {
                $set: {
                    balance: balanceCount,
                    totalIncome: incomeBalanceCount
                },

                $push: { generation_2: { $each: [Math.floor(Math.random() * 10)], $position: 0 } }
            },
            {
                new: true,
                upsert: true
            }
        )
        res.send(currentUser)

        // res.send("we are now online")
    } catch (error) {
        console.log(error)
    }
};

module.exports = root;