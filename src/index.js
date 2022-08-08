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
const root = require("./routes/root")
const registation = require("./routes/user_routes/registation");
const login = require("./routes/user_routes/login");
const read_user = require("./routes/user_routes/read_user");
const update_user = require("./routes/user_routes/update_user");
const password_reset = require("./routes/user_routes/password_reset");
const balance_transfer = require("./routes/user_routes/balance_transfer");
const balance_request = require("./routes/user_routes/balance_request");
const mobile_rechare = require("./routes/user_routes/mobile_recharge");
const withdraw = require("./routes/user_routes/withdraw");
const generation_list = require("./routes/user_routes/generation_list");
const adminAuthGard = require("./middleware/adminAuthGard");
const all_user = require("./routes/admin_routes/all_user");
const user_dtails = require("./routes/admin_routes/user_dtails");
const balance_approval = require("./routes/admin_routes/blanace_approval");
const app = express();
dotenv.config()

const port = process.env.PORT || 8000




// ====== Middleware ======
app.use(cors())
app.use(express.json())
app.use(cookieParser())



// ====== Root Route ======
app.get('/', root);
// ====== User Registation Route ======
app.post('/user', registation);
// ====== User Login Route ======
app.post("/logIn", login)
// ====== Read User Route ======
app.get("/user", authGard, read_user);
// ====== User Activation Route ======
app.post("/activation", async (req, res) => {
    try {
        const id = await req.query.id

        const user = await user_collection.find({ _id: id })
        let hostUser = await user[0]
        let refUser = {}
        const floorBalance = await Math.floor(hostUser.balance)
        const floorShoppingBalance = await Math.floor(hostUser.shoppingBalance)


        if (hostUser && hostUser.referNumber && !hostUser.isActive) {
            if (floorBalance >= 50) {
                const countBalance = floorBalance - 50 
                const countShoppingBalance = floorShoppingBalance + 50

                const activeHostUser = await user_collection.findOneAndUpdate(
                    { _id: hostUser._id.toString() },
                    {
                        $set: { 
                            balance: countBalance,
                            shoppingBalance: countShoppingBalance,
                            isActive: true
                         }
                    },
                    { new: true }
                )

                for (let i = 1; i <= 10; i++) {
                    if (hostUser && hostUser._id && hostUser.referNumber && i == 1) {
                        const document = await user_collection.find({ generation_1: Math.floor(hostUser.phoneNumber) })
                        if (document.length == 0) {
                            const currentUserForBalance = await user_collection.findOne({ phoneNumber: Math.floor(hostUser.referNumber) })
                            if (currentUserForBalance._id) {
                                let balanceCount = await Math.floor(currentUserForBalance.balance) + 15
                                let incomeBalanceCount = await Math.floor(currentUserForBalance.totalIncome) + 15

                                const currentUser = await user_collection.findOneAndUpdate(
                                    { phoneNumber: Math.floor(hostUser.referNumber) },
                                    {
                                        $set: {
                                            balance: balanceCount,
                                            totalIncome: incomeBalanceCount
                                        },
                                        $push: { generation_1: { $each: [Math.floor(hostUser.phoneNumber)], $position: 0 } }
                                    },
                                    {
                                        new: true,
                                        upsert: true
                                    }
                                )

                                if (currentUser && currentUser.referNumber) {
                                    refUser = currentUser
                                } else {
                                    refUser = {}
                                }
                            } else {

                            }
                        }
                    } else if (refUser && refUser._id && refUser.referNumber != 0 && i == 2) {

                        const document = await user_collection.find({ generation_2: Math.floor(hostUser.phoneNumber) })
                        if (document.length == 0) {
                            const currentUserForBalance = await user_collection.findOne({ phoneNumber: Math.floor(refUser.referNumber) })
                            if (currentUserForBalance._id) {
                                let balanceCount = await Math.floor(currentUserForBalance.balance) + 5
                                let incomeBalanceCount = await Math.floor(currentUserForBalance.totalIncome) + 5

                                const currentUser = await user_collection.findOneAndUpdate(
                                    { phoneNumber: Math.floor(refUser.referNumber) },
                                    {
                                        $set: {
                                            balance: balanceCount,
                                            totalIncome: incomeBalanceCount
                                        },
                                        $push: { generation_2: { $each: [Math.floor(hostUser.phoneNumber)], $position: 0 } }
                                    },
                                    {
                                        new: true,
                                        upsert: true
                                    }
                                )
                                if (currentUser && currentUser.referNumber) {
                                    refUser = currentUser
                                } else {
                                    refUser = {}
                                }
                            } else {

                            }
                        }
                    } else if (refUser && refUser._id && refUser.referNumber != 0 && i == 3) {

                        const document = await user_collection.find({ generation_3: Math.floor(hostUser.phoneNumber) })
                        if (document.length == 0) {
                            const currentUserForBalance = await user_collection.findOne({ phoneNumber: Math.floor(refUser.referNumber) })
                            if (currentUserForBalance._id) {
                                let balanceCount = await Math.floor(currentUserForBalance.balance) + 3
                                let incomeBalanceCount = await Math.floor(currentUserForBalance.totalIncome) + 3

                                const currentUser = await user_collection.findOneAndUpdate(
                                    { phoneNumber: Math.floor(refUser.referNumber) },
                                    {
                                        $set: {
                                            balance: balanceCount,
                                            totalIncome: incomeBalanceCount
                                        },
                                        $push: { generation_3: { $each: [Math.floor(hostUser.phoneNumber)], $position: 0 } }
                                    },
                                    {
                                        new: true,
                                        upsert: true
                                    }
                                )

                                if (currentUser && currentUser.referNumber) {
                                    refUser = currentUser
                                } else {
                                    refUser = {}
                                }

                            } else {

                            }
                        }
                    } else if (refUser && refUser._id && refUser.referNumber != 0 && i == 4) {

                        const document = await user_collection.find({ generation_4: Math.floor(hostUser.phoneNumber) })
                        if (document.length == 0) {
                            const currentUserForBalance = await user_collection.findOne({ phoneNumber: Math.floor(refUser.referNumber) })
                            if (currentUserForBalance._id) {
                                let balanceCount = await Math.floor(currentUserForBalance.balance) + 2
                                let incomeBalanceCount = await Math.floor(currentUserForBalance.totalIncome) + 2

                                const currentUser = await user_collection.findOneAndUpdate(
                                    { phoneNumber: Math.floor(refUser.referNumber) },
                                    {
                                        $set: {
                                            balance: balanceCount,
                                            totalIncome: incomeBalanceCount
                                        },
                                        $push: { generation_4: { $each: [Math.floor(hostUser.phoneNumber)], $position: 0 } }
                                    },
                                    {
                                        new: true,
                                        upsert: true
                                    }
                                )

                                if (currentUser && currentUser.referNumber) {
                                    refUser = currentUser
                                } else {
                                    refUser = {}
                                }

                            } else {

                            }
                        }
                    } else if (refUser && refUser._id && refUser.referNumber != 0 && i == 5) {

                        const document = await user_collection.find({ generation_5: Math.floor(hostUser.phoneNumber) })
                        if (document.length == 0) {
                            const currentUserForBalance = await user_collection.findOne({ phoneNumber: Math.floor(refUser.referNumber) })
                            if (currentUserForBalance._id) {
                                let balanceCount = await Math.floor(currentUserForBalance.balance) + 1
                                let incomeBalanceCount = await Math.floor(currentUserForBalance.totalIncome) + 1

                                const currentUser = await user_collection.findOneAndUpdate(
                                    { phoneNumber: Math.floor(refUser.referNumber) },
                                    {
                                        $set: {
                                            balance: balanceCount,
                                            totalIncome: incomeBalanceCount
                                        },
                                        $push: { generation_5: { $each: [Math.floor(hostUser.phoneNumber)], $position: 0 } }
                                    },
                                    {
                                        new: true,
                                        upsert: true
                                    }
                                )

                                if (currentUser && currentUser.referNumber) {
                                    refUser = currentUser
                                } else {
                                    refUser = {}
                                }
                            } else {

                            }
                        }
                    } else if (refUser && refUser._id && refUser.referNumber != 0 && i == 6) {

                        const document = await user_collection.find({ generation_6: Math.floor(hostUser.phoneNumber) })
                        if (document.length == 0) {
                            const currentUserForBalance = await user_collection.findOne({ phoneNumber: Math.floor(refUser.referNumber) })
                            if (currentUserForBalance._id) {
                                let balanceCount = await Math.floor(currentUserForBalance.balance) + 1
                                let incomeBalanceCount = await Math.floor(currentUserForBalance.totalIncome) + 1

                                const currentUser = await user_collection.findOneAndUpdate(
                                    { phoneNumber: Math.floor(refUser.referNumber) },
                                    {
                                        $set: {
                                            balance: balanceCount,
                                            totalIncome: incomeBalanceCount
                                        },
                                        $push: { generation_6: { $each: [Math.floor(hostUser.phoneNumber)], $position: 0 } }
                                    },
                                    {
                                        new: true,
                                        upsert: true
                                    }
                                )

                                if (currentUser && currentUser.referNumber) {
                                    refUser = currentUser
                                } else {
                                    refUser = {}
                                }

                            } else {

                            }
                        }
                    } else if (refUser && refUser._id && refUser.referNumber != 0 && i == 7) {

                        const document = await user_collection.find({ generation_7: Math.floor(hostUser.phoneNumber) })
                        if (document.length == 0) {
                            const currentUserForBalance = await user_collection.findOne({ phoneNumber: Math.floor(refUser.referNumber) })
                            if (currentUserForBalance._id) {
                                let balanceCount = await Math.floor(currentUserForBalance.balance) + 1
                                let incomeBalanceCount = await Math.floor(currentUserForBalance.totalIncome) + 1

                                const currentUser = await user_collection.findOneAndUpdate(
                                    { phoneNumber: Math.floor(refUser.referNumber) },
                                    {
                                        $set: {
                                            balance: balanceCount,
                                            totalIncome: incomeBalanceCount
                                        },
                                        $push: { generation_7: { $each: [Math.floor(hostUser.phoneNumber)], $position: 0 } }
                                    },
                                    {
                                        new: true,
                                        upsert: true
                                    }
                                )

                                if (currentUser && currentUser.referNumber) {
                                    refUser = currentUser
                                } else {
                                    refUser = {}
                                }

                            } else {

                            }
                        }
                    } else if (refUser && refUser._id && refUser.referNumber != 0 && i == 8) {

                        const document = await user_collection.find({ generation_8: Math.floor(hostUser.phoneNumber) })
                        if (document.length == 0) {
                            const currentUserForBalance = await user_collection.findOne({ phoneNumber: Math.floor(refUser.referNumber) })
                            if (currentUserForBalance._id) {
                                let balanceCount = await Math.floor(currentUserForBalance.balance) + 1
                                let incomeBalanceCount = await Math.floor(currentUserForBalance.totalIncome) + 1

                                const currentUser = await user_collection.findOneAndUpdate(
                                    { phoneNumber: Math.floor(refUser.referNumber) },
                                    {
                                        $set: {
                                            balance: balanceCount,
                                            totalIncome: incomeBalanceCount
                                        },
                                        $push: { generation_8: { $each: [Math.floor(hostUser.phoneNumber)], $position: 0 } }
                                    },
                                    {
                                        new: true,
                                        upsert: true
                                    }
                                )

                                if (currentUser && currentUser.referNumber) {
                                    refUser = currentUser
                                } else {
                                    refUser = {}
                                }

                            } else {

                            }
                        }
                    } else if (refUser && refUser._id && refUser.referNumber != 0 && i == 9) {

                        const document = await user_collection.find({ generation_9: Math.floor(hostUser.phoneNumber) })
                        if (document.length == 0) {
                            const currentUserForBalance = await user_collection.findOne({ phoneNumber: Math.floor(refUser.referNumber) })
                            if (currentUserForBalance._id) {
                                let balanceCount = await Math.floor(currentUserForBalance.balance) + 1
                                let incomeBalanceCount = await Math.floor(currentUserForBalance.totalIncome) + 1

                                const currentUser = await user_collection.findOneAndUpdate(
                                    { phoneNumber: Math.floor(refUser.referNumber) },
                                    {
                                        $set: {
                                            balance: balanceCount,
                                            totalIncome: incomeBalanceCount
                                        },
                                        $push: { generation_9: { $each: [Math.floor(hostUser.phoneNumber)], $position: 0 } }
                                    },
                                    {
                                        new: true,
                                        upsert: true
                                    }
                                )

                                if (currentUser && currentUser.referNumber) {
                                    refUser = currentUser
                                } else {
                                    refUser = {}
                                }
                            } else {

                            }
                        }
                    } else if (refUser && refUser._id && refUser.referNumber != 0 && i == 10) {

                        const document = await user_collection.find({ generation_10: Math.floor(hostUser.phoneNumber) })
                        if (document.length == 0) {
                            const currentUserForBalance = await user_collection.findOne({ phoneNumber: Math.floor(refUser.referNumber) })
                            if (currentUserForBalance._id) {
                                let balanceCount = await Math.floor(currentUserForBalance.balance) + 1
                                let incomeBalanceCount = await Math.floor(currentUserForBalance.totalIncome) + 1

                                const currentUser = await user_collection.findOneAndUpdate(
                                    { phoneNumber: Math.floor(refUser.referNumber) },
                                    {
                                        $set: {
                                            balance: balanceCount,
                                            totalIncome: incomeBalanceCount
                                        },
                                        $push: { generation_10: { $each: [Math.floor(hostUser.phoneNumber)], $position: 0 } }
                                    },
                                    {
                                        new: true,
                                        upsert: true
                                    }
                                )

                                if (currentUser && currentUser.referNumber) {
                                    refUser = currentUser
                                } else {
                                    refUser = {}
                                }
                            } else {

                            }
                        }
                    }
                }
            } else {
                res.status(500).json({ failed: "You have not enough balance to active your account, please increase your balance and try again" })
            }
        } else {
            res.status(500).json({ failed: "Something is wrong, please try again" })
        }
    } catch (error) {
        res.status(500).json({ failed: "Something is wrong, please try again" })
    }
})


// ====== User Update Route ======
app.patch("/user", authGard, update_user);
// ======User Password Reset Route ======
app.patch("/passwordReset", authGard, password_reset);
// ======Balance Transfer Route ======
app.post("/balance_transfer", authGard, balance_transfer);
// ======Balance Request Route ======
app.post("/balance_request", authGard, balance_request);


// ======Mobile Recharge Route ======
app.post("/mobile_rechare", authGard, mobile_rechare);
// ======Withdraw Route ======
app.post("/withdraw", authGard, withdraw);

// ======Generation User list Route ======
app.get("/generation", authGard, generation_list);



// ======Admin All User Read Route ======
app.get("/admin/users", adminAuthGard, all_user);
// ======Admin User Details Read Route ======
app.get("/user/userDetails", user_dtails)

// ======Admin Balance Requesst Approval Route ======
app.post("/blanace_approval", adminAuthGard, balance_approval)






// ====== Error Handling Middleware ======
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
});








