const user_collection = require("../../db/schemas/user_schema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const date_provider = require("../../functions/date_provider");

const withdraw = async (req, res) => {
    try {
        const id = req.id
        const { porvider, amount, number } = req.body;
        if (porvider && amount && number) {
            const floorAmount = Math.floor(amount)
            const charge = floorAmount * 5 / 100
            const total = charge + floorAmount
            const userBalanceChecker = await user_collection.findOne({ _id: id })
            if (userBalanceChecker.balance >= total) {
                const requestID = await Math.floor(Math.random() * 10) + Date.now();
                const reqestObj = await {
                    requestID: requestID,
                    porvider: porvider,
                    amount: floorAmount,
                    number: number,
                    apporoval: false,
                    date: date_provider(new Date())
                }
                const user = await user_collection.findOneAndUpdate({ _id: id },
                    {
                        $push: { withdrawInfo: { $each: [reqestObj], $position: 0 } }
                    },
                    {
                        new: true
                    });
                if (user._id) {
                    res.status(200).json({
                        sucess: "Your withdraw request are sucessfully submited ",
                        data: user
                    })
                } else {
                    res.status(500).json({ failed: "Failed to submit withdraw request, please try again." })
                }
            } else {
                res.status(500).json({ failed: "Sorry, you can't withdrad more then your balance" })
            }
        } else {
            res.status(500).json({ failed: "Failed to submit withdraw request, please try again." })
        }
    } catch (error) {
        res.status(500).json({ failed: "Failed to submit withdraw request, please try again." })
    }
};

module.exports = withdraw;
