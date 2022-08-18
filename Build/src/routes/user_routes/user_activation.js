const user_collection = require("../../db/schemas/user_schema")

const user_activation = async (req, res) => {
    try {
        const id = await req.query.id

        const user = await user_collection.find({ _id: id })
        let hostUser = await user[0]
        let refUser = {}
        const floorBalance = await Math.floor(hostUser.balance)
        const floorShoppingBalance = await Math.floor(hostUser.shoppingBalance)


        if (hostUser && hostUser.referNumber && !hostUser.isActive) {
            if (floorBalance >= 50) {
                const countBalance = floorBalance - 50
                const countShoppingBalance = floorShoppingBalance + 50

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
                        if (document.length == 0) {
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

                                if (currentUser && currentUser.referNumber) {
                                    refUser = currentUser
                                } else {
                                    refUser = {}
                                    res.status(200).json({ data: activeHostUser})
                                }
                            } else {
                                res.status(500).json({ failed: "Failed to active your account, please try again" })
                            }
                        }
                    } else if (refUser && refUser._id && refUser.referNumber != 0 && i == 2) {

                        const document = await user_collection.find({ generation_2: hostUser.phoneNumber.toString() })
                        if (document.length == 0) {
                            const currentUserForBalance = await user_collection.findOne({ phoneNumber: refUser.referNumber.toString() })
                            if (currentUserForBalance._id) {
                                let balanceCount = await Math.floor(currentUserForBalance.balance) + 5
                                let incomeBalanceCount = await Math.floor(currentUserForBalance.totalIncome) + 5

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
                                if (currentUser && currentUser.referNumber) {
                                    refUser = currentUser
                                } else {
                                    refUser = {}
                                    res.status(200).json({ data: activeHostUser})
                                }
                            } else {
                                res.status(500).json({ failed: "Failed to active your account, please try again" })
                            }
                        }
                    } else if (refUser && refUser._id && refUser.referNumber != 0 && i == 3) {

                        const document = await user_collection.find({ generation_3: hostUser.phoneNumber.toString() })
                        if (document.length == 0) {
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
                                        $push: { generation_3: { $each: [hostUser.phoneNumber.toString()], $position: 0 } }
                                    },
                                    {
                                        new: true,
                                        upsert: true
                                    }
                                )

                                if (currentUser && currentUser.referNumber) {
                                    refUser = currentUser
                                } else {
                                    refUser = {}
                                    res.status(200).json({ data: activeHostUser})
                                }

                            } else {
                                res.status(500).json({ failed: "Failed to active your account, please try again" })
                            }
                        }
                    } else if (refUser && refUser._id && refUser.referNumber != 0 && i == 4) {

                        const document = await user_collection.find({ generation_4: hostUser.phoneNumber.toString() })
                        if (document.length == 0) {
                            const currentUserForBalance = await user_collection.findOne({ phoneNumber: refUser.referNumber.toString() })
                            if (currentUserForBalance._id) {
                                let balanceCount = await Math.floor(currentUserForBalance.balance) + 2
                                let incomeBalanceCount = await Math.floor(currentUserForBalance.totalIncome) + 2

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

                                if (currentUser && currentUser.referNumber) {
                                    refUser = currentUser
                                } else {
                                    refUser = {}
                                    res.status(200).json({ data: activeHostUser})
                                }

                            } else {
                                res.status(500).json({ failed: "Failed to active your account, please try again" })
                            }
                        }
                    } else if (refUser && refUser._id && refUser.referNumber != 0 && i == 5) {

                        const document = await user_collection.find({ generation_5: hostUser.phoneNumber.toString() })
                        if (document.length == 0) {
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

                                if (currentUser && currentUser.referNumber) {
                                    refUser = currentUser
                                } else {
                                    refUser = {}
                                    res.status(200).json({ data: activeHostUser})
                                }
                            } else {
                                res.status(500).json({ failed: "Failed to active your account, please try again" })
                            }
                        }
                    } else if (refUser && refUser._id && refUser.referNumber != 0 && i == 6) {

                        const document = await user_collection.find({ generation_6: hostUser.phoneNumber.toString() })
                        if (document.length == 0) {
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

                                if (currentUser && currentUser.referNumber) {
                                    refUser = currentUser
                                } else {
                                    refUser = {}
                                    res.status(200).json({ data: activeHostUser})
                                }

                            } else {
                                res.status(500).json({ failed: "Failed to active your account, please try again" })
                            }
                        }
                    } else if (refUser && refUser._id && refUser.referNumber != 0 && i == 7) {

                        const document = await user_collection.find({ generation_7: hostUser.phoneNumber.toString() })
                        if (document.length == 0) {
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

                                if (currentUser && currentUser.referNumber) {
                                    refUser = currentUser
                                } else {
                                    refUser = {}
                                    res.status(200).json({ data: activeHostUser})
                                }

                            } else {
                                res.status(500).json({ failed: "Failed to active your account, please try again" })
                            }
                        }
                    } else if (refUser && refUser._id && refUser.referNumber != 0 && i == 8) {

                        const document = await user_collection.find({ generation_8: hostUser.phoneNumber.toString() })
                        if (document.length == 0) {
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

                                if (currentUser && currentUser.referNumber) {
                                    refUser = currentUser
                                } else {
                                    refUser = {}
                                    res.status(200).json({ data: activeHostUser})
                                }

                            } else {
                                res.status(500).json({ failed: "Failed to active your account, please try again" })
                            }
                        }
                    } else if (refUser && refUser._id && refUser.referNumber != 0 && i == 9) {

                        const document = await user_collection.find({ generation_9: hostUser.phoneNumber.toString() })
                        if (document.length == 0) {
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

                                if (currentUser && currentUser.referNumber) {
                                    refUser = currentUser
                                } else {
                                    refUser = {}
                                    res.status(200).json({ data: activeHostUser})
                                }
                            } else {
                                res.status(500).json({ failed: "Failed to active your account, please try again" })
                            }
                        }
                    } else if (refUser && refUser._id && refUser.referNumber != 0 && i == 10) {

                        const document = await user_collection.find({ generation_10: hostUser.phoneNumber.toString() })
                        if (document.length == 0) {
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

                                if (currentUser && currentUser.referNumber) {
                                    refUser = currentUser
                                } else {
                                    refUser = {}
                                    res.status(200).json({ data: activeHostUser})
                                }
                            } else {
                                res.status(500).json({ failed: "Failed to active your account, please try again" })
                            }
                        }
                    }
                }
            } else {
                res.status(500).json({ failed: "You have not enough balance to active your account, please increase your balance and try again" })
            }
        } else {
            res.status(500).json({ failed: "Something is wrong, please try again" })
        }
    } catch (error) {
        res.status(500).json({ failed: "Something is wrong, please try again" })
    }
}





module.exports = user_activation;
