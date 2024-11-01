const mongoose = require("mongoose");

const ranksSchema = new mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user_collectionsss",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    accountNumber: {
      type: String,
      required: true,
    },
    rank: {
      type: String,
      required: true,
    },
    mobileNumber: {
      type: String,
      required: true,
    },
    district: {
      type: String,
      required: true,
    },
    thana: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
      required: true,
    },
     
  },
  { timestamps: true }
);
const Ranks = new mongoose.model("rank", ranksSchema);

module.exports = Ranks;
