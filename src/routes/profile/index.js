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
router.post("/generation-team-member-list", async (req, res) => {
  try {
    const userID = req.id;
    const { balance, fromDate, toDate, search } = req.body;
    const query = {
      referByUser: mongoose.Types.ObjectId(userID),
      generationNumber: 1,
    };
    const limit = req.query.limit || 5;
    const page = req.query.page || 1;
    if (balance) {
      query["balanceType"] = balance;
    }
    if (fromDate && toDate) {
      const startDate = new Date(fromDate);
      const endDate = new Date(toDate);
      const startOfDay = new Date(startDate.setHours(0, 0, 0, 0));
      const endOfDay = new Date(endDate.setHours(23, 59, 59, 999));
      query["$and"] = [
        {
          createdAt: { $lte: endOfDay },
        },
        {
          createdAt: { $gte: startOfDay },
        },
      ];
    }
    let totalItems = await Generations.aggregate([
      {
        $match: {
          ...query,
        },
      },
      {
        $project: {
          _id: 1,
        },
      },
    ]);
    totalItems = totalItems.length || 0;

    const skip = Number(page - 1) * limit;

    if (skip >= totalItems) {
      return res.json({
        message: "All Refer user are already loaded",
      });
    }
    let data = await Generations.find(query)
      .populate({
        path: "referredUser",
        select: "firstName lastName profilePicture phoneNumber",
      })
      .skip(skip)
      .limit(limit);
    let totalReferUser = 0;
    
    data = await Promise.all(
      data.map(async (user) => {
        try {
          const length = await Generations.countDocuments({
            referByUser: mongoose.Types.ObjectId(user.referredUser),
            generationNumber: 1,
            active: true,
          });
          totalReferUser += length;
          return {
            ...user._doc,
            referCount: length,
          };
        } catch (error) {
          return {};
        }
      })
    ); 
    data = await data.sort((a, b) => b.referCount - a.referCount);
    res.json({
      data: data,
      total: totalItems,
      totalReferUser: totalReferUser,
    });
  } catch (error) {
    res.json({
      message: "Internal server error",
    });
  }
});
router.get("/refer-list", async (req, res) => {
  try {
    const { userID } = req.query;
    const data = await Generations.find({
      referByUser: userID,
      generationNumber: 1,
    }).populate({
      path: "referredUser",
      select:
        "firstName lastName profilePicture phoneNumber joinDate rank referUser",
      populate: {
        path: "referUser",
        select: "firstName lastName profilePicture phoneNumber joinDate rank",
      },
    }); 
    res.json({
      data: data,
    });
  } catch (error) {
    console.log("error ==>>", error);
    res.json({
      message: "Internal server error",
    });
  }
});

module.exports = router;
