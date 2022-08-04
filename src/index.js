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
