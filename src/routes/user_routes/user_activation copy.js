const user_collection = require("../../db/schemas/user_schema")

const user_activation = async (req, res) => {
    try {

        const id = await req.query.id

        if (id) {
            let hostUser = await user_collection.findOne({ _id: id.toString() })
            let refUser = {}
            const floorBalance = await Math.floor(hostUser.balance)
            const floorShoppingBalance = await Math.floor(hostUser.shoppingBalance)

            if (hostUser && hostUser.referNumber) {
                if (!hostUser.isActive) {
                    if (floorBalance >= 50) {
                        const countBalance = await floorBalance - 50
                        const countShoppingBalance = await floorShoppingBalance + 50

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
                                const document = await user_collection.find({ generation_1: hostUser.phoneNumber.toString() })
                                if (document.length < 1) {
                                    const currentUserForBalance = await user_collection.findOne({ phoneNumber: hostUser.referNumber.toString() })
                                    if (currentUserForBalance._id) {
                                        let balanceCount = await Math.floor(currentUserForBalance.balance) + 15
                                        let incomeBalanceCount = await Math.floor(currentUserForBalance.totalIncome) + 15

                                        const currentUser = await user_collection.findOneAndUpdate(
                                            { phoneNumber: hostUser.referNumber.toString() },
                                            {
                                                $set: {
                                                    balance: balanceCount,
                                                    totalIncome: incomeBalanceCount
                                                },
                                                $push: { generation_1: { $each: [hostUser.phoneNumber.toString()], $position: 0 } }
                                            },
                                            {
                                                new: true,
                                                upsert: true
                                            }
                                        )

                                        if (currentUser && currentUser.referNumber != "0") {
                                            refUser = currentUser
                                        } else {
                                            refUser = {}
                                            res.status(200).json({ data: activeHostUser })
                                        }
                                    } else {
                                        res.status(500).json({ failed: "Failed to Active Your Account, Please Try Again !" })

                                    }
                                }
                            } else if (refUser && refUser._id && refUser.referNumber != 0 && i == 2) {
                                const document = await user_collection.find({ generation_2: hostUser.phoneNumber.toString() })
                                if (document.length < 1) {
                                    const currentUserForBalance = await user_collection.findOne({ phoneNumber: refUser.referNumber.toString() })
                                    if (currentUserForBalance._id) {
                                        let balanceCount = await Math.floor(currentUserForBalance.balance) + 3
                                        let incomeBalanceCount = await Math.floor(currentUserForBalance.totalIncome) + 3

                                        const currentUser = await user_collection.findOneAndUpdate(
                                            { phoneNumber: refUser.referNumber.toString() },
                                            {
                                                $set: {
                                                    balance: balanceCount,
                                                    totalIncome: incomeBalanceCount
                                                },
                                                $push: { generation_2: { $each: [hostUser.phoneNumber.toString()], $position: 0 } }
                                            },
                                            {
                                                new: true,
                                                upsert: true
                                            }
                                        )
                                        if (currentUser && currentUser.referNumber != "0") {
                                            refUser = currentUser
                                        } else {
                                            refUser = {}
                                            res.status(200).json({ data: activeHostUser })
                                        }
                                    } else {
                                        res.status(500).json({ failed: "Failed to Active Your Account, Please Try Again !" })
                                    }
                                }
                            } else if (refUser && refUser._id && refUser.referNumber != 0 && i == 3) {
                                const document = await user_collection.find({ generation_3: hostUser.phoneNumber.toString() })
                                if (document.length < 1) {
                                    const currentUserForBalance = await user_collection.findOne({ phoneNumber: refUser.referNumber.toString() })
                                    if (currentUserForBalance._id) {
                                        let balanceCount = await Math.floor(currentUserForBalance.balance) + 1
                                        let incomeBalanceCount = await Math.floor(currentUserForBalance.totalIncome) + 1

                                        const currentUser = await user_collection.findOneAndUpdate(
                                            { phoneNumber: refUser.referNumber.toString() },
                                            {
                                                $set: {
                                                    balance: balanceCount,
                                                    totalIncome: incomeBalanceCount
                                                },
                                                $push: { generation_3: { $each: [hostUser.phoneNumber.toString()], $position: 0 } }
                                            },
                                            {
                                                new: true,
                                                upsert: true
                                            }
                                        )

                                        if (currentUser && currentUser.referNumber != "0") {
                                            refUser = currentUser
                                        } else {
                                            refUser = {}
                                            res.status(200).json({ data: activeHostUser })
                                        }
                                    } else {
                                        res.status(500).json({ failed: "Failed to Active Your Account, Please Try Again !" })
                                    }
                                }
                            } else if (refUser && refUser._id && refUser.referNumber != 0 && i == 4) {

                                const document = await user_collection.find({ generation_4: hostUser.phoneNumber.toString() })
                                if (document.length < 1) {
                                    const currentUserForBalance = await user_collection.findOne({ phoneNumber: refUser.referNumber.toString() })
                                    if (currentUserForBalance._id) {
                                        let balanceCount = await Math.floor(currentUserForBalance.balance) + 1
                                        let incomeBalanceCount = await Math.floor(currentUserForBalance.totalIncome) + 1

                                        const currentUser = await user_collection.findOneAndUpdate(
                                            { phoneNumber: refUser.referNumber.toString() },
                                            {
                                                $set: {
                                                    balance: balanceCount,
                                                    totalIncome: incomeBalanceCount
                                                },
                                                $push: { generation_4: { $each: [hostUser.phoneNumber.toString()], $position: 0 } }
                                            },
                                            {
                                                new: true,
                                                upsert: true
                                            }
                                        )

                                        if (currentUser && currentUser.referNumber != "0") {
                                            refUser = currentUser
                                        } else {
                                            refUser = {}
                                            res.status(200).json({ data: activeHostUser })
                                        }

                                    } else {
                                        res.status(500).json({ failed: "Failed to Active Your Account, Please Try Again !" })
                                    }
                                }
                            } else if (refUser && refUser._id && refUser.referNumber != 0 && i == 5) {

                                const document = await user_collection.find({ generation_5: hostUser.phoneNumber.toString() })
                                if (document.length < 1) {
                                    const currentUserForBalance = await user_collection.findOne({ phoneNumber: refUser.referNumber.toString() })
                                    if (currentUserForBalance._id) {
                                        let balanceCount = await Math.floor(currentUserForBalance.balance) + 1
                                        let incomeBalanceCount = await Math.floor(currentUserForBalance.totalIncome) + 1

                                        const currentUser = await user_collection.findOneAndUpdate(
                                            { phoneNumber: refUser.referNumber.toString() },
                                            {
                                                $set: {
                                                    balance: balanceCount,
                                                    totalIncome: incomeBalanceCount
                                                },
                                                $push: { generation_5: { $each: [hostUser.phoneNumber.toString()], $position: 0 } }
                                            },
                                            {
                                                new: true,
                                                upsert: true
                                            }
                                        )

                                        if (currentUser && currentUser.referNumber != "0") {
                                            refUser = currentUser
                                        } else {
                                            refUser = {}
                                            res.status(200).json({ data: activeHostUser })
                                        }
                                    } else {
                                        res.status(500).json({ failed: "Failed to Active Your Account, Please Try Again !" })
                                    }
                                }
                            } else if (refUser && refUser._id && refUser.referNumber != 0 && i == 6) {

                                const document = await user_collection.find({ generation_6: hostUser.phoneNumber.toString() })
                                if (document.length < 1) {
                                    const currentUserForBalance = await user_collection.findOne({ phoneNumber: refUser.referNumber.toString() })
                                    if (currentUserForBalance._id) {
                                        let balanceCount = await Math.floor(currentUserForBalance.balance) + 1
                                        let incomeBalanceCount = await Math.floor(currentUserForBalance.totalIncome) + 1

                                        const currentUser = await user_collection.findOneAndUpdate(
                                            { phoneNumber: refUser.referNumber.toString() },
                                            {
                                                $set: {
                                                    balance: balanceCount,
                                                    totalIncome: incomeBalanceCount
                                                },
                                                $push: { generation_6: { $each: [hostUser.phoneNumber.toString()], $position: 0 } }
                                            },
                                            {
                                                new: true,
                                                upsert: true
                                            }
                                        )

                                        if (currentUser && currentUser.referNumber != "0") {
                                            refUser = currentUser
                                        } else {
                                            refUser = {}
                                            res.status(200).json({ data: activeHostUser })
                                        }

                                    } else {
                                        res.status(500).json({ failed: "Failed to Active Your Account, Please Try Again !" })
                                    }
                                }
                            } else if (refUser && refUser._id && refUser.referNumber != 0 && i == 7) {

                                const document = await user_collection.find({ generation_7: hostUser.phoneNumber.toString() })
                                if (document.length < 1) {
                                    const currentUserForBalance = await user_collection.findOne({ phoneNumber: refUser.referNumber.toString() })
                                    if (currentUserForBalance._id) {
                                        let balanceCount = await Math.floor(currentUserForBalance.balance) + 1
                                        let incomeBalanceCount = await Math.floor(currentUserForBalance.totalIncome) + 1

                                        const currentUser = await user_collection.findOneAndUpdate(
                                            { phoneNumber: refUser.referNumber.toString() },
                                            {
                                                $set: {
                                                    balance: balanceCount,
                                                    totalIncome: incomeBalanceCount
                                                },
                                                $push: { generation_7: { $each: [hostUser.phoneNumber.toString()], $position: 0 } }
                                            },
                                            {
                                                new: true,
                                                upsert: true
                                            }
                                        )

                                        if (currentUser && currentUser.referNumber != "0") {
                                            refUser = currentUser
                                        } else {
                                            refUser = {}
                                            res.status(200).json({ data: activeHostUser })
                                        }

                                    } else {
                                        res.status(500).json({ failed: "Failed to Active Your Account, Please Try Again !" })
                                    }
                                }
                            } else if (refUser && refUser._id && refUser.referNumber != 0 && i == 8) {

                                const document = await user_collection.find({ generation_8: hostUser.phoneNumber.toString() })
                                if (document.length < 1) {
                                    const currentUserForBalance = await user_collection.findOne({ phoneNumber: refUser.referNumber.toString() })
                                    if (currentUserForBalance._id) {
                                        let balanceCount = await Math.floor(currentUserForBalance.balance) + 1
                                        let incomeBalanceCount = await Math.floor(currentUserForBalance.totalIncome) + 1

                                        const currentUser = await user_collection.findOneAndUpdate(
                                            { phoneNumber: refUser.referNumber.toString() },
                                            {
                                                $set: {
                                                    balance: balanceCount,
                                                    totalIncome: incomeBalanceCount
                                                },
                                                $push: { generation_8: { $each: [hostUser.phoneNumber.toString()], $position: 0 } }
                                            },
                                            {
                                                new: true,
                                                upsert: true
                                            }
                                        )

                                        if (currentUser && currentUser.referNumber != "0") {
                                            refUser = currentUser
                                        } else {
                                            refUser = {}
                                            res.status(200).json({ data: activeHostUser })
                                        }

                                    } else {
                                        res.status(500).json({ failed: "Failed to Active Your Account, Please Try Again !" })
                                    }
                                }
                            } else if (refUser && refUser._id && refUser.referNumber != 0 && i == 9) {

                                const document = await user_collection.find({ generation_9: hostUser.phoneNumber.toString() })
                                if (document.length < 1) {
                                    const currentUserForBalance = await user_collection.findOne({ phoneNumber: refUser.referNumber.toString() })
                                    if (currentUserForBalance._id) {
                                        let balanceCount = await Math.floor(currentUserForBalance.balance) + 1
                                        let incomeBalanceCount = await Math.floor(currentUserForBalance.totalIncome) + 1

                                        const currentUser = await user_collection.findOneAndUpdate(
                                            { phoneNumber: refUser.referNumber.toString() },
                                            {
                                                $set: {
                                                    balance: balanceCount,
                                                    totalIncome: incomeBalanceCount
                                                },
                                                $push: { generation_9: { $each: [hostUser.phoneNumber.toString()], $position: 0 } }
                                            },
                                            {
                                                new: true,
                                                upsert: true
                                            }
                                        )

                                        if (currentUser && currentUser.referNumber != "0") {
                                            refUser = currentUser
                                        } else {
                                            refUser = {}
                                            res.status(200).json({ data: activeHostUser })
                                        }
                                    } else {
                                        res.status(500).json({ failed: "Failed to Active Your Account, Please Try Again !" })
                                    }
                                }
                            } else if (refUser && refUser._id && refUser.referNumber != 0 && i == 10) {

                                const document = await user_collection.find({ generation_10: hostUser.phoneNumber.toString() })
                                if (document.length < 1) {
                                    const currentUserForBalance = await user_collection.findOne({ phoneNumber: refUser.referNumber.toString() })
                                    if (currentUserForBalance._id) {
                                        let balanceCount = await Math.floor(currentUserForBalance.balance) + 1
                                        let incomeBalanceCount = await Math.floor(currentUserForBalance.totalIncome) + 1

                                        const currentUser = await user_collection.findOneAndUpdate(
                                            { phoneNumber: refUser.referNumber.toString() },
                                            {
                                                $set: {
                                                    balance: balanceCount,
                                                    totalIncome: incomeBalanceCount
                                                },
                                                $push: { generation_10: { $each: [hostUser.phoneNumber.toString()], $position: 0 } }
                                            },
                                            {
                                                new: true,
                                                upsert: true
                                            }
                                        )

                                        if (currentUser && currentUser.referNumber != "0") {
                                            refUser = currentUser
                                        } else {
                                            refUser = {}
                                            res.status(200).json({ data: activeHostUser })
                                        }
                                    } else {
                                        res.status(500).json({ failed: "Failed to Active Your Account, Please Try Again !" })
                                    }
                                }
                            }
                        }
                    } else {
                        res.status(500).json({ failed: "Sorry, You Have Insufficient Balance, Please Invest Balance and Then Try !" })
                    }
                } else {
                    res.status(500).json({ failed: "Sorry, Your Account Are Already Active !" })
                }
            } else {
                res.status(500).json({ failed: "Sorry, We Find it was an Unauthorized Attempt !" })
            }
        } else {
            res.status(500).json({ failed: "Sorry, We Find it was an Unauthorized Attempt !" })
        }
    } catch (error) {
        res.status(500).json({ failed: "Something is Wrong, Please try Again !" })
    }
}





module.exports = user_activation;
