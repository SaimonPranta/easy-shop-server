const mongoose = require("mongoose");

const socialMediaSchema = new mongoose.Schema({
  socialMediaTitle: {
    type: String,
    required: true
  },
  socialMediaLink: {
    type: String,
    required: true
  },
  socialMediaLogo: {
    type: String,
    required: true
  },
}, {
  timestamps: true
});
const SocialMedia = new mongoose.model("social-media", socialMediaSchema);

module.exports = SocialMedia;
