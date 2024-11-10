const mongoose = require("mongoose");

const tutorialSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  videoID: {
    type: String,
    required: true
  },
}, {
  timestamps: true
});
const Tutorial = new mongoose.model("tutorial", tutorialSchema);

module.exports = Tutorial;
