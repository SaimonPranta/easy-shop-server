const user_collection = require("../../db/schemas/user_schema")

const userCount = async (req, res) => {
    try {
        const count = {
            total: 0,
            activeUser: 0,
            unactiveUser: 0,
            totalUserBalance: 0,
            totalActiveUserBalance: 0
        }
        count.total = await user_collection.find({}).count()
        count.activeUser = await user_collection.find({ isActive: true }).count()
        count.unactiveUser = await user_collection.find({ isActive: false }).count()
        const totalUserBalance = await user_collection.aggregate([
            {
                $match: {
                    isActive: true
                }
            },
            {
                $group: {
                    _id: null,
                    totalBalalnce: { $sum: "$balance" }
                }
            }
        ])
        const totalActiveUserBalance = await user_collection.aggregate([
            {
                $match: {
                    isActive: true
                }
            },
            {
                $group: {
                    _id: null,
                    totalBalalnce: { $sum: "$balance" }
                }
            }
        ])
        count.totalUserBalance =  totalUserBalance[0].totalBalalnce
        count.totalActiveUserBalance =  totalActiveUserBalance[0].totalBalalnce;

        res.json({
            count,
            message: "Seccessfully load information",
            success: true
        })

    } catch (error) {
        res.json({
            message: "Internal server error",
            success: false
        })
    }
}


module.exports = userCount