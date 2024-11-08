const mongoose = require("mongoose");

const salarySchema = new mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user_collectionsss",
      require: true,
    },
    amount: {
      type: Number,
      required: true, 
    },
    status: {
      type: String,
      required: true, 
      default: "Approve"
    },
   
  },
  { timestamps: true }
);
const Salary = new mongoose.model(
  "salary",
  salarySchema
);

module.exports = Salary;
