const user_collection = require("../../db/schemas/user_schema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");



const login = async (req, res) => {
    try {
        const { singInPhoenNumber, signInPassword } = await req.body
        if (singInPhoenNumber && signInPassword) {
            const userArry = await user_collection.find({ phoneNumber: singInPhoenNumber.toString() });
            if (userArry.length > 0) {
                bcrypt.compare(signInPassword, userArry[0].password, async (err, result) => {
                    if (result) {
                        const token = await jwt.sign(
                            {
                                phoneNumber: userArry[0].phoneNumber,
                                id: userArry[0]._id
                            },
                            process.env.JWT_SECRET_KEY,
                            { expiresIn: "3d" }
                        );
                        userArry[0].password = null
                        res.status(200).json({
                            data: userArry[0],
                            token: token,
                            sucess: "You are sucessfully login"
                        })
                    } else {
                        res.status(401).json({ failed: "user/password are invalid, please try again." })
                    }
                })

            } else {
                res.status(401).json({ failed: "user/password are invalid, please try again." })
            }
        } else {
            res.status(401).json({ failed: "user/password are invalid, please try again." })
        }

    } catch (err) {
        res.status(401).json({ failed: "user/password are invalid, please try again." })
    }
}





module.exports = login;
