const user_collection = require("../../db/schemas/user_schema");

const mobile_recharge_approval = async (req, res) => {
    try {
        const { id, requestID, amount } = req.body
        const amountFloor = await Math.floor(amount);

        if (id && requestID && amountFloor) {
            const userVarifing = await user_collection.findOne({ _id: id })
            if (userVarifing._id) {
                const userBalanceFloor = await Math.floor(userVarifing.balance)
                if (userBalanceFloor >= amountFloor) {
                    const balanceCount = await userBalanceFloor - amountFloor
                    const user = await user_collection.updateOne(
                        {
                            _id: id,
                            "mobileRechareInfo.requestID": requestID
                        },
                        {
                            $set: {
                                balance: balanceCount,
                                "mobileRechareInfo.$.apporoval": true
                            }
                        }
                    )
                    if (user.modifiedCount > 0) {
                        res.status(200).json({ sucess: "sucessfuly approved" })
                    } else {
                        res.status(500).json({ failed: "Faild to approved" })
                    }
                } else {
                    res.status(500).json({ failed: "This user Balance is lower then his request." })

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


module.exports = mobile_recharge_approval;