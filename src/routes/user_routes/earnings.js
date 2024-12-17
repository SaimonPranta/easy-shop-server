const router = require("express").Router();
const user_collection = require("../../db/schemas/user_schema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const date_provider = require("../../functions/date_provider");
const TransactionHistory = require("../../db/schemas/transactionHistory");
const Configs = require("../../db/schemas/Configs");
const Generations = require("../../db/schemas/generations");
const { default: mongoose } = require("mongoose");

router.post("/", async (req, res) => {
  try {
    let totalBalance = {
      mainBalance: 0,
      taskBalance: 0,
      salesBalance: 0,
      totalBalance: 0,
    };
    const userID = req.id;
    const { sort } = req.query;
    const { balance, fromDate, toDate, search } = req.body;
    let limit = req.query.limit || 20;
    const page = req.query.page || 1;
    let date = new Date();
    const combination = Number(page - 1) * limit;

    if (fromDate && toDate) {
      date = new Date(fromDate);
      const endDate = new Date(toDate);
      if ((date > endDate) || page > 1) {
        return res.json({
          totalBalance: totalBalance,
          page: Number(page),
          data: [],
        });
      }
      const diffTime = Math.abs(endDate - date);
      limit = Number(diffTime / (1000 * 60 * 60 * 24)) + 1;
    } else {
      date.setDate(date.getDate() - combination);
    }

   
    const query = {
      userID: mongoose.Types.ObjectId(userID),
      $and: [
        {
          $or: [
            {
              transactionType: "Generation Income",
            },
            {
              transactionType: "Daily Task Income",
            },
          ],
        },
      ],
    };

    if (balance) {
      query["balanceType"] = balance;
    }

    const totalItems = await TransactionHistory.countDocuments(query);

    const skip = Number(page - 1) * limit;

    // const data = await TransactionHistory.aggregate([
    //   {
    //     $lookup: {
    //       from: "user_collectionssses",
    //       localField: "userID",
    //       foreignField: "_id", // Field from User collection
    //       as: "userID",
    //     },
    //   },
    //   { $unwind: { path: "$userID", preserveNullAndEmptyArrays: true } },
    //   {
    //     $project: {
    //       amount: 1,
    //       createdAt: 1,
    //       transactionType: 1,
    //       balanceType: 1,
    //       charge: 1,
    //       netAmount: 1,
    //       payments: 1,
    //       status: 1,
    //       "userID.firstName": 1,
    //       "userID.lastName": 1,
    //       "userID.phoneNumber": 1,
    //       "userID.balance": 1,
    //       "userID.salesBalance": 1,
    //       "userID.taskBalance": 1,
    //       "userID.profilePicture": 1,
    //       "userID.fullName": {
    //         $concat: ["$userID.firstName", "", "$userID.lastName"],
    //       },
    //     },
    //   },
    //   { $match: query },
    //   { $sort: { createdAt: -1 } },
    //   { $skip: skip },
    //   { $limit: limit },
    // ]);
    const data = [];
    for (let i = 0; i < limit; i++) {
      const currentDate = new Date(date);
      currentDate.setDate(currentDate.getDate() - i);
      let currentDateStart = new Date(currentDate);
      currentDateStart.setHours(0, 0, 0, 0);
      let currentDateEnd = new Date(currentDate);
      currentDateEnd.setHours(23, 59, 59, 999);
      const balanceInfo = {
        date: currentDateEnd,
        mainBalance: 0,
        taskBalance: 0,
        salesBalance: 0,
        totalBalance: 0,
      };
      try {
        const mainBalanceRes = await TransactionHistory.aggregate([
          {
            $match: {
              ...query,
              balanceType: "Main Balance",

              $and: [
                {
                  createdAt: { $lte: currentDateEnd },
                },
                {
                  createdAt: { $gte: currentDateStart },
                },
              ],
            },
          },
          {
            $group: {
              _id: null,
              incomes: { $sum: "$amount" },
            },
          },
        ]);
        const taskBalanceRes = await TransactionHistory.aggregate([
          {
            $match: {
              ...query,
              balanceType: "Task Balance",

              $and: [
                {
                  createdAt: { $lte: currentDateEnd },
                },
                {
                  createdAt: { $gte: currentDateStart },
                },
              ],
            },
          },
          {
            $group: {
              _id: null,
              incomes: { $sum: "$amount" },
            },
          },
        ]);
        if (mainBalanceRes.length && mainBalanceRes[0].incomes) {
          balanceInfo.mainBalance = mainBalanceRes[0].incomes;
          balanceInfo.totalBalance =
            balanceInfo.totalBalance + mainBalanceRes[0].incomes;
          totalBalance.mainBalance =
            totalBalance.mainBalance + mainBalanceRes[0].incomes;
        }
        if (taskBalanceRes.length && taskBalanceRes[0].incomes) {
          balanceInfo.taskBalance = taskBalanceRes[0].incomes;
          balanceInfo.totalBalance =
            balanceInfo.totalBalance + taskBalanceRes[0].incomes;
          totalBalance.mainBalance =
            totalBalance.mainBalance + taskBalanceRes[0].incomes;
        }
        console.log("i ==>", i);
        console.log("balanceInfo -->", balanceInfo);
        totalBalance.totalBalance =
          totalBalance.totalBalance + balanceInfo.totalBalance;
        data.push(balanceInfo);
      } catch (error) {
        data.push(balanceInfo);
      }
    }

    res.json({
      totalBalance: totalBalance,
      page: Number(page),
      data: data,
    });
  } catch (error) {
    console.log("error ==>", error);
    res.json({
      message: "Internal server error",
    });
  }
});
router.get("/init-balance", async (req, res) => {
  try {
    const userID = req.id;
    const balanceInfo = {
      todayEarning: 0,
      yesterdayEarning: 0,
    };
    const query = {
      userID: mongoose.Types.ObjectId(userID),
      $and: [
        {
          $or: [
            {
              transactionType: "Generation Income",
            },
            {
              transactionType: "Daily Task Income",
            },
          ],
        },
      ],
    };
    let today = new Date();
    today = new Date(today.setHours(0, 0, 0, 0));
    const todayBalance = await TransactionHistory.aggregate([
      {
        $match: {
          ...query,
          createdAt: { $gte: today },
        },
      },
      {
        $group: {
          _id: null,
          incomes: { $sum: "$amount" },
        },
      },
    ]);
    let yesterDay = new Date();
    yesterDay.setDate(yesterDay.getDate() - 1);
    let yesterDayStartDate = new Date(yesterDay);
    yesterDayStartDate.setHours(0, 0, 0, 0);

    let yesterDayEndOfDay = new Date(yesterDay);
    yesterDayEndOfDay.setHours(23, 59, 59, 999);

    const yesterDayBalance = await TransactionHistory.aggregate([
      {
        $match: {
          ...query,
          $and: [
            {
              createdAt: { $lte: yesterDayEndOfDay },
            },
            {
              createdAt: { $gte: yesterDayStartDate },
            },
          ],
        },
      },
      {
        $group: {
          _id: null,
          incomes: { $sum: "$amount" },
        },
      },
    ]);
    if (todayBalance.length && todayBalance[0].incomes) {
      balanceInfo.todayEarning = todayBalance[0].incomes;
    }
    if (yesterDayBalance.length && yesterDayBalance[0].incomes) {
      balanceInfo.yesterdayEarning = yesterDayBalance[0].incomes;
    }

    res.json({
      data: balanceInfo,
    });
  } catch (error) {
    res.json({
      message: "Internal server error",
    });
  }
});

module.exports = router;
