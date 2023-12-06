const user_collection = require("../../db/schemas/user_schema");
const date_provider = require("../../functions/date_provider");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const registation = async (req, res) => {
    try {
        const { firstName, lastName, phoneNumber, referNumber, password } = await req.body

        if (referNumber && phoneNumber) {
            const hashingPassword = await bcrypt.hash(password, 10)
            const userInfo = await {
                firstName,
                lastName,
                referNumber: referNumber,
                phoneNumber: phoneNumber,
                password: hashingPassword,
                joinDate: date_provider(new Date())
            }
            const refNumberChacking = await user_collection.find({ phoneNumber: referNumber }).select({
                phoneNumber: 1,
                referNumber: 1,
                isActive: 1
            })
            if (refNumberChacking && refNumberChacking.length > 0) {
                if (refNumberChacking[0].isActive) {
                    const phoneNumberChacking = await user_collection.find({ phoneNumber: phoneNumber }).select({
                        phoneNumber: 1,
                        referNumber: 1,
                    })

                    if (phoneNumberChacking && phoneNumberChacking.length > 0) {
                        res.status(500).send({ failed: "your porvided Phone Number are already exist, please tryout with another one" })
                    } else {
                        const documents = await new user_collection(userInfo)
                        const createdUser = await documents.save()
                        if (createdUser.phoneNumber) {
                            const token = await jwt.sign(
                                {
                                    phoneNumber: createdUser.phoneNumber,
                                    id: createdUser._id
                                },
                                process.env.JWT_SECRET_KEY,
                                { expiresIn: "1d" }
                            );
                            createdUser.password = null

                            res.status(201).json({
                                data: createdUser,
                                sucess: "sucessfully created your accout",
                                token: token
                            })
                        } else {
                            res.status(404).send({ failed: "failed to Create your account, please tryout latter" })
                        }
                    }
                } else {
                    res.status(500).send({ failed: "your porvided reference Number are not Active" })
                }

            } else {
                res.status(500).send({ failed: "your porvided reference Number are invalid" })
            }
        } else {
            res.status(500).send({ failed: "your porvided Reference number & Phone Nmuber must be number" })
        }

    } catch (err) {
        res.status(404).send({ failed: "failed to Create your account, please tryout latter" })
    }
};

module.exports = registation;