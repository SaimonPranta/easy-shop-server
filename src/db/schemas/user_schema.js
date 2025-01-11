const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  profilePicture: {
    type: String,
  },
  referUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user_collectionsss",
    require: true,
  },

  balance: {
    // Main Balance
    type: Number,
    default: 0,
  },
  pointAmount: {
    type: Number,
    default: 0,
  },
  salesBalance: {
    // Sales Balance
    type: Number,
    default: 0,
  },
  blueTickInfo: {
    blurTick: {
      type: Boolean,
      default: false,
    },
    date: {
      type: Date, 
    }
  },
  dailyTask: {
    block: {
      type: Boolean,
      default: false,
    }, 
    date: {
      type: Date, 
    }
  },
  block: {
    isBlock: {
      type: Boolean,
      default: false,
    }, 
    date: {
      type: Date, 
    }
  },
  // salaryBalance: {
  //   type: Number,
  //   default: 0,
  // },
  taskBalance: {
    // Task Balance
    type: Number,
    default: 0,
  },
  totalIncome: {
    type: Number,
    default: 0,
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  joinDate: {
    type: String,
  },
  isActive: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    default: "user",
  },
  rank: {
    type: String,
    default: "No Rank",
  },
  rankID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "rank",
  }, 
  balanceTransperInfo: {
    type: Array,
  },
  balanceRequestInfo: {
    type: Array,
  },
  mobileRechareInfo: {
    type: Array,
  },

  // withdrawInfo: {
  //     type: Array
  // }
});
const user_collection = new mongoose.model("user_collectionsss", userSchema);

module.exports = user_collection;
