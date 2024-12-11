const router = require("express").Router();
const fs = require("fs");
const path = require("path");
const user_collection = require("../../db/schemas/user_schema");
const {
  profileDirectory,
  transactionDirectory,
  ranksDirectory,
} = require("../../constants/storageDirectory");
const Generations = require("../../db/schemas/generations");
const { default: mongoose } = require("mongoose");
const Ranks = require("../../db/schemas/ranks");

router.post("/set-ranks/:userID", async (req, res) => {
  try {
    const { userID } = req.params;
    //  const user = await Ranks.findOne({userID})
    const body = JSON.parse(req.body.data);
    const { name, accountNumber, mobileNumber, district, thana, rank } = body;
    const files = req.files;
    const img = files ? files.img : null;
    let imageName = "";

    if (
      !name ||
      !accountNumber ||
      !rank ||
      !mobileNumber ||
      !district ||
      !thana
    ) {
      return res.json({
        message: "Please, fill all required field",
      });
    }
    const userInfo = await user_collection
      .findOne({ _id: userID })
      .select("rankID")
      .populate({
        path: "rankID",
      });

    if (!userInfo) {
      return res.json({
        message: "User not found",
      });
    }

    if (!img && !userInfo.rankID.profilePicture) {
      return res.json({
        message: "Please provide profilePicture",
      });
    }

    if (img) {
      const extension = path.extname(img.name);
      let imgName = img.name.replace(extension, Date.now());
      img.name = `${imgName}${extension}`;
      imageName = img.name;
    } else if (userInfo.rankID && userInfo.rankID.profilePicture) {
      imageName = userInfo.rankID.profilePicture;
    }
    const bodyInfo = { ...body };
    delete bodyInfo["_id"];

    const updateInfo = {
      ...bodyInfo,
      userID: userInfo._id,
      profilePicture: imageName,
    };
    const data = await Ranks.create(updateInfo);

    if (data) {
      await user_collection.findOneAndUpdate(
        { _id: userID },
        { rankID: data._id }
      );
      if (img) {
        const imagePath = await path.join(ranksDirectory(), img.name);
        await img.mv(imagePath);
      }

      if (userInfo && userInfo.rankID) {
        await Ranks.findOneAndDelete(
          {
            _id: userInfo.rankID._id,
          },
          updateInfo
        );

        if (img) {
          const oldImagePath = await path.join(
            ranksDirectory(),
            userInfo.rankID.profilePicture
          );
          if (fs.existsSync(oldImagePath)) {
            await fs.unlinkSync(oldImagePath);
          }
        }
      }
    }

    res.json({
      data: data,
    });
  } catch (error) {
    res.json({
      message: "Internal server error",
    });
  }
});
router.get("/get-ranks", async (req, res) => {
  try {
    const { userID } = req.query;
    const data = await Ranks.findOne({ userID: userID });
    res.json({
      data: data,
    });
  } catch (error) {
    res.json({
      message: "Internal server error",
    });
  }
});

router.get("/all-user", async (req, res) => {
  try {
    const { fromDate, toDate, userType, page, search } = req.query;

    let query = {};
    if (userType) {
      if (userType === "Active") {
        query["isActive"] = true;
      } else if (userType === "Inactive") {
        query["isActive"] = false;
      }
    }
    if (fromDate && toDate) {
      const startDate = new Date(fromDate);
      const endDate = new Date(toDate);
      const startOfDay = new Date(startDate.setHours(0, 0, 0, 0));
      const endOfDay = new Date(endDate.setHours(23, 59, 59, 999));
      query["$and"] = [
        {
          joinDate: { $lte: endOfDay },
        },
        {
          joinDate: { $gte: startOfDay },
        },
      ];
    }

    if (search) {
      query["$or"] = [
        { phoneNumber: { $regex: search } },
        { firstName: { $regex: new RegExp(search, "i") } },
        { lastName: { $regex: new RegExp(search, "i") } },
      ];
    }
    let userCount = await user_collection.countDocuments(query);
    const limit = 10;
    const skip =
      userCount > Number(page) * limit ? userCount - Number(page) * limit : 0;

    // const userList = await user_collection.find(query).sort({joinDate: 1}).skip(skip).limit(limit)
    const userList = await user_collection.aggregate([
      {
        $addFields: {
          joinDate: { $toDate: "$joinDate" },
        },
      },
      {
        $match: query,
      },
      {
        $lookup: {
          from: "user_collectionssses",
          localField: "referUser",
          foreignField: "_id",
          as: "referUser",
        },
      },
      {
        $addFields: {
          referUser: { $arrayElemAt: ["$referUser", 0] }, // Extract the first element of 'referUser'
        },
      },
      {
        $sort: { joinDate: -1 },
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
    ]);
    // console.log("userList", userList);
    await userList.forEach(element => {
      if (element.taskBalance) {
        console.log("e=====>>", element.firstName)
      }
    });
    res.json({ data: userList, total: userCount, page: Number(page) });
  } catch (error) {
    res.json({
      message: "Internal server error",
    });
  }
});

module.exports = router;
