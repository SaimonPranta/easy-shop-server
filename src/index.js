const express = require('express');
const cors = require('cors');
require("./db/connection");
const user_collection = require("./db/schemas/user_schema");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require('cookie-parser');
const authGard = require('./middleware/authGard');



const app = express();
dotenv.config()

const port = process.env.PORT || 8000




// ====== Middleware =======
app.use(cors())
app.use(express.json())
app.use(cookieParser())



// ====== Root Route =======
app.get('/', (req, res) => {
    res.send("we are now online")
})

// ====== User Registation Route =======
app.post('/user', async (req, res) => {
    try {
        const { firstName, lastName, phoneNumber, referNumber, password } = await req.body
        const hashingPassword = await bcrypt.hash(password, 10)
        const userInfo = await {
            firstName,
            lastName,
            referNumber,
            phoneNumber,
            password: hashingPassword,
        }
        const refNumberChacking = await user_collection.find({ _id: referNumber }).select({
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
                    res.status(500).send({ error: "your porvided Phone Number are already exist, please tryout with another one" })
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
                        res.status(404).send({ error: "failed to Create your account, please tryout latter" })
                    }
                }
            } else {
                res.status(500).send({ error: "your porvided reference Number are not Active" })
            }

        } else {
            res.status(500).send({ error: "your porvided reference Number are invalid" })
        }

    } catch (err) {
        res.status(404).send({ error: "failed to Create your account, please tryout latter" })
    }

});


// ====== User Login Route =======
app.post("/logIn", async (req, res) => {
    try {
        const { singInPhoenNumber, signInPassword } = await req.body
        if (singInPhoenNumber && signInPassword) {
            const userArry = await user_collection.find({ phoneNumber: singInPhoenNumber });
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
                            token: token
                        })
                    } else {
                        res.status(401).json({ error: "user/password are invalid, please try again." })
                    }
                })

            }
        }

    } catch (err) {
        res.status(401).json({ error: "user/password are invalid, please try again." })
    }
})

// ====== Read User Route =======
app.get("/user", authGard, async (req, res) => {
    try {
        const phoneNumber = req.phoneNumber;
        const userId = req.id;
        const user = await user_collection.findOne({ _id: userId, phoneNumber: phoneNumber });
        user.password = null;
        res.status(200).json(user)


    } catch (error) {
        console.log("userErrror", error)
    }

});




// ============= User Activation Route ===================
app.post("/testing", async (req, res) => {
    try {
        const id = await req.query.id

        const user = await user_collection.find({ _id: id })
        let hostUser = await user[0]
        let refUser = {}


        if (hostUser && hostUser.referNumber && !hostUser.isActive) {
            if (!hostUser.isActive) {
                const document = await user_collection.findOneAndUpdate(
                    { _id: hostUser._id.toString() },
                    {
                        $set: { isActive: true }
                    },
                    { new: true }
                )
            }
            for (let i = 1; i <= 10; i++) {
                if (hostUser && hostUser.referNumber && i == 1) {
                    const document = await user_collection.find({ generation_1: hostUser._id.toString() })
                    if (document.length == 0) {
                        const currentUser = await user_collection.findOneAndUpdate(
                            { _id: hostUser.referNumber },
                            {
                                $push: { generation_1: { $each: [hostUser._id.toString()], $position: 0 } }
                            },
                            {
                                new: true,
                                upsert: true
                            }
                        )
                        if (currentUser && currentUser.referNumber) {
                            refUser = currentUser
                        }
                    }
                } else if (refUser && refUser.referNumber != 0 && i == 2) {
                    const document = await user_collection.find({ generation_2: hostUser._id.toString() })
                    if (document.length == 0) {
                        const currentUser = await user_collection.findOneAndUpdate(
                            { _id: refUser.referNumber },
                            {
                                $push: { generation_2: { $each: [hostUser._id.toString()], $position: 0 } }
                            },
                            {
                                new: true,
                                upsert: true
                            }
                        )
                        if (currentUser && currentUser.referNumber) {
                            refUser = currentUser
                        }
                    }
                } else if (refUser && refUser.referNumber != 0 && i == 3) {
                    const document = await user_collection.find({ generation_3: hostUser._id.toString() })
                    if (document.length == 0) {
                        const currentUser = await user_collection.findOneAndUpdate(
                            { _id: refUser.referNumber },
                            {
                                $push: { generation_3: { $each: [hostUser._id.toString()], $position: 0 } }
                            },
                            {
                                new: true,
                                upsert: true
                            }
                        )
                        if (currentUser && currentUser.referNumber) {
                            refUser = currentUser
                        }

                    }
                } else if (refUser && refUser.referNumber != 0 && i == 4) {
                    const document = await user_collection.find({ generation_4: hostUser._id.toString() })
                    if (document.length == 0) {
                        const currentUser = await user_collection.findOneAndUpdate(
                            { _id: refUser.referNumber },
                            {
                                $push: { generation_4: { $each: [hostUser._id.toString()], $position: 0 } }
                            },
                            {
                                new: true,
                                upsert: true
                            }
                        )

                        if (currentUser && currentUser.referNumber) {
                            refUser = currentUser
                        }
                    }
                } else if (refUser && refUser.referNumber != 0 && i == 5) {
                    const document = await user_collection.find({ generation_5: hostUser._id.toString() })
                    if (document.length == 0) {
                        const currentUser = await user_collection.findOneAndUpdate(
                            { _id: refUser.referNumber },
                            {
                                $push: { generation_5: { $each: [hostUser._id.toString()], $position: 0 } }
                            },
                            {
                                new: true,
                                upsert: true
                            }
                        )
                        if (currentUser && currentUser.referNumber) {
                            refUser = currentUser
                        }
                    }
                } else if (refUser && refUser.referNumber != 0 && i == 6) {
                    const document = await user_collection.find({ generation_6: hostUser._id.toString() })
                    if (document.length == 0) {
                        const currentUser = await user_collection.findOneAndUpdate(
                            { _id: refUser.referNumber },
                            {
                                $push: { generation_6: { $each: [hostUser._id.toString()], $position: 0 } }
                            },
                            {
                                new: true,
                                upsert: true
                            }
                        )
                        if (currentUser && currentUser.referNumber) {
                            refUser = currentUser
                        }
                    }
                } else if (refUser && refUser.referNumber != 0 && i == 7) {
                    const document = await user_collection.find({ generation_7: hostUser._id.toString() })
                    if (document.length == 0) {
                        const currentUser = await user_collection.findOneAndUpdate(
                            { _id: refUser.referNumber },
                            {
                                $push: { generation_7: { $each: [hostUser._id.toString()], $position: 0 } }
                            },
                            {
                                new: true,
                                upsert: true
                            }
                        )
                        if (currentUser && currentUser.referNumber) {
                            refUser = currentUser
                        }
                    }
                } else if (refUser && refUser.referNumber != 0 && i == 8) {
                    const document = await user_collection.find({ generation_8: hostUser._id.toString() })
                    if (document.length == 0) {
                        const currentUser = await user_collection.findOneAndUpdate(
                            { _id: refUser.referNumber },
                            {
                                $push: { generation_8: { $each: [hostUser._id.toString()], $position: 0 } }
                            },
                            {
                                new: true,
                                upsert: true
                            }
                        )
                        if (currentUser && currentUser.referNumber) {
                            refUser = currentUser
                        }
                    }
                } else if (refUser && refUser.referNumber != 0 && i == 9) {
                    const document = await user_collection.find({ generation_9: hostUser._id.toString() })
                    if (document.length == 0) {
                        const currentUser = await user_collection.findOneAndUpdate(
                            { _id: refUser.referNumber },
                            {
                                $push: { generation_9: { $each: [hostUser._id.toString()], $position: 0 } }
                            },
                            {
                                new: true,
                                upsert: true
                            }
                        )
                        if (currentUser && currentUser.referNumber) {
                            refUser = currentUser
                        }
                    }
                } else if (refUser && refUser.referNumber != 0 && i == 10) {
                    const document = await user_collection.find({ generation_10: hostUser._id.toString() })
                    if (document.length == 0) {
                        const currentUser = await user_collection.findOneAndUpdate(
                            { _id: refUser.referNumber },
                            {
                                $push: { generation_10: { $each: [hostUser._id.toString()], $position: 0 } }
                            },
                            {
                                new: true,
                                upsert: true
                            }
                        )
                        if (currentUser && currentUser.referNumber) {
                            refUser = currentUser
                        }
                    }
                }
            }
        }
    } catch (error) {
        console.log(error)
    }
})


// ====== User Update Route =======
app.patch("/user", authGard, async (req, res) => {
    try {
        const { firstName, lastName, phoneNumber, _id } = req.body;

        if (firstName && lastName && phoneNumber && _id) {
            const updateUser = await user_collection.findOneAndUpdate({ _id: _id, phoneNumber: phoneNumber },
                {
                    $set: {
                        firstName: firstName,
                        lastName: lastName,
                    }
                },
                {
                    new: true
                })
            if (updateUser) {
                updateUser.password = null;
                res.status(200).json({
                    data: updateUser,
                    message: { sucess: "Sucessfully updated your information." }
                })
            } else {
                res.status(500).json({ message: { failed: "Failed to update your information, please try again." } })
            }
        }
    } catch (error) {
        res.status(500).json({ message: { failed: "Failed to update your information, please try again." } })
    }
});



// ======User Password Reset Route =======
app.patch("/passwordReset", authGard, async (req, res) => {
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
});

// ======Balance Transfer Route =======
app.post("/balance_transfer", authGard, async (req, res) => {
    try {
        console.log("click")
        const id = req.id
        const { amount, selectUser } = req.body;
        console.log(req.body)
        if (id && amount && selectUser) {
            const receiverUser = await user_collection.findOne({ _id: selectUser });
            const provideUser = await user_collection.findOne({ _id: id });
            if (receiverUser._id && provideUser._id) {
                const floorAmount = Math.floor(amount);
                const reciverfloorAmount = Math.floor(receiverUser.balance);
                const providerfloorAmount = Math.floor(provideUser.balance);

                // Receiver Balance Calculation
                const ReceiverMain = reciverfloorAmount + floorAmount;
                // Provaider Balance Calculation
                const providerMainBalance = providerfloorAmount - floorAmount;
                if (providerfloorAmount >= floorAmount) {
                    const receiverUserUpdate = await user_collection.findOneAndUpdate({ _id: selectUser },
                        {
                            $set: {
                                balance: ReceiverMain
                            }
                        });
                    if (receiverUserUpdate._id) {
                        const receiverInfo = await {
                            name: `${receiverUserUpdate.firstName} ${receiverUserUpdate.lastName}`,
                            number: receiverUserUpdate.phoneNumber,
                            amount: floorAmount,
                            date: new Date().toLocaleDateString()
                        }
                        console.log(receiverInfo)
                        const porviderUserUpdate = await user_collection.findOneAndUpdate({ _id: id },
                            {
                                $set: {
                                    balance: providerMainBalance
                                },
                                $push: { balanceTransperInfo: { $each: [receiverInfo], $position: 0 } }
                            },
                            {
                                new: true
                            });
                        res.status(200).json({
                            sucess: `Sucessfully transfer your balance to ${receiverUserUpdate.firstName} ${receiverUserUpdate.lastName}`,
                            data: porviderUserUpdate
                        })
                    }
                } else {
                    res.status(500).json({ failed: "Sorry, you have not sufficient Balance." })
                }
            } else {
                res.status(500).json({ failed: "Failed to transfer balance, please try again." })
            }
        } else {
            res.status(500).json({ failed: "Failed to transfer balance, please try again." })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ failed: "Failed to transfer balance, please try again." })

    }
});




// ====== Error Handling Middleware =======
app.use((error, req, res, next) => {
    if (error.message) {
        res.status(500).send({ error: error.message })
        console.log(error.message)
    } else if (error) {
        res.status(500).send({ error: "Something is wrong, please try out letter" })
        console.log(error)
    }
});



app.listen(port, () => {
    console.log(`listening to port ${port}`)
})


