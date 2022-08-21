const user_collection = require("../../db/schemas/user_schema");
const date_provider = require("../../functions/date_provider");


const balance_transfer = async (req, res) => {
    try {
        const id = req.id
        const { amount, selectUser } = req.body;

        if (id && amount && selectUser) {
            const receiverUserVarifiy = await user_collection.find({ phoneNumber: selectUser.toString() });
            if (receiverUserVarifiy.length > 0) {
                const receiverUser = await user_collection.findOne({ phoneNumber: selectUser.toString() });
                const provideUser = await user_collection.findOne({ _id: id });
                if (receiverUser._id && provideUser._id) {
                    const floorAmount = Math.floor(amount);
                    const reciverfloorAmount = Math.floor(receiverUser.balance);
                    const providerfloorAmount = Math.floor(provideUser.balance);

                    // Receiver Balance Calculation
                    const ReceiverMain = reciverfloorAmount + floorAmount;
                    // Provaider Balance Calculation
                    const providerMainBalance = providerfloorAmount - floorAmount;
                    if (providerfloorAmount >= floorAmount) {
                        const receiverUserUpdate = await user_collection.findOneAndUpdate({ phoneNumber: selectUser },
                            {
                                $set: {
                                    balance: ReceiverMain
                                }
                            });
                        if (receiverUserUpdate._id) {
                            const receiverInfo = await {
                                name: `${receiverUserUpdate.firstName} ${receiverUserUpdate.lastName}`,
                                number: receiverUserUpdate.phoneNumber,
                                amount: floorAmount,
                                date: date_provider(new Date())
                            }
                            const porviderUserUpdate = await user_collection.findOneAndUpdate({ _id: id },
                                {
                                    $set: {
                                        balance: providerMainBalance
                                    },
                                    $push: { balanceTransperInfo: { $each: [receiverInfo], $position: 0 } }
                                },
                                {
                                    new: true
                                });
                            res.status(200).json({
                                sucess: `Sucessfully transfer your balance to ${receiverUserUpdate.firstName} ${receiverUserUpdate.lastName}`,
                                data: porviderUserUpdate
                            })
                        }
                    } else {
                        res.status(500).json({ failed: "Sorry, you have not sufficient Balance." })
                    }
                } else {
                    res.status(500).json({ failed: "Your Provided User Number are invalid" })
                }
            } else {
                res.status(500).json({ failed: "Your Provided User Number are invalid" })
            }

        } else {
            res.status(500).json({ failed: "Failed to transfer balance, please try again." })
        }
    } catch (error) {
        res.status(500).json({ failed: "Failed to transfer balance, please try again." })
    }
}

module.exports = balance_transfer;
