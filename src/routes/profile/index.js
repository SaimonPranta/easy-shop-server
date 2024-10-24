const router = require("express").Router();
const fs = require("fs");
const path = require("path");
const user_collection = require("../../db/schemas/user_schema");
const { profileDirectory } = require("../../constants/storageDirectory");

router.post("/profile-pic", async (req, res) => {
  try {
    const files = req.files;
    const id = req.id;

    const userInfo = await user_collection
      .findOne({ _id: id })
      .select("profilePicture");

    if (!files) {
      return res.json({
        message: "Profile picture are required",
      });
    }
    let img = files.img;
    const extension = path.extname(img.name);
    let name = img.name.replace(extension, Date.now());
    img.name = `${name}${extension}`;

    const user = await user_collection.findOneAndUpdate(
      { _id: id },
      { profilePicture: img.name },
      { new: true }
    );
    if (!user) {
      return res.json({
        message: "Failed to update profile picture",
      });
    }
    const imagePath = await path.join(profileDirectory(), img.name);

    await img.mv(imagePath);

    if (userInfo.profilePicture) {
      const previousImagePath = await path.join(
        profileDirectory(),
        userInfo.profilePicture
      );
      if (fs.existsSync(previousImagePath)) {
        await fs.unlinkSync(previousImagePath);
      }
    }

    console.log("user ==>>", user.profilePicture);
    res.json({
      data: user,
    });
  } catch (error) {
    console.log("error ==>>", error);
    res.json({
      message: "Internal server error",
    });
  }
});

module.exports = router;
