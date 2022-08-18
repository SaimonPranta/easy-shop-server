const jwt = require("jsonwebtoken");
const user_collection = require("../db/schemas/user_schema");


const adminAuthGard = async (req, res, next) => {
    try {
        const token = await req.headers.authorization.split(" ")[1]
        const decoded = await jwt.verify(token, process.env.JWT_SECRET_KEY);
        if (decoded && decoded.phoneNumber && decoded.id) {
            const admin = await user_collection.findOne({ _id: decoded.id, phoneNumber: decoded.phoneNumber, role: "admin" })
            if (admin._id && admin.role === "admin") {
                req.phoneNumber = decoded.phoneNumber
                req.id = decoded.id
                next()
            } else {
                res.status(401).json({ error: "Unauthorized  attempt, please try out latter." })
            }
        } else {
            res.status(401).json({ error: "Unauthorized  attempt, please try out latter." })
        }
    } catch (error) {
        res.status(401).json({ error: "Unauthorized  attempt, please try out latter." })
    }
}

module.exports = adminAuthGard;