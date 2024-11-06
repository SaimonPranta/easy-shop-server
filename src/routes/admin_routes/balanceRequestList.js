const user_collection = require("../../db/schemas/user_schema")

const balanceRequestList = async (req, res) => {
    try {
        const { page, approve } = req.query
        const query = { "balanceRequestInfo.apporoval": approve === "true" ? true : false }
        const userCount = await user_collection.countDocuments(query)
        const limit = 25;
        //const page = 1;  
        const pageLimit = limit * Number(page); 
        const skip = pageLimit >= userCount ? 0 : userCount - pageLimit;

        const userList = await user_collection.find(query).select("firstName lastName  phoneNumber balanceRequestInfo ").skip(skip).limit(limit)
        res.json({
            success: true,
            message: "Documents loaded successfully",
            users: userList
        })
    } catch (error) {
        res.json({
            success: false,
            message: "Internal server error"
        })
    }
}

module.exports = balanceRequestList;