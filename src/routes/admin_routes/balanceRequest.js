const user_collection = require("../../db/schemas/user_schema")

const balanceRequest = async (req, res) => {
    try {

        const pendingBalanceCount = await user_collection.countDocuments({ "balanceRequestInfo.apporoval": false })    

        const user = await user_collection.aggregate([
            {
                $unwind: "$balanceRequestInfo"
            },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: "$balanceRequestInfo.amount" }
                }
            }
        ]) 
        let totalAmount = 0
        if (user && user.length) {
            totalAmount =  user[0].totalAmount
        }

        res.json({
            success: true,
            count: {
                balanceRequest: pendingBalanceCount,
                totalAmount,
            },
            message: "Documents loaded successfully"
        })
    } catch (error) {
        console.log("error", error)
        res.json({
            success: false,
            message: "Internal server error"
        })
    }
}

module.exports = balanceRequest;