const router = require("express").Router()
const user_collection = require("../../db/schemas/user_schema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const date_provider = require("../../functions/date_provider");
const TransactionHistory = require("../../db/schemas/transactionHistory")


router.get("/", async (req, res) => {
    try {
        const userID = req.id
        console.log("userID", userID)
        const query = {
            userID: userID,
            transactionType: "Withdraw",
        }
        const { sort } = req.query;

        const limit = 5
        const page = req.query.page || 1
        const totalItems = await TransactionHistory.countDocuments(query)


        const skip = Number(page - 1) * limit

        if (skip >= totalItems) {
            return res.json({
                message: "All item are already loaded",
            })
        }

        console.log({
            page,
            skip,
            limit
        })
        const data = await TransactionHistory.find(query).skip(skip).limit(limit).sort({ createdAt: -1 })

        console.log("totalItems ==>>", totalItems)
        console.log("data ==>>", data.length)

        res.json({
            data: data
        })
    } catch (error) {
        console.log("error", error)
        res.json({
            message: "Internal server error"
        })
    }
})

router.post("/", async (req, res) => {
    try {
        const id = req.id
        const { balanceType, provider, phoneNumber, amount, accountPIN } = req.body;
        const query = {
            _id: req.id,

        }
        const userInfo = await user_collection.findOne(query)
        const info = {
            userID: id,
            transactionType: "Withdraw",
            balanceType,
            amount: amount,
            netAmount: amount,
            status: "Pending",
            withdraw: {
                provider,
                phoneNumber,
                accountPIN
            }
        }
        const data = await TransactionHistory.create(info)
        console.log("data ==>>", data)
        res.json({
            success: "Withdraw request submitted successfully",
            data,
            total: totalItems
        })
    } catch (error) {
        res.status(500).json({ failed: "Failed to submit withdraw request, please try again." })
    }
})
// const withdraw = async (req, res) => {
//     try {
//         const id = req.id
//         const { porvider, amount, number } = req.body;
//         if (porvider && amount && number) {
//             const floorAmount = Math.floor(amount)
//             const charge = floorAmount * 5 / 100
//             const total = charge + floorAmount
//             const userBalanceChecker = await user_collection.findOne({ _id: id })
//             if (userBalanceChecker.balance >= total) {
//                 const requestID = await Math.floor(Math.random() * 10) + Date.now();
//                 const reqestObj = await {
//                     requestID: requestID,
//                     porvider: porvider,
//                     amount: floorAmount,
//                     number: number,
//                     apporoval: false,
//                     date: date_provider(new Date())
//                 }
//                 const user = await user_collection.findOneAndUpdate({ _id: id },
//                     {
//                         $push: { withdrawInfo: { $each: [reqestObj], $position: 0 } }
//                     },
//                     {
//                         new: true
//                     });
//                 if (user._id) {
//                     res.status(200).json({
//                         sucess: "Your withdraw request are sucessfully submited ",
//                         data: user
//                     })
//                 } else {
//                     res.status(500).json({ failed: "Failed to submit withdraw request, please try again." })
//                 }
//             } else {
//                 res.status(500).json({ failed: "Sorry, you can't withdrad more then your balance" })
//             }
//         } else {
//             res.status(500).json({ failed: "Failed to submit withdraw request, please try again." })
//         }
//     } catch (error) {
//         res.status(500).json({ failed: "Failed to submit withdraw request, please try again." })
//     }
// };

module.exports = router;
