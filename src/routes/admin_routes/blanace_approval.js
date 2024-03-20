const user_collection = require("../../db/schemas/user_schema");

const balance_approval = async (req, res) => {
    try {
        const { id, requestID, amount } = req.body
        const amountFloor = await Math.floor(amount);

        if (id && requestID && amountFloor) {
            const userVarifing = await user_collection.findOne({ _id: id })
            if (userVarifing._id) {
                let balanceCount = await Math.floor(userVarifing.balance) + amountFloor
                const updateInfo = {

                }
                if (!userVarifing.isActive && balanceCount >= 150) {
                    updateInfo["isActive"] = true
                    balanceCount = balanceCount - 150
                } 
 
                const user = await user_collection.updateOne(
                    {
                        _id: id,
                        "balanceRequestInfo.requestID": requestID
                    },
                    {
                        $set: {
                            ...updateInfo,
                            balance: balanceCount,
                            "balanceRequestInfo.$.apporoval": true,
                        }
                    }
                )
                if (user.modifiedCount > 0) {
                    res.status(200).json({ sucess: "sucessfuly approved" })
                } else {
                    res.status(500).json({ failed: "Faild to approved" })
                }
            } else {
                res.status(500).json({ failed: "Faild to approved" })
            }
        } else {
            res.status(500).json({ failed: "Faild to approved" })
        }

    } catch (error) {
        res.status(500).json({ failed: "Faild to approved" })
    }
}


module.exports = balance_approval;