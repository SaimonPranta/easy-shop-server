const user_collection = require("../../db/schemas/user_schema");


const update_user = async (req, res) => {
    try {

        const { firstName, lastName, _id } = req.body;

        if (firstName && lastName  && _id) {
            const updateUser = await user_collection.findOneAndUpdate({ _id: _id },
                {
                    $set: {
                        firstName: firstName,
                        lastName: lastName,
                    }
                },
                {
                    new: true
                }).populate([{
                    path: "rankID", 
                  }, {
                    path: "referUser",
                    select: "firstName lastName phoneNumber",
                  }]);
            if (updateUser) {
                updateUser.password = null;
                res.status(200).json({
                    data: updateUser,
                    message: { sucess: "Information has been updated successfully." }
                })
            } else {
                res.status(500).json({ message: { failed: "Failed to update your information, please try again." } })
            }
        }
    } catch (error) {
        res.status(500).json({ message: { failed: "Failed to update your information, please try again." } })
    }
};

module.exports = update_user;