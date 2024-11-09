const router = require("express").Router()
const user_collection = require("../../db/schemas/user_schema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const date_provider = require("../../functions/date_provider");
const TransactionHistory = require("../../db/schemas/transactionHistory");
const Configs = require("../../db/schemas/Configs");



 

router.post("/set-config", async (req, res) => {
    try {
        const {  balances, transferAmounts } = req.body
        const isConfigExist = await Configs.findOne({})
        if (!isConfigExist) {
            await Configs.create({})
        }

        const updateInfo = {} 
        if (transferAmounts) {
            updateInfo["balanceTransfer.transferAmounts"] = transferAmounts
        } 
        if (balances.hasOwnProperty("salesBalance")) {
            updateInfo["balanceTransfer.balances.salesBalance"] = balances.salesBalance
        }
        if (balances.hasOwnProperty("taskBalance")) {
            updateInfo["balanceTransfer.balances.taskBalance"] = balances.taskBalance
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
