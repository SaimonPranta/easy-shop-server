const router = require("express").Router();
const user_collection = require("../../db/schemas/user_schema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const date_provider = require("../../functions/date_provider");
const TransactionHistory = require("../../db/schemas/transactionHistory");
const Configs = require("../../db/schemas/Configs");

router.get("/init-balance", async (req, res) => {
  try {
    const balance = {
      todayApproveWithdrawRequest: 0,
      todayPendingWithdrawRequest: 0,
      totalTotalWithdrawRequest: 0,
      totalApproveWithdrawRequest: 0,
      totalPendingWithdrawRequest: 0,
      totalWithdrawRequest: 0,
      todayApproveWithdrawBalance: 0,
      todayPendingWithdrawBalance: 0,
      totalTotalWithdrawBalance: 0,
      totalApproveWithdrawBalance: 0,
      totalPendingWithdrawBalance: 0,
      totalWithdrawBalance: 0,
    };
    const startDate = new Date();
    const startOfDay = new Date(startDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(startDate.setHours(23, 59, 59, 999));

    
    const query = {
      transactionType: "Withdraw",
    };
    const todayQuery = {
        createdAt: { $lte: endOfDay },
        createdAt: { $gte: startOfDay }, 
    };

    balance.todayApproveWithdrawRequest = await TransactionHistory.countDocuments(
      {
        ...query,
        ...todayQuery,
        status: "Approve",
      }
    );
    balance.todayPendingWithdrawRequest = await TransactionHistory.countDocuments(
      {
        ...query,
        ...todayQuery,
        status: "Pending",
      }
    );
    balance.totalTotalWithdrawRequest = await TransactionHistory.countDocuments({
      ...query,
      ...todayQuery,
    });
    balance.totalApproveWithdrawRequest = await TransactionHistory.countDocuments(
      {
        ...query,
        status: "Approve",
      }
    );
    balance.totalPendingWithdrawRequest = await TransactionHistory.countDocuments(
      {
        ...query,
        status: "Pending",
      }
    );
    balance.totalWithdrawRequest = await TransactionHistory.countDocuments({
      ...query,
    });

    let todayApproveWithdrawBalance = await TransactionHistory.aggregate([
      {
        $match: {
          ...query,
          ...todayQuery,
          status: "Approve",
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);
    if (todayApproveWithdrawBalance.length) {
        balance.todayApproveWithdrawBalance = todayApproveWithdrawBalance[0].total;
    }
    let todayPendingWithdrawBalance = await TransactionHistory.aggregate([
      {
        $match: {
          ...query,
          ...todayQuery,
          status: "Pending",
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);
    if (todayPendingWithdrawBalance.length) {
        balance.todayPendingWithdrawBalance = todayPendingWithdrawBalance[0].total;
    }
    let totalTotalWithdrawBalance = await TransactionHistory.aggregate([
      {
        $match: {
          ...query,
          ...todayQuery,
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);
    if (totalTotalWithdrawBalance.length) {
        balance.totalTotalWithdrawBalance = totalTotalWithdrawBalance[0].total;
    }
    let totalApproveWithdrawBalance = await TransactionHistory.aggregate([
      {
        $match: {
          ...query,
          status: "Approve",
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);
    if (totalApproveWithdrawBalance.length) {
        balance.totalApproveWithdrawBalance = totalApproveWithdrawBalance[0].total;
    }
    let totalPendingWithdrawBalance = await TransactionHistory.aggregate([
      {
        $match: {
          ...query,
          status: "Pending",
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);
    if (totalPendingWithdrawBalance.length) {
        balance.totalPendingWithdrawBalance = totalPendingWithdrawBalance[0].total;
    }
    let totalWithdrawBalance = await TransactionHistory.aggregate([
      {
        $match: {
          ...query,
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);
    if (totalWithdrawBalance.length) {
        balance.totalWithdrawBalance = totalWithdrawBalance[0].total;
    }
    console.log("---->", {
        startOfDay,
        endOfDay
    })
    console.log("balance.todayTotalWithdrawRequest ==>", balance)


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
    const query = {
      transactionType: "Withdraw",
    };
    const { sort } = req.query;
    const { balance, fromDate, toDate, search } = req.body;
    const limit = 10;
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
        {
          "userID.fullName": new RegExp(search, "i"),
        },
        {
          "userID.phoneNumber": new RegExp(search, "i"),
        },
        {
          "userID.withdraw": new RegExp(search, "i"),
        },
        {
          status: new RegExp(search, "i"),
        },
      ];
    }
    const totalItems = await TransactionHistory.countDocuments(query);
 

    const skip = Number(page - 1) * limit;

     
    const data = await TransactionHistory.aggregate([
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
          createdAt: 1,
          transactionType: 1,
          balanceType: 1,
          charge: 1,
          netAmount: 1,
          withdraw: 1,
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
      _id: id,
    };
    let updateInfo = {};

    const transitionInfo = await TransactionHistory.findOne({
      ...query,
    });

    if (status === "Approve") {
      let balanceQuery = {};

      if (transitionInfo.balanceType === "Main Balance") {
        balanceQuery = { balance: { $lte: transitionInfo.netAmount } };
      } else if (transitionInfo.balanceType === "Sales Balance") {
        balanceQuery = { salesBalance: { $lte: transitionInfo.netAmount } };
      } else if (transitionInfo.balanceType === "Task Balance") {
        balanceQuery = { taskBalance: { $lte: transitionInfo.netAmount } };
      }
      let checkBalance = await user_collection.findOne({
        _id: transitionInfo.userID,
        ...balanceQuery,
      });

      if (checkBalance) {
        return res.json({
          message: `${checkBalance.firstName} ${checkBalance.lastName} has insufficient balance`,
        });
      }
    }
    if (transitionInfo && transitionInfo.status === "Pending") {
      if (status === "Approve") {
        if (transitionInfo.balanceType === "Main Balance") {
          const updateUsr = await user_collection.findOneAndUpdate(
            { _id: transitionInfo.userID },
            { $inc: { balance: -transitionInfo.netAmount } },
            { new: true }
          );
        } else if (transitionInfo.balanceType === "Sales Balance") {
          const updateUsr = await user_collection.findOneAndUpdate(
            { _id: transitionInfo.userID },
            { $inc: { salesBalance: -transitionInfo.netAmount } },
            { new: true }
          );
        } else if (transitionInfo.balanceType === "Sales Balance") {
          const updateUsr = await user_collection.findOneAndUpdate(
            { _id: transitionInfo.userID },
            { $inc: { taskBalance: -transitionInfo.netAmount } },
            { new: true }
          );
        }
      }
    } else if (transitionInfo && transitionInfo.status === "Approve") {
      if (transitionInfo.balanceType === "Main Balance") {
        const updateUsr = await user_collection.findOneAndUpdate(
          { _id: transitionInfo.userID },
          { $inc: { balance: transitionInfo.netAmount } },
          { new: true }
        );
      } else if (transitionInfo.balanceType === "Sales Balance") {
        const updateUsr = await user_collection.findOneAndUpdate(
          { _id: transitionInfo.userID },
          { $inc: { salesBalance: transitionInfo.netAmount } },
          { new: true }
        );
      } else if (transitionInfo.balanceType === "Sales Balance") {
        const updateUsr = await user_collection.findOneAndUpdate(
          { _id: transitionInfo.userID },
          { $inc: { taskBalance: transitionInfo.netAmount } },
          { new: true }
        );
      }
    } else if (transitionInfo && transitionInfo.status === "Reject") {
      if (status === "Approve") {
        if (transitionInfo.balanceType === "Main Balance") {
          const updateUsr = await user_collection.findOneAndUpdate(
            { _id: transitionInfo.userID },
            { $inc: { balance: -transitionInfo.netAmount } },
            { new: true }
          );
        } else if (transitionInfo.balanceType === "Sales Balance") {
          const updateUsr = await user_collection.findOneAndUpdate(
            { _id: transitionInfo.userID },
            { $inc: { salesBalance: -transitionInfo.netAmount } },
            { new: true }
          );
        } else if (transitionInfo.balanceType === "Sales Balance") {
          const updateUsr = await user_collection.findOneAndUpdate(
            { _id: transitionInfo.userID },
            { $inc: { taskBalance: -transitionInfo.netAmount } },
            { new: true }
          );
        }
      }
    }
    let data = null;
    if (status === "Delete") {
      data = await TransactionHistory.findOneAndDelete({
        ...query,
      });
    } else {
      data = await TransactionHistory.findOneAndUpdate(
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
    const { withdrawCost, paymentMethods, balances, maximumWithdrawAmount, withdrawAmounts } =
      req.body;
    const isConfigExist = await Configs.findOne({});
    if (!isConfigExist) {
      await Configs.create({});
    }

    const updateInfo = {};
    if (withdrawCost) {
      updateInfo["withdraw.withdrawCost"] = withdrawCost;
    }
    if (withdrawAmounts) {
      updateInfo["withdraw.withdrawAmounts"] = withdrawAmounts;
    }
    if (maximumWithdrawAmount) {
      updateInfo["withdraw.maximumWithdrawAmount"] = maximumWithdrawAmount;
    }
    if (paymentMethods.hasOwnProperty("bikash")) {
      updateInfo["withdraw.paymentMethods.bikash"] = paymentMethods.bikash;
    }
    if (paymentMethods.hasOwnProperty("nagad")) {
      updateInfo["withdraw.paymentMethods.nagad"] = paymentMethods.nagad;
    }
    if (paymentMethods.hasOwnProperty("rocket")) {
      updateInfo["withdraw.paymentMethods.rocket"] = paymentMethods.rocket;
    }
    if (paymentMethods.hasOwnProperty("upay")) {
      updateInfo["withdraw.paymentMethods.upay"] = paymentMethods.upay;
    }
    if (balances.hasOwnProperty("mainBalance")) {
      updateInfo["withdraw.balances.mainBalance"] = balances.mainBalance;
    }
    if (balances.hasOwnProperty("salesBalance")) {
      updateInfo["withdraw.balances.salesBalance"] = balances.salesBalance;
    }
    if (balances.hasOwnProperty("taskBalance")) {
      updateInfo["withdraw.balances.taskBalance"] = balances.taskBalance;
    }

    const updateConfig = await Configs.findOneAndUpdate(
      {},
      {
        ...updateInfo,
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
});

module.exports = router;
