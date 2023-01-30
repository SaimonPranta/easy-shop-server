const user_collection = require("../../db/schemas/user_schema");

const withdraw_request_approval = async (req, res) => {
    try {
        const { id, requestID, amount } = req.body
        console.log("1st", amount)
        const amountFloor = await Math.floor(amount);
        console.log("2st", amountFloor)


        if (id && requestID && amountFloor) {
            const userVarifing = await user_collection.findOne({ _id: id })
            if (userVarifing._id) {
                const userBalanceFloor = await Math.floor(userVarifing.balance)
                const commition = await (amountFloor / 100) * 5
                const totalWithdraw = await amountFloor + commition
                console.log("3st", amountFloor, commition)

                if (userBalanceFloor >= totalWithdraw) {
                    const balanceCount = await userBalanceFloor - totalWithdraw
                    const user = await user_collection.updateOne(
                        {
                            _id: id,
                            "withdrawInfo.requestID": requestID
                        },
                        {
                            $set: {
                                balance: balanceCount,
                                "withdrawInfo.$.apporoval": true
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


module.exports = withdraw_request_approval;

