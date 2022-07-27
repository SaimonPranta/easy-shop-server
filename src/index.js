const express = require('express');
const cors = require('cors');
require("./db/connection");
const user_collection = require("./db/schemas/user_schema");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");




const app = express();
dotenv.config()

const port = process.env.PORT || 8000




// ====== Middleware =======
app.use(cors())
app.use(express.json())



// ====== Root Route =======
app.get('/', async (req, res) => {
    try {
        for (let i = 0; i <= 7; i++) {
            console.log(`start ${i}`)
            if (i == 1) {
                console.log(i)
            }else if (i == 2) {
                console.log(i)
            }
            else if (i == 3) {
                console.log(i)
            }
            else if (i == 4) {
                console.log(i)
                break;
                console.log(i + "after break")
            }
            else if (i == 5) {
                console.log(i)
            }
            else if (i == 6) {
                console.log(i)
            }
            else if (i == 6) {
                console.log(i)
            }
            else if (i == 6) {
                console.log(i)
            }
            console.log(`end ${i}`)
        }
        res.send("we are now online")
    } catch (error) {
        console.log("error finding", error.message)
        res.send("we are now online from error")
        
    }
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
        }).catch((err) => {
            if (err) {
                res.status(500).send({ error: "your porvided reference Number are are invalid" })
            }
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
                        res.status(201).send({ sucess: "sucessfully created your accout" })
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

    } catch (error) {
        console.log("error", error)
        res.status(404).send({ error: "failed to Create your account, please tryout latter" })
    }

});


// ============= User Activate Route ===================
app.post("/testing", async (req, res) => {
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
            // console.log(`start for loop with host ${i}`, hostUser)
            if (hostUser && hostUser.referNumber && i == 1) {
                console.log(`enter conditon ${i}`, hostUser)

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
                        refUser = currentUser // problem find here..Problem ta hoto host user a new valu set hocna na..

                        console.log(`end conditon ${i}`, refUser)

                    }
                }
            } else if (refUser && refUser.referNumber != 0 && i == 2) {
                console.log(`enter conditon ${i}`, refUser)


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
                        console.log(`end conditon ${i}`, refUser)


                    }
                }
            } else if (refUser && refUser.referNumber != 0 && i == 3) {
                console.log(`enter conditon ${i}`, refUser)


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
                        console.log(`end conditon ${i}`, refUser)


                    }
                    // if(!currentUser || currentUser.referNumber == 0 || currentUser.referNumber == "0"){
                    //     break;
                    // }else {
                    //     refUser = currentUser
                    //     console.log(`end conditon ${i}`, refUser)


                    // }
                }
            } else if (refUser && refUser.referNumber != 0 && i == 4) {
                console.log(`enter conditon ${i}`, refUser)


                const document = await user_collection.find({ generation_4: hostUser._id.toString() })
                console.log(201, "document", document)
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

                    console.log(240, "currentUser", currentUser)

                    if (currentUser && currentUser.referNumber) {
                        refUser = currentUser
                        console.log(`end conditon ${i}`, refUser)


                    }
                }
            } else if (refUser && refUser.referNumber != 0 && i == 5) {
                console.log(`enter conditon ${i}`, refUser)


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
                        console.log(`end conditon ${i}`, refUser)


                    }
                }
            } else if (refUser && refUser.referNumber != 0 && i == 6) {
                console.log(`enter conditon ${i}`, refUser)


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
                        console.log(`end conditon ${i}`, refUser)


                    }
                }
            } else if (refUser && refUser.referNumber != 0 && i == 7) {
                console.log(`enter conditon ${i}`, refUser)


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
                        console.log(`end conditon ${i}`, refUser)


                    }
                }
            } else if (refUser && refUser.referNumber != 0 && i == 8) {
                console.log(`enter conditon ${i}`, refUser)


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
                        console.log(`end conditon ${i}`, refUser)


                    }
                }
            } else if (refUser && refUser.referNumber != 0 && i == 9) {
                console.log(`enter conditon ${i}`, refUser)


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
                        console.log(`end conditon ${i}`, refUser)


                    }
                }
            } else if (refUser && refUser.referNumber != 0 && i == 10) {
                console.log(`enter conditon ${i}`, refUser)


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
                        console.log(`end conditon ${i}`, refUser)


                    }
                }
            }
        }
    }

    // =========================
    // const currentUser = await user_collection.findOneAndUpdate(
    //     { _id: hostUser.referNumber},
    //     {
    //         $push: { generation_1: {$each: ["findOneAndUpasde"], $position:0} }
    //     },
    //     {
    //         new: true,
    //         upsert: true
    //     }
    //     )

    // ===========================


    res.send({ message: "noting" })

})

// ============= Testing Route End ===================


// ====== Error Handling Middleware =======
app.use((error, req, res, next) => {
    if (error.message) {
        res.status(500).send({ error: error.message })
        console.log(error.message)
    } else if (error) {
        res.status(500).send({ error: "Something is wrong, please try out letter" })
        // console.log(error)
    }
});

app.listen(port, () => {
    console.log(`listening to port ${port}`)
})




// ===================================
// user_collection.updateOne(
//     {_id: "62dbe459c8d487d37cbd4b47"},
//     {$push: {generation_2: "3"}},{new: true, upsert: true }
// )
// .then(res => {
//     console.log(res)
// })
// .catch(error => {
//     console.log(error)
// })
// res.send({name: "saimon pranta"})
//
// ======================================


// const obj = {
//     name: "0"
// }

// for (let i = 0; obj.name != "0"; i++) {
//     console.log(i)
//     if (i == 3) {
//         obj.name = 0
//     }
// }

// let tester = obj.name != "0"
// console.log(tester)

