const user_collection = require("../../db/schemas/user_schema");
const bcrypt = require("bcrypt");


const password_reset = async (req, res) => {
    try {
        const id = await req.id;
        const { newPassword, oldPassword, confirmPassword } = req.body;

        if (oldPassword && newPassword && confirmPassword && id) {
            const user = await user_collection.findOne({ _id: id });
            if (user._id) {
                bcrypt.compare(oldPassword, user.password, async (err, result) => {
                    if (result) {
                        const hashingPassword = await bcrypt.hash(newPassword, 10)
                        const updateUser = await user_collection.findOneAndUpdate({ _id: id }, {
                            $set: {
                                password: hashingPassword
                            }
                        })
                        if (updateUser._id) {
                            res.status(200).json({ sucess: "Sucessfully reset your password." })
                        }
                    } else {
                        res.status(500).json({ failed: "Failed to reset your password." })
                    }
                })
            }
        }
    } catch (error) {
        res.status(500).json({ failed: "Failed to reset your your password." })
    }
}



module.exports = password_reset;
