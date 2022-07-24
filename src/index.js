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
            referNumber: 1
        }).catch((err) => {})

        
        if (refNumberChacking && refNumberChacking.length > 0) {
            const phoneNumberChacking = await user_collection.find({ phoneNumber: phoneNumber }).select({
                phoneNumber: 1,
                referNumber: 1
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
            res.status(500).send({ error: "your porvided reference Number are are invalid" })
        }

    } catch (error) {
        console.log("error", error)
        res.status(404).send({ error: "failed to Create your account, please tryout latter" })
    }

});




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