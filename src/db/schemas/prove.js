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
      default: [],
    },
    disable: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
const ProveHistory = new mongoose.model("prove_post_history", proveSchema);

module.exports = ProveHistory;
