const TransactionHistory = require("../../db/schemas/transactionHistory");
const user_collection = require("../../db/schemas/user_schema");
const UserPointHistory = require("../../db/schemas/userPointHistory");

const userCount = async (req, res) => {
  try {
    const count = {
      total: 0,
      activeUser: 0,
      unactiveUser: 0,
      totalUserBalance: 0,
      taskBalance: 0,
      salesBalance: 0,
      pointBalance: 0,
      mainBalanceIncome: 0,
      taskBalanceIncome: 0,
      pointIncome: 0,
    };
    count.total = await user_collection.find({}).count();
    count.activeUser = await user_collection.find({ isActive: true }).count();
    count.unactiveUser = await user_collection
      .find({ isActive: false })
      .count();
    count.blueTickUser = await user_collection
      .find({ "blueTickInfo.blurTick": true })
      .count();
    const totalUserBalance = await user_collection.aggregate([
      {
        $match: {
          isActive: true,
        },
      },
      {
        $group: {
          _id: null,
          totalBalalnce: { $sum: "$balance" },
        },
      },
    ]);

    const taskBalance = await user_collection.aggregate([
      {
        $group: {
          _id: null,
          totalBalalnce: { $sum: "$taskBalance" },
        },
      },
    ]);
    const salesBalance = await user_collection.aggregate([
      {
        $group: {
          _id: null,
          totalBalalnce: { $sum: "$salesBalance" },
        },
      },
    ]);
    const pointBalance = await user_collection.aggregate([
      {
        $group: {
          _id: null,
          totalBalalnce: { $sum: "$pointAmount" },
        },
      },
    ]);
    const mainBalanceIncome = await TransactionHistory.aggregate([
      {
        $match: {
          transactionType: "Generation Income",
          balanceType: "Main Balance",
        },
      },
      {
        $group: {
          _id: null,
          totalBalance: { $sum: "$amount" },
        },
      },
    ]);
    const taskBalanceIncome = await TransactionHistory.aggregate([
      {
        $match: {
          transactionType: "Daily Task Income",
          balanceType: "Task Balance",
        },
      },
      {
        $group: {
          _id: null,
          totalBalance: { $sum: "$amount" },
        },
      },
    ]);
    const pointIncome = await UserPointHistory.aggregate([ 
      {
        $group: {
          _id: null,
          totalBalance: { $sum: "$pointAmount" },
        },
      },
    ]);
    if (totalUserBalance[0] && totalUserBalance[0].totalBalalnce) {
      count.totalUserBalance = totalUserBalance[0].totalBalalnce;
    }
    if (taskBalance[0] && taskBalance[0].totalBalalnce) {
      count.taskBalance = taskBalance[0].totalBalalnce;

    }
    if (salesBalance[0] && salesBalance[0].totalBalalnce) {
      count.salesBalance = salesBalance[0].totalBalalnce;
    }
    if (pointBalance[0] && pointBalance[0].totalBalalnce) {
      count.pointBalance = pointBalance[0].totalBalalnce;

    }


    if (mainBalanceIncome[0] && mainBalanceIncome[0].totalBalance) {
      count.mainBalanceIncome = mainBalanceIncome[0].totalBalance;
    }
    if (taskBalanceIncome[0] && taskBalanceIncome[0].totalBalalnce) {
         count.taskBalanceIncome = taskBalanceIncome[0].totalBalance;
    }
    if (pointIncome[0] && pointIncome[0].totalBalalnce) {
         count.pointIncome = pointIncome[0].totalBalance;
    }
    

    

    res.json({
      count,
      message: "Successfully load information",
      success: true,
    });
  } catch (error) {
    console.log("error -->>", error);
    res.json({
      message: "Internal server error",
      success: false,
    });
  }
};

module.exports = userCount;
