const router = require("express").Router();
const user_collection = require("../../db/schemas/user_schema");
const path = require("path");
const fs = require("fs");
const proveHistory = require("../../db/schemas/prove");
const { proveDirectory } = require("../../constants/storageDirectory");
const { default: mongoose } = require("mongoose");
const Configs = require("../../db/schemas/Configs");
const ProveHistory = require("../../db/schemas/prove");

router.post("/", async (req, res) => {
  try {
    const query = {};
    const { sort } = req.query;
    const { postType, fromDate, toDate, search } = req.query;
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
console.log("query ==>>", query)
console.log("search ==>>", search)
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
    console.log("error ==>>", error)
    res.json({
      message: "Internal server error",
    });
  }
});

module.exports = router;
