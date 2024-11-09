const router = require("express").Router();
const user_collection = require("../../db/schemas/user_schema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const date_provider = require("../../functions/date_provider");
const TransactionHistory = require("../../db/schemas/transactionHistory");
const { default: mongoose } = require("mongoose");
const Configs = require("../../db/schemas/Configs");
const Salary = require("../../db/schemas/salary");

router.post("/get-list", async (req, res) => {
  try {
    const userID = req.id;
    const {  fromDate, toDate } = req.body;
    const query = {
      userID: mongoose.Types.ObjectId(userID), 
    };
    const limit = req.query.limit || 25;
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
    
    let totalItems = await Salary.aggregate([
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

    let totalBalance = await Salary.aggregate([
      { $match: { ...query } },
      {
        $group: {
          _id: null,
          totalBalance: { $sum: "$amount" },
        },
      },
    ]);
    

    const skip = Number(page - 1) * limit;

    if (skip >= totalItems) {
      return res.json({
        message: "All item are already loaded",
      });
    }
    const data = await Salary.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

     
    if (totalBalance.length) {
      totalBalance = totalBalance[0].totalBalance || 0;
    } else {
      totalBalance = 0;
    }
    res.json({
      data: data,
      page: page,
      total: totalItems, 
      totalBalance,
    });
  } catch (error) {
    res.json({
      message: "Internal server error",
    });
  }
});
 
 

module.exports = router;
