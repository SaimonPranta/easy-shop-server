const user_collection = require("../../db/schemas/user_schema")

const withdrawRequestList = async (req, res) => {
    try {
        const {page, approve} = req.query  

        console.log("approve", approve)
        const query = { "withdrawInfo.apporoval": approve === "true" ? true : false }
        const userCount = await user_collection.countDocuments(query)
        const limit = 25; 
        const pageLimit = limit * Number(page);
        const skip = pageLimit >= userCount ? 0 : userCount - pageLimit; 
 
        const userList = await user_collection.find(query).select("firstName lastName  phoneNumber withdrawInfo").skip(skip).limit(limit)
 

 
        res.json({
            success: true,
            message: "Documents loaded successfully",
            users: userList
        })
    } catch (error) {
        console.log("error", error)
        res.json({
            success: false,
            message: "Internal server error"
        })
    }
}

module.exports = withdrawRequestList;