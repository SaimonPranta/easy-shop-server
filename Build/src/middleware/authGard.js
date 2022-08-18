// const { json } = require("express");
const jwt = require("jsonwebtoken");


const authGard = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1]
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        if (decoded && decoded.phoneNumber) {
            req.phoneNumber = decoded.phoneNumber
            req.id = decoded.id
            next()

        } else {
            res.status(401).json({ error: "Unauthorized  attempt, please try out latter." })
        }
    } catch (error) {
        res.status(401).json({ error: "Unauthorized  attempt, please try out latter." })
    }
}

module.exports = authGard;