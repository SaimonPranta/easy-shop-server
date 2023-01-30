const bcrypt = require("bcrypt");
const user_collection = require("../../db/schemas/user_schema");

const admin_update_user = async (req, res) => {
    try {
        const id = await req.body._id
        let hashingPassword = null
        console.log("password", req.body.password , "type :" , typeof req.body.password)

        if (req.body.password) {
            hashingPassword = await bcrypt.hash(req.body.password, 10)
            console.log("password -2", hashingPassword)
        }
        if (id) {
            const userObj = {}
            req.body.firstName ? userObj["firstName"] = await req.body.firstName : null
            req.body.lastName ? userObj["lastName"] = await req.body.lastName : null
            req.body.rank ? userObj["rank"] = await req.body.rank : null
            req.body.balance ? userObj["balance"] = await Math.floor(req.body.balance) : null
            req.body.shoppingBalance ? userObj["shoppingBalance"] = await Math.floor(req.body.shoppingBalance) : null
            hashingPassword ? userObj["password"] = await hashingPassword : null

            const updateUser = await user_collection.findOneAndUpdate({ _id: id },
                {
                    $set: userObj
                },
                {
                    new: true
                })
            if (updateUser._id) {
                updateUser.password = null;
                res.status(200).json({
                    data: updateUser,
                    message: { sucess: "Sucessfully updated user information." }
                })
            } else {
                res.status(500).json({ message: { failed: "Failed to update user information, please try again." } })
            }
        }
    } catch (error) {
        res.status(500).json({ message: { failed: "Failed to update user information, please try again." } })
    }
};

module.exports = admin_update_user;

