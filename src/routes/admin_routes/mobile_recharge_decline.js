
const user_collection = require("../../db/schemas/user_schema");

const mobile_recharge_decline = async (req, res) => {
    try {
        const { id, requestID } = req.body
        const userVarifing = await user_collection.findOne({ _id: id })
        if (userVarifing._id) {
            const currentUser = await user_collection.findOneAndUpdate(
                {
                    _id: id,
                    "mobileRechareInfo.requestID": requestID
                },
                {
                    $pull: { mobileRechareInfo: { requestID: requestID } }
                }

            )

            if (currentUser._id) {
                res.status(200).json({ sucess: "sucessfuly approved" })
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


module.exports = mobile_recharge_decline;