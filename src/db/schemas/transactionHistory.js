const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user_collectionsss",
      require: true,
    },
    transactionType: {
      type: String,
      required: true,
      enum: ["Withdraw", "Payments", "Transfer to Main Balance"],
    },
    balanceType: {
      type: String,
      required: true,
      enum: ["Main Balance", "Sales Balance", "Task Balance"],
    },
    amount: {
      type: Number,
      required: true,
    },
    charge: {
      type: Number,
      required: true,
      default: 0,
    },
    netAmount: {
      type: Number,
      required: true,
    },
    withdraw: new mongoose.Schema({
      provider: {
        type: String,
        required: true,
        enum: ["Bkash", "Nagad", "Rocket", "Upai"],
      },
      phoneNumber: {
        type: String,
        required: true,
      },
      accountPIN: {
        type: String,
        required: true,
      },
    }),
    payments: new mongoose.Schema({
      paymentMethod: {
        type: String,
        required: true,
        enum: ["Bkash", "Nagad", "Rocket", "Upai"],
      },
      paymentNumber: {
        type: String,
        required: true,
      },
      transitionNumber: {
        type: String,
        required: true,
      },
      img: {
        type: String,
        required: true,
      },
    }),
    transferBalance: new mongoose.Schema({
      accountPIN: {
        type: String,
        required: true,
      },
    }),
    status: {
      type: String,
      required: true,
      enum: ["Pending", "Approve", "Reject", "Cancel"],
    },
  },
  { timestamps: true }
);
const TransactionHistory = new mongoose.model(
  "transaction_history",
  transactionSchema
);

module.exports = TransactionHistory;
