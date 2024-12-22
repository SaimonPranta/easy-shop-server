const {
  storageDirectory,
  userTaskStorageDirectory,
} = require("../../constants/storageDirectory");
const DailyTaskList = require("../../db/schemas/dailyTaskList");
const UserTaskHIstory = require("../../db/schemas/userTaskHistory");
const DailyTasks = require("../../db/schemas/dailyTask");
const dateConverter = require("../../functions/YDM_to_date");
const { parseDate } = require("./utilities/index");
const testDate = require("./text");
const fs = require("fs");
const path = require("path");
const Configs = require("../../db/schemas/Configs");
const UserPointHistory = require("../../db/schemas/userPointHistory");
const user_collection = require("../../db/schemas/user_schema");
const mongoose = require("mongoose");
const TransactionHistory = require("../../db/schemas/transactionHistory");

const dailyTaskStorage = path.join(storageDirectory(), "daily_task");

exports.createDailyTask = async (req, res) => {
  try {
    const {
      title,
      description,
      taskLink,
      tutorialLink,
      autoApprove,
      taskStartDate,
      taskExpireDate,
      taskListID,
    } = JSON.parse(req.body.data);
    const image = req.files.img;

    if (
      image.mimetype !== "image/jpg" &&
      image.mimetype !== "image/png" &&
      image.mimetype !== "image/jpeg"
    ) {
      res
        .status(500)
        .send({ failed: "Only .jpg .png or .jpeg format allowed !" });
    } else if (image.size >= "3500012") {
      res.status(500).send({ failed: "Image Size are too large !" });
    } else {
      const extention = await image.mimetype.split("/")[1];
      image.name =
        (await image.name.split(".")[0]) +
        Math.floor(Math.random() * 10) +
        Date.now() +
        "." +
        extention;

      let dailyTaskListId = null;
      let data = null;
      if (taskListID) {
        dailyTaskListId = taskListID;
        data = await DailyTaskList.findOne({ _id: taskListID });
      } else {
        const taskListDocuments = await new DailyTaskList({
          taskStartDate: parseDate(taskStartDate, "Start Date"),
          taskExpireDate: parseDate(taskExpireDate, "Expire Date"),
          taskList: [],
        });
        data = await taskListDocuments.save();
        dailyTaskListId = data._id;
      }

      const additionalQuery = {};
      if (autoApprove) {
        additionalQuery["autoApprove"] = autoApprove;
      } else {
        additionalQuery["autoApprove"] = false;
      }
      if (tutorialLink) {
        additionalQuery["tutorialLink"] = tutorialLink;
      }
      const dailyTaskDocuments = await new DailyTasks({
        taskListID: dailyTaskListId,
        img: image.name,
        // title,
        description,
        taskLink,
        ...additionalQuery,
      });
      const dailyTaskData = await dailyTaskDocuments.save();
      await DailyTaskList.findOneAndUpdate(
        { _id: dailyTaskListId },
        {
          currentTaskID: dailyTaskData._id,
          $push: {
            taskList: {
              $each: [{ taskID: dailyTaskData._id }],
            },
          },
        }
      );

      if (dailyTaskListId) {
        if (!fs.existsSync(dailyTaskStorage)) {
          fs.mkdirSync(dailyTaskStorage);
        }
        await image.mv(`${dailyTaskStorage}/${image.name}`);

        res.status(201).json({
          data: data,
          message: "successfully added product",
        });
      } else {
        res.status(417).json({
          message: "failed to add product",
        });
      }
    }

    // res.json({
    //     message: "Success"
    // })
  } catch (error) {
    res.json({
      message: "Internal server error",
    });
  }
};
exports.editDailyTask = async (req, res) => {
  try {
    const {
      title,
      description,
      taskLink,
      tutorialLink,
      autoApprove,
      taskStartDate,
      taskExpireDate,
      dailyTaskID,
      imageUpdate,
    } = JSON.parse(req.body.data);
    const files = req.files;
    const image = files ? files.img : null;

    if (
      imageUpdate &&
      image.mimetype !== "image/jpg" &&
      image.mimetype !== "image/png" &&
      image.mimetype !== "image/jpeg"
    ) {
      res
        .status(500)
        .send({ failed: "Only .jpg .png or .jpeg format allowed !" });
    } else if (imageUpdate && image.size >= "3500012") {
      res.status(500).send({ failed: "Image Size are too large !" });
    } else {
      if (imageUpdate && image) {
        const extention = await image.mimetype.split("/")[1];
        image.name =
          (await image.name.split(".")[0]) +
          Math.floor(Math.random() * 10) +
          Date.now() +
          "." +
          extention;
      }

      const additionalQuery = {};
      if (autoApprove) {
        additionalQuery["autoApprove"] = autoApprove;
      } else {
        additionalQuery["autoApprove"] = false;
      }
      if (tutorialLink) {
        additionalQuery["tutorialLink"] = tutorialLink;
      }
      if (image && image.name) {
        additionalQuery["img"] = image.name;
      }
      if (description) {
        additionalQuery["description"] = description;
      }
      if (taskLink) {
        additionalQuery["taskLink"] = taskLink;
      }

      if (imageUpdate) {
        const dailyTask = await DailyTasks.findOne({ _id: dailyTaskID });
        let imgPath = `${dailyTaskStorage}/${dailyTask.img}`;
        if (fs.existsSync(imgPath)) {
          await fs.unlinkSync(imgPath);
        }
      }

      const dailyTaskData = await DailyTasks.findOneAndUpdate(
        { _id: dailyTaskID },
        {
          ...additionalQuery,
        },
        { new: true }
      );

      if (dailyTaskData) {
        if (taskStartDate && taskExpireDate) {
          await DailyTaskList.findOneAndUpdate(
            { _id: dailyTaskData.taskListID },
            {
              taskStartDate: parseDate(taskStartDate, "Start Date"),
              taskExpireDate: parseDate(taskExpireDate, "Expire Date"),
            }
          );
        }
        if (dailyTaskID && image) {
          if (!fs.existsSync(dailyTaskStorage)) {
            fs.mkdirSync(dailyTaskStorage);
          }
          await image.mv(`${dailyTaskStorage}/${image.name}`);
        }

        res.status(201).json({
          data: dailyTaskData,
          message: "successfully added product",
        });
      } else {
        res.status(417).json({
          message: "failed to add product",
        });
      }
    }

    // res.json({
    //     message: "Success"
    // })
  } catch (error) {
    res.json({
      message: "Internal server error",
    });
  }
};

exports.getDailyTask = async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    let allTask = await DailyTaskList.aggregate([
      {
        $match: {
          $or: [
            {
              taskStartDate: { $lte: endOfDay },
              taskExpireDate: { $gte: startOfDay },
            }, // Date range includes today
            { taskStartDate: { $gte: startOfDay, $lte: endOfDay } }, // taskStartDate is today
            // { taskExpireDate: { $gte: startOfDay, $lte: endOfDay } }  // taskExpireDate is today
          ],
        },
      },
      {
        $lookup: {
          from: "daily_tasks",
          localField: "currentTaskID",
          foreignField: "_id",
          as: "currentTaskID",
        },
      },
      {
        $unwind: "$currentTaskID",
      },
    ]);

    let isCompletedTask = true;
    allTask = await Promise.all(
      allTask.map(async (task, i) => {
        const isTaskComplete = await UserTaskHIstory.findOne({
          userID: req.id,
          taskListID: task._id,
          completed: true,
          $and: [
            { createdAt: { $gte: startOfDay } },
            { createdAt: { $lte: endOfDay } },
          ],
        });
        if (!isTaskComplete) {
          isCompletedTask = false;
        }
        return {
          ...task,
          isTaskComplete: isTaskComplete ? true : false,
        };
      })
    );
    res.json({
      message: "Successfully get daily task",
      data: [...allTask],
      isCompletedTask,
    });
  } catch (error) {
    res.json({
      message: "Internal server error",
    });
  }
};
exports.getDailyTaskDetails = async (req, res) => {
  try {
    const { dailyTaskID } = req.query;
    function formatDate(isoString) {
      // Parse the ISO date string
      const date = new Date(isoString);

      // Extract year, month, and day
      const year = date.getUTCFullYear();
      const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // Months are 0-based, so add 1
      const day = String(date.getUTCDate()).padStart(2, "0");

      // Return the formatted date
      return `${year}-${month}-${day}`;
    }
    let dailyTask = await DailyTasks.findOne({
      _id: dailyTaskID,
    }).populate("taskListID");
    if (dailyTask && dailyTask.taskListID) {
      dailyTask = {
        ...dailyTask._doc,
        taskStartDate: formatDate(dailyTask.taskListID.taskStartDate),
        taskExpireDate: formatDate(dailyTask.taskListID.taskExpireDate),
      };
    }

    res.json({
      message: "Successfully get daily task",
      data: dailyTask,
    });
  } catch (error) {
    res.json({
      message: "Internal server error",
    });
  }
};

exports.createUserTaskHistory = async (req, res) => {
  try {
    const { taskListID, dailyTaskID } = req.body;
    const files = req.files || {};
    const id = req.id;
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));
    let images = [];
    let imageString = [];

    await Object.entries(files).map(([key, img]) => {
      const fileExt = path.extname(img.name);
      let fileName = img.name.replace(fileExt, "");
      fileName = fileName + Math.floor(Math.random() * 10) + Date.now();
      fileName = fileName + fileExt;
      img.name = fileName;

      imageString.push(fileName);
      images.push(img);
    });

    const dailyTask = await DailyTasks.findOne({ _id: dailyTaskID });

    const isTaskComplete = await UserTaskHIstory.findOne({
      userID: id,
      taskListID: taskListID,
      // completed: true,
      $and: [
        { createdAt: { $gte: startOfDay } },
        { createdAt: { $lte: endOfDay } },
      ],
    });

    if (dailyTask.autoApprove && isTaskComplete) {
      return res.json({
        message: "This task already completed",
      });
    }

    let userTaskHistoryData = null;

    if (isTaskComplete) {
      userTaskHistoryData = await UserTaskHIstory.findOneAndUpdate(
        { _id: isTaskComplete._id },
        {
          taskListID,
          dailyTaskID,
          userID: id,
          completed: dailyTask.autoApprove,
          images: [...imageString],
        },
        { new: true }
      );
      if (isTaskComplete.images && isTaskComplete.images.length) {
        await isTaskComplete.images.forEach((img) => {
          fs.rmSync(path.join(userTaskStorageDirectory(), img), {
            force: true,
          });
        });
      }
    } else {
      const userTaskHistoryDocument = await new UserTaskHIstory({
        taskListID,
        dailyTaskID,
        userID: id,
        completed: dailyTask.autoApprove,
        images: [...imageString],
      });
      userTaskHistoryData = await userTaskHistoryDocument.save();
    }

    if (userTaskHistoryData) {
      await DailyTaskList.findOneAndUpdate(
        { _id: taskListID },
        { $inc: { taskCompleteCount: 1 } },
        { new: true }
      );
      await DailyTasks.findOneAndUpdate(
        { _id: dailyTaskID },
        { $inc: { taskCompleteCount: 1 } },
        { new: true }
      );
      await images.forEach(async (imgInfo) => {
        if (!fs.existsSync(userTaskStorageDirectory())) {
          await fs.mkdirSync(
            path.join(storageDirectory(), "user_task_history")
          );
        }
        const filepath = path.join(userTaskStorageDirectory(), imgInfo.name);
        await imgInfo.mv(`${userTaskStorageDirectory()}/${imgInfo.name}`);
      });
    }

    res.json({
      message: "Successfully, your task is completed",
      taskListID: taskListID,
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
exports.setConfig = async (req, res) => {
  try {
    const body = req.body;
    const {
      taskRewardsList,
      maximumAmount,
      tutorialVideoId,
      taskNotice,
      taskOffNotice,
      taskStartDate,
      taskExpireDate,
      pointConvertAmount,
    } = body;
    const isConfigExist = await Configs.findOne({});
    if (!isConfigExist) {
      await Configs.create({});
    }

    const updateInfo = {};
    const unsetUpdateInfo = {};
    if (body.hasOwnProperty("taskRewardsList")) {
      updateInfo["dailyTask.taskRewardsList"] = taskRewardsList;
    }
    if (body.hasOwnProperty("maximumAmount")) {
      updateInfo["dailyTask.maximumAmount"] = Number(maximumAmount);
    }
    if (body.hasOwnProperty("tutorialVideoId")) {
      updateInfo["dailyTask.tutorialVideoId"] = tutorialVideoId;
    }
    if (body.hasOwnProperty("pointConvertAmount")) {
      updateInfo["dailyTask.pointConvertAmount"] = pointConvertAmount;
    }
    if (body.hasOwnProperty("taskNotice")) {
      updateInfo["dailyTask.taskNotice"] = taskNotice;
    }
    if (body.hasOwnProperty("taskOffNotice")) {
      updateInfo["dailyTask.taskOffNotice"] = taskOffNotice;
    }
    if (body.hasOwnProperty("taskStartDate")) {
      if (!isNaN(new Date(taskStartDate))) {
        updateInfo["dailyTask.taskStartDate"] = new Date(taskStartDate);
      } else {
        unsetUpdateInfo["dailyTask.taskStartDate"] = "";
      }
    }
    if (body.hasOwnProperty("taskExpireDate")) {
      if (!isNaN(new Date(taskExpireDate))) {
        updateInfo["dailyTask.taskExpireDate"] = new Date(taskExpireDate);
      } else {
        unsetUpdateInfo["dailyTask.taskExpireDate"] = "";
      }
    }

    const updateConfig = await Configs.findOneAndUpdate(
      {},
      {
        ...updateInfo,
        $unset: {
          ...unsetUpdateInfo,
        },
      },
      { new: true }
    );

    res.json({
      message: "Your Config is completed successfully",
      data: updateConfig,
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
exports.userConfig = async (req, res) => {
  try {
    const { taskListID, dailyTaskID } = req.body;
    const files = req.files || {};
    const id = req.id;
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));
    let images = [];
    let imageString = [];

    await Object.entries(files).map(([key, img]) => {
      const fileExt = path.extname(img.name);
      let fileName = img.name.replace(fileExt, "");
      fileName = fileName + Math.floor(Math.random() * 10) + Date.now();
      fileName = fileName + fileExt;
      img.name = fileName;

      imageString.push(fileName);
      images.push(img);
    });

    const isTaskComplete = await UserTaskHIstory.findOne({
      userID: id,
      taskListID: taskListID,
      $and: [
        { createdAt: { $gte: startOfDay } },
        { createdAt: { $lte: endOfDay } },
      ],
    });

    if (isTaskComplete) {
      return res.json({
        message: "This task already completed",
      });
    }

    const userTaskHistoryDocument = await new UserTaskHIstory({
      taskListID,
      dailyTaskID,
      userID: id,
      images: [...imageString],
    });
    const userTaskHistoryData = await userTaskHistoryDocument.save();

    if (userTaskHistoryData) {
      await DailyTaskList.findOneAndUpdate(
        { _id: taskListID },
        { $inc: { taskCompleteCount: 1 } },
        { new: true }
      );
      await DailyTasks.findOneAndUpdate(
        { _id: dailyTaskID },
        { $inc: { taskCompleteCount: 1 } },
        { new: true }
      );
      await images.forEach(async (imgInfo) => {
        if (!fs.existsSync(userTaskStorageDirectory())) {
          await fs.mkdirSync(
            path.join(storageDirectory(), "user_task_history")
          );
        }
        const filepath = path.join(userTaskStorageDirectory(), imgInfo.name);
        await imgInfo.mv(`${userTaskStorageDirectory()}/${imgInfo.name}`);
      });
    }

    res.json({
      message: "Successfully, your task is completed",
      taskListID: taskListID,
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
exports.setUserPoints = async (req, res) => {
  try {
    const { pointAmount } = req.body;
    const id = req.id;

    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const config = await Configs.findOne({}).select("dailyTask");

    const isExistHistory = await UserPointHistory.findOne({
      userID: id,
      $and: [
        { createdAt: { $gte: startOfDay } },
        { createdAt: { $lte: endOfDay } },
      ],
    });

    if (isExistHistory) {
      return res.json({
        message: "Daily task reward already added",
      });
    }

    const data = await UserPointHistory.create({
      userID: id,
      pointAmount,
    });
    if (!data) {
      return res.json({
        message: "Internal server error",
      });
    }
    let currentPoint = 0;
    const user = await user_collection
      .findOneAndUpdate(
        {
          _id: id,
        },
        {
          $inc: { pointAmount: Number(pointAmount) },
        },
        {
          new: true,
        }
      )
      .select("pointAmount");
    currentPoint = user.pointAmount;
    if (user && user.pointAmount) {
      if (
        config.dailyTask &&
        Number(config.dailyTask.pointConvertAmount) <= Number(user.pointAmount)
      ) {
        const currentTaskBalance =
          Number(user.pointAmount) /
          Number(config.dailyTask.pointConvertAmount);

        await TransactionHistory.create({
          userID: id,
          transactionType: "Daily Task Income",
          balanceType: "Task Balance",
          amount: Number(currentTaskBalance),
          netAmount: Number(currentTaskBalance),
          status: "Approve",
        });
        const currentUser = await user_collection
          .findOneAndUpdate(
            {
              _id: id,
            },
            {
              $inc: { taskBalance: Number(currentTaskBalance) },
              pointAmount: 0,
            },
            {
              new: true,
            }
          )
          .select("pointAmount");
        currentPoint = currentUser.pointAmount;
      }
    }
    console.log("Hello from spin");

    res.json({
      message: "Daily task reward added successfully",
      success: true,
      pointAmount: currentPoint,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
exports.spinInfo = async (req, res) => {
  try {
    const { pointAmount } = req.body;
    const id = req.id;

    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const isExistHistory = await UserPointHistory.findOne({
      userID: id,
      $and: [
        { createdAt: { $gte: startOfDay } },
        { createdAt: { $lte: endOfDay } },
      ],
    });
    const spinPointHistory = await UserPointHistory.aggregate([
      {
        $match: {
          $and: [
            { createdAt: { $gte: startOfDay } },
            { createdAt: { $lte: endOfDay } },
          ],
        },
      },
      {
        $group: {
          _id: "$pointAmount",
          pointAmount: { $first: "$pointAmount" },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
        },
      },
    ]);

    res.json({
      message: "Daily task reward added successfully",
      success: true,
      data: {
        disableSpin: isExistHistory ? true : false,
        spinPointHistory: spinPointHistory || [],
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
exports.userList = async (req, res) => {
  try {
    let todayUserWork = 0;
    const { fromDate, toDate, search } = req.body;
    let query = {};

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
    if (search) {
      query["$or"] = [
        {
          fullName: new RegExp(search, "i"),
        },
        {
          "userID.phoneNumber": new RegExp(search, "i"),
        },
      ];
    }
    console.log("req.body ->", req.body);
    console.log("query ->", query);
    const spinPointHistory = await UserTaskHIstory.aggregate([
      {
        $lookup: {
          localField: "userID",
          foreignField: "_id",
          from: "user_collectionssses",
          as: "userID",
        },
      },
      {
        $unwind: {
          path: "$userID",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: "$userID",
          fullName: {
            $first: {
              $concat: ["$userID.firstName", " ", "$userID.lastName"],
            },
          },
          userID: {
            $first: "$userID",
          },
          createdAt: { $first: "$createdAt" },
        },
      },
      { $match: query },
      {
        $sort: {
          createdAt: 1,
        },
      },
    ]);
    console.log("spinPointHistory ==>", spinPointHistory);

    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const todayWorkUserNumber = await UserTaskHIstory.aggregate([
      {
        $match: {
          $and: [
            { createdAt: { $gte: startOfDay } },
            { createdAt: { $lte: endOfDay } },
          ],
        },
      },
      {
        $lookup: {
          localField: "userID",
          foreignField: "_id",
          from: "user_collectionssses",
          as: "userID",
        },
      },
      {
        $unwind: {
          path: "$userID",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: "$userID",
          userID: {
            $first: "$userID",
          },
          createdAt: { $first: "$createdAt" },
        },
      },
      {
        $sort: {
          createdAt: 1,
        },
      },
    ]);

    todayUserWork = todayWorkUserNumber.length;

    res.json({
      message: "Daily task reward added successfully",
      success: true,
      data: spinPointHistory,
      todayUserWork: todayUserWork,
    });
  } catch (error) {
    console.log("error ==>", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
exports.adminGetTask = async (req, res) => {
  try {
    const { userID } = req.query;
    let todayPoint = 0;
    const spinPointHistory = await UserTaskHIstory.aggregate([
      {
        $match: {
          userID: mongoose.Types.ObjectId(userID),
        },
      },
      {
        $lookup: {
          localField: "taskListID",
          foreignField: "_id",
          from: "daily_task_lists",
          as: "taskListID",
        },
      },
      {
        $lookup: {
          localField: "dailyTaskID",
          foreignField: "_id",
          from: "daily_tasks",
          as: "dailyTaskID",
        },
      },
      {
        $unwind: {
          path: "$taskListID",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: "$dailyTaskID",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
    ]);

    const startDate = new Date();
    const endDate = new Date();
    const startOfDay = new Date(startDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(endDate.setHours(23, 59, 59, 999));
    console.log(" _-->>", {
      startOfDay,
      endOfDay,
    });
    const getUserPoints = await UserPointHistory.aggregate([
      {
        $match: {
          userID: mongoose.Types.ObjectId(userID),
          source: "Daily Task",
          $and: [
            { createdAt: { $gte: startOfDay } },
            { createdAt: { $lte: endOfDay } },
          ],
        },
      },
      {
        $group: {
          _id: null,
          pointAmount: { $sum: "$pointAmount" },
        },
      },
    ]);
    if (
      getUserPoints.length &&
      getUserPoints[0] &&
      getUserPoints[0].pointAmount
    ) {
      todayPoint = getUserPoints[0].pointAmount;
    }
    res.json({
      message: "Daily task reward added successfully",
      success: true,
      data: spinPointHistory,
      todayPoint: todayPoint,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

exports.taskApprove = async (req, res) => {
  try {
    const { taskID, name } = req.body;

    const updateTask = await UserTaskHIstory.findOneAndUpdate(
      { _id: taskID },
      { completed: true },
      { new: true }
    );

    res.json({
      success: true,
      data: updateTask,
      message: `${name}'s daily task has been approved successfully`,
    });
  } catch (error) {
    res.json({ message: "Internal server error" });
  }
};
exports.dailyTaskList = async (req, res) => {
  try {
    let query = {};
    const { sort } = req.query;
    const { balance, fromDate, toDate, search, groupID, tableType } = req.body;
    const limit = 20;
    const page = req.query.page || 1;
    if (balance) {
      query["balanceType"] = balance;
    }
    // tableType === "Group Daily Task"
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
    if (search) {
      query["$or"] = [
        {
          description: new RegExp(search, "i"),
        },
      ];
    }
    if (groupID) {
      query = {
        // 'taskListID._id': groupID
        "taskListID._id": mongoose.Types.ObjectId(groupID),
      };
    }
    let totalItems = 0;
    if (tableType === "Group Daily Task") {
      totalItems = await DailyTaskList.aggregate([
        {
          $lookup: {
            from: "daily_tasks",
            localField: "taskList.taskID",
            foreignField: "_id",
            as: "taskList",
          },
        },
        { $unwind: { path: "$taskListID", preserveNullAndEmptyArrays: true } },
        { $match: query },
        { $count: "totalCount" },
      ]);
    } else {
      totalItems = await DailyTasks.aggregate([
        {
          $lookup: {
            from: "daily_task_lists",
            localField: "taskListID",
            foreignField: "_id",
            as: "taskListID",
          },
        },
        { $unwind: { path: "$taskListID", preserveNullAndEmptyArrays: true } },
        { $match: query },
        { $count: "totalCount" },
      ]);
    }

    if (totalItems.length) {
      totalItems = totalItems[0].totalCount || 0;
    } else {
      totalItems = 0;
    }

    const skip = Number(page - 1) * limit;

    let data = [];
    if (tableType === "Group Daily Task") {
      data = await DailyTaskList.aggregate([
        {
          $lookup: {
            from: "daily_tasks",
            localField: "taskList.taskID",
            foreignField: "_id",
            as: "taskList",
          },
        },
        { $unwind: { path: "$taskListID", preserveNullAndEmptyArrays: true } },
        { $match: query },
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: limit },
      ]);
    } else {
      data = await DailyTasks.aggregate([
        {
          $lookup: {
            from: "daily_task_lists",
            localField: "taskListID",
            foreignField: "_id",
            as: "taskListID",
          },
        },
        // { $unwind: { path: '$userInfo'} },
        { $unwind: { path: "$taskListID", preserveNullAndEmptyArrays: true } },
        { $match: query },
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: limit },
      ]);
    }

    res.json({
      data: data,
      total: totalItems,
      page: Number(page),
    });
  } catch (error) {
    res.json({
      message: "Internal server error",
    });
  }
};
exports.dailySelectTask = async (req, res) => {
  try {
    const { taskID, taskGroupID } = req.body;
    const updateTask = await DailyTaskList.findOneAndUpdate(
      { _id: taskGroupID },
      { currentTaskID: taskID },
      { new: true }
    );
    res.json({ data: updateTask });
  } catch (error) {
    res.json({
      message: "Internal server error",
    });
  }
};
exports.dailyDeleteTask = async (req, res) => {
  try {
    const { taskID, taskGroupID } = req.body;
    const updateTask = await DailyTasks.findOneAndDelete({
      _id: taskID,
    });
    if (updateTask && updateTask.img) {
      const filePath = path.join(dailyTaskStorage, updateTask.img)
      if (fs.existsSync(filePath)) {
        await fs.unlinkSync(filePath)
      }
    }
    res.json({ data: updateTask });
  } catch (error) {
    console.log("error ===?>", error)
    res.json({
      message: "Internal server error",
    });
  }
};
exports.dailyTaskStatus = async (req, res) => {
  try {
    const { taskListID, status } = req.body;
    let updateInfo = {};
    if (status === "Enable") {
      updateInfo = { inactive: false };
    } else if (status === "Disable") {
      updateInfo = { inactive: true };
    }

    const updateTask = await DailyTaskList.findOneAndUpdate(
      { _id: taskListID },
      { ...updateInfo },
      { new: true }
    );
    res.json({ data: updateTask });
  } catch (error) {
    res.json({
      message: "Internal server error",
    });
  }
};
