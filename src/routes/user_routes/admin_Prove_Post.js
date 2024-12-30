const router = require("express").Router();
const user_collection = require("../../db/schemas/user_schema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const path = require("path");
const date_provider = require("../../functions/date_provider");
const TransactionHistory = require("../../db/schemas/transactionHistory");
const Configs = require("../../db/schemas/Configs");
const ProveHistory = require("../../db/schemas/prove");




router.post("/", async (req, res) => {
  try {
    const query = {};
    const { sort } = req.query;
    const { postType, fromDate, toDate, search } = req.body;
    const limit = 15;
    const page = req.query.page || 1;
    if (postType) {
      if (postType === "Enable Post") {
        query["disable"] = false;
      } else if (postType === "Disable Post") {
        query["disable"] = true;
      }
    }
    // if (fromDate && toDate) {
    //   const startDate = new Date(fromDate);
    //   const endDate = new Date(toDate);
    //   const startOfDay = new Date(startDate.setHours(0, 0, 0, 0));
    //   const endOfDay = new Date(endDate.setHours(23, 59, 59, 999));
    //   query["$and"] = [
    //     {
    //       createdAt: { $lte: endOfDay },
    //     },
    //     {
    //       createdAt: { $gte: startOfDay },
    //     },
    //   ];
    // }
    if (search) {
      query["$or"] = [
        {
          "userID.fullName": new RegExp(search, "i"),
        },
        {
          "userID.phoneNumber": new RegExp(search, "i"),
        },
        {
          description: new RegExp(search, "i"),
        },
      ];
    }
    const totalItems = await ProveHistory.countDocuments(query);

    const skip = Number(page - 1) * limit;

    const data = await ProveHistory.aggregate([
      {
        $lookup: {
          from: "user_collectionssses",
          localField: "userID",
          foreignField: "_id", // Field from User collection
          as: "userID",
        },
      }, 
      { $unwind: { path: "$userID", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          description: 1,
          createdAt: 1,
          images: 1,
          disable: 1,
          "userID.firstName": 1,
          "userID.lastName": 1,
          "userID.phoneNumber": 1,
          "userID.balance": 1,
          "userID.salesBalance": 1,
          "userID.taskBalance": 1,
          "userID.profilePicture": 1,
          "userID.fullName": {
            $concat: ["$userID.firstName", "", "$userID.lastName"],
          },
        },
      },
      { $match: query },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
    ]);
    res.json({
      data: data,
      total: totalItems,
      page: Number(page),
      data: data,
    });
  } catch (error) {
    res.json({
      message: "Internal server error",
    });
  }
});
router.put("/status", async (req, res) => {
  try {
    const { status, id } = req.body;
    const query = {
      _id: id,
    };
    let updateInfo = {};
    if (status === "Enable") {
      updateInfo["disable"] = false;
    } else if (status === "Disable") {
      updateInfo["disable"] = true;
    }

    const transitionInfo = await ProveHistory.findOne({
      ...query,
    });

    let data = await ProveHistory.findOneAndUpdate(
      {
        ...query,
      },
      { ...updateInfo },
      { new: true }
    );

    res.json({
      data: data,
    });
  } catch (error) {
    res.json({
      message: "Internal server error",
    });
  }
});

router.post("/set-config", async (req, res) => {
  try {
    const body = req.body
    const { postAutoApprove  } =   body;
    const isConfigExist = await Configs.findOne({});
    if (!isConfigExist) {
      await Configs.create({});
    }

    const updateInfo = {};
    if (body.hasOwnProperty("postAutoApprove")) {
      updateInfo["provePost.postAutoApprove"] = postAutoApprove;
    }
     

    const updateConfig = await Configs.findOneAndUpdate(
      {},
      {
        ...updateInfo,
      },
      { new: true }
    );

    res.json({
      message: "Your Config is updated successfully",
      data: updateConfig,
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
});
router.delete("/delete", async (req, res) => {
  try {
    const { postID } = req.query;

    const postInfo = await ProveHistory.findOneAndDelete({ _id: postID });

    if (postInfo && postInfo.images && postInfo.images.length) {
      await postInfo.images.forEach(async (img) => {
        const imagePath = await path.join(proveDirectory(), img);
        if (fs.existsSync(imagePath)) {
          await fs.unlinkSync(imagePath);
        }
      });
    }

    res.json({
      data: postInfo,
    });
  } catch (error) {
    res.json({
      message: "Internal server error",
    });
  }
});

module.exports = router;
