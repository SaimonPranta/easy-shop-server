const router = require("express").Router();
const fs = require("fs");
const path = require("path");
const { transactionDirectory } = require("../../constants/storageDirectory");
const TransactionHistory = require("../../db/schemas/transactionHistory");
const user_collection = require("../../db/schemas/user_schema");
const mongoose = require("mongoose");

router.post("/", async (req, res) => {
  try {
    const files = req.files;
    const id = req.id;
    const body = JSON.parse(req.body.data);
    const { paymentMethod, paymentNumber, transitionNumber, amount } = body;
    console.log("body ==>>", body);
    console.log("files ==>>", files);

    if (
      !paymentMethod ||
      !paymentNumber ||
      !transitionNumber ||
      !amount ||
      !files ||
      !files.img
    ) {
      return res.json({
        message: "Please fill all required field",
      });
    }
    let img = files.img;
    const extension = path.extname(img.name);
    let name = img.name.replace(extension, Date.now());
    img.name = `${name}${extension}`;

    const withdrawAmount = Number(amount);
    const withdrawCost = 0;
    const netAmount = withdrawAmount + withdrawCost;

    // let checkUser = await user_collection.findOne({
    //   _id: id,
    //   isActive: true
    // }).select("_id")
    // if (checkUser) {
    //   return res.json({
    //     message: "User account is already active",
    //   });
    // }

    const info = {
      userID: id,
      transactionType: "Payments",
      balanceType: "Main Balance",
      status: "Pending",
      amount: withdrawAmount,
      charge: withdrawCost,
      netAmount: netAmount,
      payments: {
        paymentMethod,
        paymentNumber,
        transitionNumber,
        img: img.name,
      },
    };
    const data = await TransactionHistory.create(info); 
    if (data) {
      const imagePath = await path.join(transactionDirectory(), img.name);
     console.log("imagePath ==>>", imagePath)
      await img.mv(imagePath);
    }

    res.json({
      success: "Withdraw request submitted successfully",
      data,
    });
  } catch (error) {
    console.log("error ==>>", error);
    res.json({
      message: "Internal server error",
    });
  }
});

router.post("/get-list", async (req, res) => {
  try {
      const userID = req.id
      const { balance, fromDate, toDate, search } = req.body;
      const query = {
          userID: mongoose.Types.ObjectId(userID),
          transactionType: "Payments",
      }
      const { sort } = req.query;
      const limit = req.query.limit || 5
      const page = req.query.page || 1
      if (balance) {
          query["balanceType"] = balance
      }
      if (fromDate && toDate) {
          const startDate = new Date(fromDate)
          const endDate = new Date(toDate)
          const startOfDay = new Date(startDate.setHours(0, 0, 0, 0));
          const endOfDay = new Date(endDate.setHours(23, 59, 59, 999));
          query["$and"] = [
              {
                  createdAt: { $lte: endOfDay },
              },
              {
                  createdAt: { $gte: startOfDay },
              },
          ]
      }
      if (search) { 
          query["$or"] = [
              {
                  'mongoose.paymentMethod': new RegExp(search, "i")
              },
              {
                  'mongoose.paymentNumber': new RegExp(search, "i")
              },
              {
                  'mongoose.transitionNumber': new RegExp(search, "i")
              },
              {
                  'status': new RegExp(search, "i")
              },
              {
                  'provider': new RegExp(search, "i")
              },
          ]
      } 
      let totalItems = await TransactionHistory.aggregate([
          {
              $match: {
                  ...query
              }
          }, {
              $project: {
                  _id: 1
              }
          }
      ])
      totalItems = totalItems.length || 0

      let pendingBalance = await TransactionHistory.aggregate([
          { $match: { ...query, status: "Pending" } },
          {
              $group: {
                  _id: null,
                  totalBalance: { $sum: "$netAmount" },
              },
          },
      ]);
      let approveBalance = await TransactionHistory.aggregate([
          { $match: { ...query, status: "Approve" } },
          {
              $group: {
                  _id: null,
                  totalBalance: { $sum: "$netAmount" },
              },
          },
      ]);

      let totalBalance = await TransactionHistory.aggregate([
          {
              $match: { ...query }
          },
          {
              $group: {
                  _id: null,
                  totalBalance: {
                      $sum: "$netAmount"
                  }
              }
          }
      ])

      const skip = Number(page - 1) * limit

      if (skip >= totalItems) {
          return res.json({
              message: "All item are already loaded",
          })
      }

      console.log({
          page,
          skip,
          limit,
          totalItems
      })
      const data = await TransactionHistory.find(query).skip(skip).limit(limit).sort({ createdAt: -1 })

      if (pendingBalance.length) {
          pendingBalance = pendingBalance[0].totalBalance || 0
      } else {
          pendingBalance = 0
      }
      if (approveBalance.length) {
          approveBalance = approveBalance[0].totalBalance || 0
      } else {
          approveBalance = 0
      }
      if (totalBalance.length) {
          totalBalance = totalBalance[0].totalBalance || 0
      } else {
          totalBalance = 0
      }
      res.json({
          data: data,
          total: totalItems,
          page: Number(page),
          pendingBalance,
          approveBalance,
          totalBalance
      })
  } catch (error) {
      res.json({
          message: "Internal server error"
      })
  }
})

module.exports = router;
