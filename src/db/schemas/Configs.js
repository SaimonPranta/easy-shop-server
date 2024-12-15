const mongoose = require("mongoose");

const configsSchema = new mongoose.Schema({
  dailyTask: new mongoose.Schema({
    taskRewardsList: {
      type: Array,
      require: true,
      default: [],
    },
    maximumAmount: {
      type: Number,
      require: true,
      default: 0,
    },
    tutorialVideoId: {
      type: String,
      require: true,
      default: "",
    },
    pointConvertAmount: {
      type: Number,
      require: true,
      default: 0,
    },
    taskNotice: {
      type: String,
      require: true,
      default: "",
    },
    taskOffNotice: {
      type: String,
    },
    taskStartDate: {
      type: Date,
    },
    taskExpireDate: {
      type: Date,
    },
  }),
  withdraw: new mongoose.Schema({
    withdrawCost: {
      type: Number,
      require: true,
      default: 0,
    },
    withdrawAmounts: [
      new mongoose.Schema({
        balance: {
          type: Number,
          require: true,
        },
      }),
    ],
    paymentMethods: new mongoose.Schema({
      bikash: {
        type: Boolean,
        require: true,
        default: false,
      },
      nagad: {
        type: Boolean,
        require: true,
        default: false,
      },
      rocket: {
        type: Boolean,
        require: true,
        default: false,
      },
      upay: {
        type: Boolean,
        require: true,
        default: false,
      },
    }),
    balances: new mongoose.Schema({
      mainBalance: {
        type: Boolean,
        require: true,
        default: false,
      },
      salesBalance: {
        type: Boolean,
        require: true,
        default: false,
      },
      taskBalance: {
        type: Boolean,
        require: true,
        default: false,
      },
    }),
  }),
  payment: new mongoose.Schema({
    paymentNotice: {
      type: String,
    },
    paymentFormNotice: {
      type: String,
    },
    paymentsNumbers: new mongoose.Schema({
      bkashNumber: {
        type: String,
      },
      nagadNumber: {
        type: String,
      },
      rocketNumber: {
        type: String,
      },
    }),
  }),
  balanceTransfer: new mongoose.Schema({
    transferAmounts: [
      new mongoose.Schema({
        balance: {
          type: Number,
          require: true,
        },
      }),
    ],
    balances: new mongoose.Schema({
      salesBalance: {
        type: Boolean,
        require: true,
        default: false,
      },
      taskBalance: {
        type: Boolean,
        require: true,
        default: false,
      },
    }),
  }),
  salary: new mongoose.Schema({
    salaryNotice: {
      type: String,
    },
    salaryRuleNotice: {
      type: String,
    },
    salaryBonusNotice: {
      type: String,
    },
    salaryHistoryTitle: {
      type: String,
    },
    salaryPaymentCondition: new mongoose.Schema({
      salaryCountDay: {
        type: Number,
      },
      salaryCountReferNumber: {
        type: Number,
      },
      salaryPaymentAmount: {
        type: Number,
      },
    }),
  }),
  provePost: new mongoose.Schema({
    postAutoApprove: {
      type: Boolean,
    },
  }),
  tutorial: new mongoose.Schema({
    registration: new mongoose.Schema({
      videoTitle: {
        type: String,
      },
      videoID: {
        type: String,
      },
    }),
  }),
  headline: new mongoose.Schema({
    title: {
      type: String,
    },
  }),
});
const Configs = new mongoose.model("configs", configsSchema);

module.exports = Configs;
