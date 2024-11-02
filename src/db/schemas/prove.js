const mongoose = require("mongoose");

const proveSchema = new mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user_collectionsss",
      require: true,
    },
    description: {
      type: String,
      required: true,
    },
    images: {
      type: Array,
      required: true,
      default: []
    },
    disable: {
      type: Boolean, 
    },
  },
  { timestamps: true }
);
const proveHistory = new mongoose.model("prove_history", proveSchema);

module.exports = proveHistory;
