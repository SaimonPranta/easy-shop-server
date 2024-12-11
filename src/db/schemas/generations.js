const mongoose = require("mongoose");

const generationsSchema = new mongoose.Schema(
  {
    referByUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user_collectionsss",
      required: true,
    },
    generationNumber: {
      type: Number,
      required: true,
    },
    incomes: {
      type: Number,
      required: true,
    },
    referredUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user_collectionsss",
      required: true,
    }, 
    active: {
      type: Boolean, 
      required: true,
      default: true,
    }, 
  },
  { timestamps: true }
);
const Generations = new mongoose.model("generation", generationsSchema);

module.exports = Generations;
