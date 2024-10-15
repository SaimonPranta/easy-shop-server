const router = require("express").Router()
const user_collection = require("../../db/schemas/user_schema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const date_provider = require("../../functions/date_provider");
const TransactionHistory = require("../../db/schemas/transactionHistory");
const Configs = require("../../db/schemas/Configs");


router.post("/", async (req, res) => {
    try {
        const query = {
            transactionType: "Withdraw",
        }
        const { sort } = req.query;
        const { balance, fromDate, toDate, search } = req.body;
        const limit = 10
        const page = req.query.page || 1
        if (balance) {
            query["balanceType"] = balance
        }
        if (fromDate && toDate) {
            const startDate = new Date(fromDate)
            const endDate = new Date(toDate)
            const startOfDay = new Date(startDate.setHours(0, 0, 0, 0));
            const endOfDay = new Date(endDate.setHours(23, 59, 59, 999));
            query["$and"] = [
                {
                    createdAt: { $lte: endOfDay },
                },
                {
                    createdAt: { $gte: startOfDay },
                },
            ]
        }
        if (search) {
            query["$or"] = [
                {
                    'userID.fullName': new RegExp(search, "i")
                },
                {
                    'userID.phoneNumber': new RegExp(search, "i")
                },
                {
                    'userID.withdraw': new RegExp(search, "i")
                },
                {
                    'status': new RegExp(search, "i")
                },
            ]
        }
        const totalItems = await TransactionHistory.countDocuments(query)
        // const totalBalance = await TransactionHistory.aggregate([
        //     {
        //         $match: query
        //     },
        //     {
        //         $group: {
        //             _id: null,
        //             amount: {
        //                 $sum: "$amount"
        //             }
        //         }
        //     }
        // ])

        const skip = Number(page - 1) * limit

        // if (skip >= totalItems) {
        //     return res.json({
        //         message: "All item are already loaded",
        //     })
        // }


        // const data = await TransactionHistory.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }).populate({
        //     path: 'userID',
        //     select: 'firstName lastName phoneNumber'  
        // });
        const data = await TransactionHistory.aggregate([
            {
                $lookup: {
                    from: 'user_collectionssses',
                    localField: 'userID',
                    foreignField: '_id', // Field from User collection
                    as: 'userID'
                }
            },
            // { $unwind: { path: '$userInfo'} },  
            { $unwind: { path: '$userID', preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    amount: 1,
                    createdAt: 1,
                    transactionType: 1,
                    balanceType: 1,
                    charge: 1,
                    netAmount: 1,
                    withdraw: 1,
                    status: 1,
                    'userID.firstName': 1,
                    'userID.lastName': 1,
                    'userID.phoneNumber': 1,
                    'userID.fullName': {
                        $concat: ['$userID.firstName', '', '$userID.lastName']
                    }

                }
            },
            { $match: query },
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: limit }
        ]);
        res.json({
            data: data,
            total: totalItems,
            page: Number(page),
            data: data,
        })
    } catch (error) {
        res.json({
            message: "Internal server error"
        })
    }
})
router.put("/status", async (req, res) => {
    try {
        const { status, id } = req.body
        const query = {
            _id: id
        }
        let updateInfo = {}
        const transitionInfo = await TransactionHistory.findOne({
            ...query
        })
        // Main Balance", "Sales Balance", "Task Balance"
        if (transitionInfo && transitionInfo.status === "Pending") {
            if (status === "Approve") {
                if (transitionInfo.balanceType === "Main Balance") {
                    const updateUsr = await user_collection.findOneAndUpdate(
                        { _id: transitionInfo.userID },
                        { $inc: { balance: - transitionInfo.netAmount } },
                        { new: true }
                    );
                } else if (transitionInfo.balanceType === "Sales Balance") {
                    const updateUsr = await user_collection.findOneAndUpdate(
                        { _id: transitionInfo.userID },
                        { $inc: { salesBalance: - transitionInfo.netAmount } },
                        { new: true }
                    );
                } else if (transitionInfo.balanceType === "Sales Balance") {
                    const updateUsr = await user_collection.findOneAndUpdate(
                        { _id: transitionInfo.userID },
                        { $inc: { taskBalance: - transitionInfo.netAmount } },
                        { new: true }
                    );
                }
            }

        } else if (transitionInfo && transitionInfo.status === "Approve") {
            if (transitionInfo.balanceType === "Main Balance") {
                const updateUsr = await user_collection.findOneAndUpdate(
                    { _id: transitionInfo.userID },
                    { $inc: { balance: transitionInfo.netAmount } },
                    { new: true }
                );
            } else if (transitionInfo.balanceType === "Sales Balance") {
                const updateUsr = await user_collection.findOneAndUpdate(
                    { _id: transitionInfo.userID },
                    { $inc: { salesBalance: transitionInfo.netAmount } },
                    { new: true }
                );
            } else if (transitionInfo.balanceType === "Sales Balance") {
                const updateUsr = await user_collection.findOneAndUpdate(
                    { _id: transitionInfo.userID },
                    { $inc: { taskBalance: transitionInfo.netAmount } },
                    { new: true }
                );
            }
        } else if (transitionInfo && transitionInfo.status === "Reject") {
            if (status === "Approve") {
                if (transitionInfo.balanceType === "Main Balance") {
                    const updateUsr = await user_collection.findOneAndUpdate(
                        { _id: transitionInfo.userID },
                        { $inc: { balance: - transitionInfo.netAmount } },
                        { new: true }
                    );
                } else if (transitionInfo.balanceType === "Sales Balance") {
                    const updateUsr = await user_collection.findOneAndUpdate(
                        { _id: transitionInfo.userID },
                        { $inc: { salesBalance: - transitionInfo.netAmount } },
                        { new: true }
                    );
                } else if (transitionInfo.balanceType === "Sales Balance") {
                    const updateUsr = await user_collection.findOneAndUpdate(
                        { _id: transitionInfo.userID },
                        { $inc: { taskBalance: - transitionInfo.netAmount } },
                        { new: true }
                    );
                }

            }
        }


        const data = await TransactionHistory.findOneAndUpdate({
            ...query
        }, { status }, { new: true })

        res.json({
            data: data
        })
    } catch (error) {
        res.json({
            message: "Internal server error"
        })
    }
})

router.post("/set-config", async (req, res) => {
    try {
        const { withdrawCost, paymentMethods, balances, withdrawAmounts} = req.body
        const isConfigExist = await Configs.findOne({})
        if (!isConfigExist) {
            await Configs.create({})
        }

        const updateInfo = {}
        if (withdrawCost) {
            updateInfo["withdraw.withdrawCost"] = withdrawCost
        }
        if (withdrawAmounts) {
            updateInfo["withdraw.withdrawAmounts"] = withdrawAmounts
        }
        if (paymentMethods.hasOwnProperty("bikash")) {
            updateInfo["withdraw.paymentMethods.bikash"] = paymentMethods.bikash
        }
        if (paymentMethods.hasOwnProperty("nagad")) {
            updateInfo["withdraw.paymentMethods.nagad"] = paymentMethods.nagad
        }
        if (paymentMethods.hasOwnProperty("rocket")) {
            updateInfo["withdraw.paymentMethods.rocket"] = paymentMethods.rocket
        }
        if (paymentMethods.hasOwnProperty("upay")) {
            updateInfo["withdraw.paymentMethods.upay"] = paymentMethods.upay
        }
        if (balances.hasOwnProperty("mainBalance")) {
            updateInfo["withdraw.balances.mainBalance"] = balances.mainBalance
        }
        if (balances.hasOwnProperty("salesBalance")) {
            updateInfo["withdraw.balances.salesBalance"] = balances.salesBalance
        }
        if (balances.hasOwnProperty("taskBalance")) {
            updateInfo["withdraw.balances.taskBalance"] = balances.taskBalance
        }


        const updateConfig = await Configs.findOneAndUpdate({}, {
            ...updateInfo
        }, { new: true })
 
        res.json({
            message: "Your Config is completed successfully",
            data: updateConfig,
            success: true
        })
    } catch (error) {
        res.status(500).json({
            message: "Internal server error"
        })
    }
})


module.exports = router;
