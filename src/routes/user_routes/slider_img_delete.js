const user_collection = require("../../db/schemas/user_schema");

const balance_approval = async (req, res) => {
    try {
        const { id, requestID, amount } = req.body
        const amountFloor = await Math.floor(amount);

        if (id, requestID, amountFloor) {
            const userVarifing = await user_collection.findOne({ _id: id })
            if (userVarifing._id) {
                const balanceCount = await Math.floor(userVarifing.balance) + amountFloor

                const user = await user_collection.updateOne(
                    {
                        _id: id,
                        "balanceRequestInfo.requestID": requestID
                    },
                    {
        