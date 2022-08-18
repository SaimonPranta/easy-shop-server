// const user_collection = require("../db/schemas/user_schema");
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");

const root = async (req, res) => {
    try {
        // const userInfo = await {
        //     firstName: "Mehadi",
        //     lastName: "Hasan",
        //     referNumber: 0,
        //     phoneNumber: 12345,
        //     password: "`12345",

        // }
        // const documents = await new user_collection(userInfo)
        // const createdUser = await documents.save()
        // res.send(createdUser)
        res.send("we are now online")
    } catch (error) {
        res.send("we are now online")
    }
};

module.exports = root;