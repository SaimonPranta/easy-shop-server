const router = require("express").Router();
const fs = require("fs");
const path = require("path");
const user_collection = require("../../db/schemas/user_schema");
const { profileDirectory } = require("../../constants/storageDirectory");
const Generations = require("../../db/schemas/generations");
const { default: mongoose } = require("mongoose");

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
router.get("/generation", async (req, res) => {
  try {
    const id = req.id;
    const generationList = {};
    let totalReferMember = 0;
    await Promise.all(
      new Array(10).fill("").map(async (item, index) => {
        try {
          const newIndex = index + 1;
          const genUserCount = await Generations.countDocuments({
            referByUser: id,
            generationNumber: newIndex,
          });
          generationList[`generation_${newIndex}`] = genUserCount;
          totalReferMember += genUserCount;
        } catch (error) {
          console.log("error");
        }
      })
    );
    res.json({
      data: { generationList, totalReferMember },
    });
  } catch (error) {
    console.log("error ==>>", error);
    res.json({
      message: "Internal server error",
    });
  }
});
router.get("/search-user", async (req, res) => {
  try {
    const id = req.id;
    const { search } = req.query;

    const userList = await Generations.aggregate([
      {
        $match: {
          referByUser: mongoose.Types.ObjectId(id),
        },
      },
      {
        $lookup: {
          from: "user_collectionssses", // Ensure this collection name is correct
          localField: "referredUser",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $addFields: {
          name: { $concat: ["$user.firstName", " ", "$user.lastName"] },
          phoneNumber: "$user.phoneNumber",
          referNumber: "$user.referNumber",
          joinDate: "$user.joinDate",
          _id: "$user._id",
        },
      },
      {
        $match: {
          $or: [
            {
              name: new RegExp(search, "i"),
            },
            {
              phoneNumber: new RegExp(search, "i"),
            },
            {
              referNumber: new RegExp(search, "i"),
            },
          ],
        },
      },
      {
        $limit: 30,
      },
    ]);

    res.json({
      data: userList,
    });
  } catch (error) {
    console.log("error ==>>", error);
    res.json({
      message: "Internal server error",
    });
  }
});

module.exports = router;
