const router = require("express").Router();
const user_collection = require("../../db/schemas/user_schema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const date_provider = require("../../functions/date_provider");
const TransactionHistory = require("../../db/schemas/transactionHistory");
const { default: mongoose } = require("mongoose");
const Configs = require("../../db/schemas/Configs");

router.post("/get-list", async (req, res) => {
  try {
    const userID = req.id;
    const { balance, fromDate, toDate, search } = req.body;
    const query = {
      userID: mongoose.Types.ObjectId(userID),
      transactionType: "Transfer to Main Balance",
    };
    const { sort } = req.query;
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
    if (search) {
      query["$or"] = [
        {},
        {
          status: new RegExp(search, "i"),
        },
        {
          provider: new RegExp(search, "i"),
        },
      ];
    }
    let totalItems = await TransactionHistory.aggregate([
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

    let salesBalance = await TransactionHistory.aggregate([
      {
        $match: {
          userID: mongoose.Types.ObjectId(userID),
          transactionType: "Transfer to Main Balance",
          balanceType: "Sales Balance",
        },
      },
      {
        $group: {
          _id: null,
          totalBalance: { $sum: "$netAmount" },
        },
      },
    ]);
    let taskBalance = await TransactionHistory.aggregate([
      {
        $match: {
          userID: mongoose.Types.ObjectId(userID),
          transactionType: "Transfer to Main Balance",
          balanceType: "Task Balance",
        },
      },
      {
        $group: {
          _id: null,
          totalBalance: { $sum: "$netAmount" },
        },
      },
    ]);

    let totalBalance = await TransactionHistory.aggregate([
      {
        $match: { ...query },
      },
      {
        $group: {
          _id: null,
          totalBalance: {
            $sum: "$netAmount",
          },
        },
      },
    ]);

    const skip = Number(page - 1) * limit;

    if (skip >= totalItems) {
      return res.json({
        message: "All item are already loaded",
      });
    }
    const data = await TransactionHistory.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    if (salesBalance.length) {
      salesBalance = salesBalance[0].totalBalance || 0;
    } else {
      salesBalance = 0;
    }
    if (taskBalance.length) {
      taskBalance = taskBalance[0].totalBalance || 0;
    } else {
      taskBalance = 0;
    }
    if (totalBalance.length) {
      totalBalance = totalBalance[0].totalBalance || 0;
    } else {
      totalBalance = 0;
    }
    res.json({
      data: data,
      total: totalItems,
      page: Number(page),
      salesBalance,
      taskBalance,
      totalBalance,
    });
  } catch (error) {
    res.json({
      message: "Internal server error",
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const id = req.id;
    let chargePercent = 0;
    const { balanceType, amount, accountPIN } = req.body;
    if (!balanceType || !amount || !accountPIN) {
      return res.json({
        message: "Please, fill all required field",
      });
    }
    const query = {
      _id: req.id,
    };
    let balanceQuery = {};
    let updateInfo = {};
    console.log("req.body ==>>", req.body);

    // const config = await Configs.findOne({})
    // if (config && config.withdraw && config.withdraw.withdrawCost) {
    //     chargePercent = config.withdraw.withdrawCost
    // }
    // const withdrawCost = withdrawAmount * (chargePercent / 100)

    const withdrawAmount = Number(amount);
    const withdrawCost = 0;
    const netAmount = withdrawAmount + withdrawCost;

    if (balanceType === "Main Balance") {
      balanceQuery = { balance: { $lt: netAmount } };
    } else if (balanceType === "Sales Balance") {
      balanceQuery = { salesBalance: { $lt: netAmount } };
    } else if (balanceType === "Task Balance") {
      balanceQuery = { taskBalance: { $lt: netAmount } };
    }
    let checkBalance = await user_collection.findOne({
      ...query,
      ...balanceQuery,
    });
    console.log("balanceQuery ==>>", balanceQuery);
    console.log("checkBalance ==>>", checkBalance);
    if (checkBalance) {
      return res.json({
        message: "Insufficient balance",
      });
    }

    const info = {
      userID: id,
      transactionType: "Transfer to Main Balance",
      balanceType,
      amount: withdrawAmount,
      charge: withdrawCost,
      netAmount: netAmount,
      status: "Approve",
      transferBalance: {
        accountPIN,
      },
    };

    const data = await TransactionHistory.create(info);
    let userInfo = null;
    if (data) {
      if (balanceType === "Sales Balance") {
        updateInfo = {
          $inc: {
            balance: netAmount,
            salesBalance: -netAmount,
          },
        };
      } else if (balanceType === "Task Balance") {
        updateInfo = {
          $inc: {
            balance: netAmount,
            taskBalance: -netAmount,
          },
        };
      }
      console.log("updateInfo ==>", updateInfo);
      userInfo = await user_collection
        .findOneAndUpdate(
          {
            ...query,
          },
          {
            ...updateInfo,
          },
          {
            new: true,
          }
        )
        .select("balance taskBalance salesBalance");
    }
    res.json({
      success: "Balance transfer completed successfully",
      userInfo: userInfo,
      data,
    });
  } catch (error) {
    console.log("error ==>>", error);
    res
      .status(500)
      .json({ failed: "Failed to submit withdraw request, please try again." });
  }
});
router.put("/status", async (req, res) => {
  try {
    const { id } = req.body;
    const query = {
      _id: id,
    };
    let updateInfo = {};
    const transitionInfo = await TransactionHistory.findOne({
      ...query,
    });
    if (transitionInfo.status !== "Pending") {
      return res.json({
        message: "Sorry, Your can't cancel this transaction",
      });
    }

    const data = await TransactionHistory.findOneAndUpdate(
      {
        ...query,
      },
      { status: "Cancel" },
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
router.get("/last-balance", async (req, res) => {
  try {
    const id = req.id;
    const query = {
      userID: id,
      status: "Approve",
      transactionType: "Withdraw",
    };
    let lastMainBalance = await TransactionHistory.findOne({
      ...query,
      balanceType: "Main Balance",
    }).select("amount");
    let lastSalesBalance = await TransactionHistory.findOne({
      ...query,
      balanceType: "Sales Balance",
    }).select("amount");
    let lastTaskBalance = await TransactionHistory.findOne({
      ...query,
      balanceType: "Task Balance",
    }).select("amount");
    lastMainBalance = lastMainBalance ? lastMainBalance.amount : 0;
    lastSalesBalance = lastSalesBalance ? lastSalesBalance.amount : 0;
    lastTaskBalance = lastTaskBalance ? lastTaskBalance.amount : 0;

    res.json({
      data: {
        lastMainBalance,
        lastSalesBalance,
        lastTaskBalance,
      },
    });
  } catch (error) {
    res.json({
      message: "Internal server error",
    });
  }
});

module.exports = router;
