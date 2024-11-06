const user_collection = require("../../db/schemas/user_schema");
const userActivation = require("./helper/userActivation");

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
 
                const user = await user_collection.findOneAndUpdate(
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
                    }, {
                        new: true
                    }
                )

                if (!user.isActive && user.balance >= 150) {
                    // updateInfo["isActive"] = true
                    // balanceCount = balanceCount - 150
                    userActivation(user._id.toString())
                    
                } 
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