const router = require("express").Router();
const user_collection = require("../../db/schemas/user_schema");
const Notification = require("../../db/schemas/notification");
const path = require("path");
const fs = require("fs");

router.get("/", async (req, res) => {
  try {
    console.log("req.id ==>", req.id);
    const userInfo = await user_collection
      .findOne({ _id: req.id })
      .select("isActive");
    let userStatusQuery = {};
    if (userInfo.isActive) {
      userStatusQuery = {
        activeUser: true,
      };
    } else {
      userStatusQuery = {
        nonActiveUser: true,
      };
    }

    let data = await Notification.find({
      ...userStatusQuery,
      expireTime: { $gte: new Date() },
    }).sort({ createdAt: -1 });

    console.log("data ==>", data);

    data = await Promise.all(
      data.filter(async (notice) => {
        if (notice.selectedUser && notice.selectedUser.length) {
          const existUser = await notice.selectedUser.some(
            (info) => info.userID.toString() === req.id
          );
          if (existUser) {
            return true;
          } else {
            return false;
          }
        }
        return true;
      })
    );
    console.log("data 3 ==>", data);


    res.json({
      data: data,
    });
  } catch (error) {
    res.json({
      message: "Failed to load social ",
    });
  }
});

module.exports = router;
