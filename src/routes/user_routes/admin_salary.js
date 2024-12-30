const router = require("express").Router();
const user_collection = require("../../db/schemas/user_schema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const date_provider = require("../../functions/date_provider");
const TransactionHistory = require("../../db/schemas/transactionHistory");
const Configs = require("../../db/schemas/Configs");
const Generations = require("../../db/schemas/generations");
const Salary = require("../../db/schemas/salary");
const { default: mongoose } = require("mongoose");
const generateRandom8DigitNumber = require("../../../src/functions/generateRandom8DigitNumber");

router.get("/init-balance", async (req, res) => {
  try {
    const balance = {
      totalUser: 0,
      totalSalaryBalance: 0,
    };
    const startDate = new Date();
    const startOfDay = new Date(startDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(startDate.setHours(23, 59, 59, 999));

    const query = {
      transactionType: "Payments",
    };
    const todayQuery = {
      createdAt: { $lte: endOfDay },
      createdAt: { $gte: startOfDay },
    };

    balance.totalUser = await Salary.countDocuments();

    let totalSalaryBalance = await Salary.aggregate([ 
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);
    if (totalSalaryBalance.length) {
      balance.totalSalaryBalance = totalSalaryBalance[0].total;
    }

    res.json({
      data: balance,
    });
  } catch (error) {
    console.log("error ==>", error);
    res.json({
      message: "Internal server error",
    });
  }
});
router.post("/", async (req, res) => {
  try {
    const query = {};
    const { sort } = req.query;
    const { balance, fromDate, toDate, search } = req.body;
    const limit = 10;
    const page = req.query.page || 1;

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
          "userID.fullName": new RegExp(search, "i"),
        },
        {
          "userID.phoneNumber": new RegExp(search, "i"),
        },
        {
          "payments.paymentMethod": new RegExp(search, "i"),
        },
        {
          "payments.paymentNumber": new RegExp(search, "i"),
        },
        {
          "payments.transitionNumber": new RegExp(search, "i"),
        },
        {
          status: new RegExp(search, "i"),
        },
      ];
    }
    const totalItems = await TransactionHistory.countDocuments(query);

    const skip = Number(page - 1) * limit;

    const data = await Salary.aggregate([
      {
        $lookup: {
          from: "user_collectionssses",
          localField: "userID",
          foreignField: "_id", // Field from User collection
          as: "userID",
        },
      },
      // { $unwind: { path: '$userInfo'} },
      { $unwind: { path: "$userID", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          amount: 1,
          id: 1,
          createdAt: 1,
          status: 1,
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
      _id: mongoose.Types.ObjectId(id),
    };

    let data = null;
    if (status === "Delete") {
      data = await Salary.findOneAndDelete({
        ...query,
      });
    } else {
      data = await Salary.findOneAndUpdate(
        {
          ...query,
        },
        { status },
        { new: true }
      );
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

router.post("/set-config", async (req, res) => {
  try {
    const body = req.body;
    const {
      salaryNotice,
      salaryRuleNotice,
      salaryBonusNotice,
      salaryHistoryTitle,
      salaryPaymentCondition,
    } = body;
    const isConfigExist = await Configs.findOne({});
    if (!isConfigExist) {
      await Configs.create({});
    }

    const updateInfo = {};

    if (body.hasOwnProperty("salaryNotice")) {
      updateInfo["salary.salaryNotice"] = salaryNotice;
    }
    if (body.hasOwnProperty("salaryRuleNotice")) {
      updateInfo["salary.salaryRuleNotice"] = salaryRuleNotice;
    }
    if (body.hasOwnProperty("salaryBonusNotice")) {
      updateInfo["salary.salaryBonusNotice"] = salaryBonusNotice;
    }
    if (body.hasOwnProperty("salaryHistoryTitle")) {
      updateInfo["salary.salaryHistoryTitle"] = salaryHistoryTitle;
    }

    if (salaryPaymentCondition.hasOwnProperty("salaryCountDay")) {
      updateInfo["salary.salaryPaymentCondition.salaryCountDay"] =
        salaryPaymentCondition.salaryCountDay;
    }
    if (salaryPaymentCondition.hasOwnProperty("salaryCountReferNumber")) {
      updateInfo["salary.salaryPaymentCondition.salaryCountReferNumber"] =
        salaryPaymentCondition.salaryCountReferNumber;
    }
    if (salaryPaymentCondition.hasOwnProperty("salaryPaymentAmount")) {
      updateInfo["salary.salaryPaymentCondition.salaryPaymentAmount"] =
        salaryPaymentCondition.salaryPaymentAmount;
    }

    const updateConfig = await Configs.findOneAndUpdate(
      {},
      {
        ...updateInfo,
      },
      { new: true }
    );
    console.log("updateConfig ==>>", updateConfig);
    res.json({
      message: "Your Config is completed successfully",
      data: updateConfig,
      success: true,
    });
  } catch (error) {
    console.log("error ==>>", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
});
router.post("/add-salary", async (req, res) => {
  try {
    const body = req.body;
    const { userID, salaryAmount, salaryDate } = body;
    const isUserExist = await user_collection.findOne({ _id: userID });
    if (!isUserExist || !userID || !salaryAmount || !salaryDate) {
      return res.json({
        message: "User not exist",
      });
    }

    const updateInfo = {
      userID,
      amount: Number(salaryAmount),
      id: generateRandom8DigitNumber(),
      createdAt: new Date(salaryDate),
    };
    const salary = await Salary.create(updateInfo);

    if (salary) {
      await user_collection.findOneAndUpdate(
        { _id: userID },
        { $inc: { balance: Number(salaryAmount) } }
      );
    }

    res.json({
      message: "Salary has been added successfully",
      data: salary,
      success: true,
    });
  } catch (error) {
    console.log("error ==>>", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
});

module.exports = router;
