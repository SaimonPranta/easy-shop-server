const user_collection = require("../../db/schemas/user_schema")

const rechargeRequest = async (req, res) => {
    try {

        const pendingBalanceCount = await user_collection.countDocuments({ "mobileRechareInfo.apporoval": false })    

        const user = await user_collection.aggregate([
            {
                $unwind: "$mobileRechareInfo"
            },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: "$mobileRechareInfo.amount" }
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
                rechargeRequest: pendingBalanceCount,
                totalAmount,
            },
            message: "Documents loaded successfully"
        })
    } catch (error) {
        res.json({
            success: false,
            message: "Internal server error"
        })
    }
}

module.exports = rechargeRequest;