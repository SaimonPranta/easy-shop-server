const router = require("express").Router();
const user_collection = require("../../db/schemas/user_schema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const date_provider = require("../../functions/date_provider");
const TransactionHistory = require("../../db/schemas/transactionHistory");
const Configs = require("../../db/schemas/Configs");
const Generations = require("../../db/schemas/generations");
const { default: mongoose } = require("mongoose");
const generateRandom8DigitNumber = require("../../functions/generateRandom8DigitNumber");
const Salary = require("../../db/schemas/salary");

router.get("/init-balance", async (req, res) => {
  try {
    const balance = {
      todayApprovePaymentRequest: 0,
      todayPendingPaymentRequest: 0,
      totalTotalPaymentRequest: 0,
      totalApprovePaymentRequest: 0,
      totalPendingPaymentRequest: 0,
      totalPaymentRequest: 0,
      todayApprovePaymentBalance: 0,
      todayPendingPaymentBalance: 0,
      totalTotalPaymentBalance: 0,
      totalApprovePaymentBalance: 0,
      totalPendingPaymentBalance: 0,
      totalPaymentBalance: 0,
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

    balance.todayApprovePaymentRequest =
      await TransactionHistory.countDocuments({
        ...query,
        ...todayQuery,
        status: "Approve",
      });
    balance.todayPendingPaymentRequest =
      await TransactionHistory.countDocuments({
        ...query,
        ...todayQuery,
        status: "Pending",
      });
    balance.totalTotalPaymentRequest = await TransactionHistory.countDocuments({
      ...query,
      ...todayQuery,
    });
    balance.totalApprovePaymentRequest =
      await TransactionHistory.countDocuments({
        ...query,
        status: "Approve",
      });
    balance.totalPendingPaymentRequest =
      await TransactionHistory.countDocuments({
        ...query,
        status: "Pending",
      });
    balance.totalPaymentRequest = await TransactionHistory.countDocuments({
      ...query,
    });

    let todayApprovePaymentBalance = await TransactionHistory.aggregate([
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
    if (todayApprovePaymentBalance.length) {
      balance.todayApprovePaymentBalance = todayApprovePaymentBalance[0].total;
    }
    let todayPendingPaymentBalance = await TransactionHistory.aggregate([
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
    if (todayPendingPaymentBalance.length) {
      balance.todayPendingPaymentBalance = todayPendingPaymentBalance[0].total;
    }
    let totalTotalPaymentBalance = await TransactionHistory.aggregate([
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
    if (totalTotalPaymentBalance.length) {
      balance.totalTotalPaymentBalance = totalTotalPaymentBalance[0].total;
    }
    let totalApprovePaymentBalance = await TransactionHistory.aggregate([
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
    if (totalApprovePaymentBalance.length) {
      balance.totalApprovePaymentBalance = totalApprovePaymentBalance[0].total;
    }
    let totalPendingPaymentBalance = await TransactionHistory.aggregate([
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
    if (totalPendingPaymentBalance.length) {
      balance.totalPendingPaymentBalance = totalPendingPaymentBalance[0].total;
    }
    let totalPaymentBalance = await TransactionHistory.aggregate([
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
    if (totalPaymentBalance.length) {
      balance.totalPaymentBalance = totalPaymentBalance[0].total;
    }
    console.log("---->", {
      startOfDay,
      endOfDay,
    });
    console.log("balance.todayTotalPaymentRequest ==>", balance);

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
      transactionType: "Payments",
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
    // const totalBalance = await TransactionHistory.aggregate([
    //     {
    //         $match: query
    //     },
    //     {
    //         $group: {
    //             _id: null,
    //             amount: {
    //                 $sum: "$amount"
    //             }
    //         }
    //     }
    // ])

    const skip = Number(page - 1) * limit;

    // if (skip >= totalItems) {
    //     return res.json({
    //         message: "All item are already loaded",
    //     })
    // }

    // const data = await TransactionHistory.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }).populate({
    //     path: 'userID',
    //     select: 'firstName lastName phoneNumber'
    // });
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
          payments: 1,
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
      transactionType: "Payments",
    };
    const configInfo = await Configs.findOne({});
    let updateInfo = {};

    const transitionInfo = await TransactionHistory.findOne({
      ...query,
    });
    const userInfo = await user_collection.findOne({
      _id: transitionInfo.userID,
    });
    if (userInfo.isActive) {
      return res.json({
        message: "User account is already activate",
      });
    }

    if (status === "Approve") {
      let totalAmount = await TransactionHistory.aggregate([
        {
          $match: {
            userID: transitionInfo.userID,
            transactionType: "Payments",
            status: "Approve",
          },
        },
        {
          $group: {
            _id: null,
            totalAmount: { $sum: "$amount" },
          },
        },
      ]);

      totalAmount = totalAmount.length > 0 ? totalAmount[0].totalAmount : 0;

      if (Number(transitionInfo.amount + totalAmount) >= 150) {
        const activeHostUser = await user_collection.findOneAndUpdate(
          { _id: transitionInfo.userID },
          {
            isActive: true,
          },
          { new: true }
        );
        let currentReferUser = {};

        for (let index = 0; index < 10; index++) {
          const currentIndex = index + 1;
          const incomeAmount = 40;
          // referUser
          if (currentIndex === 1) {
            const currentUserInfo = await user_collection.findOneAndUpdate(
              {
                $or: [
                  {
                    _id: activeHostUser.referUser,
                  },
                  {
                    phoneNumber: activeHostUser.referNumber,
                  },
                ],
              },
              { $inc: { balance: incomeAmount, totalIncome: incomeAmount } }
            );
            if (!currentUserInfo) {
              break;
            }
            currentReferUser = currentUserInfo._doc;
            await TransactionHistory.create({
              userID: currentReferUser._id,
              transactionType: "Generation Income",
              balanceType: "Main Balance",
              amount: incomeAmount,
              netAmount: incomeAmount,
              status: "Approve",
            });
            await Generations.create({
              referByUser: currentReferUser._id,
              generationNumber: currentIndex,
              referredUser: activeHostUser._id,
              incomes: incomeAmount,
            });
          } else if (currentIndex === 2) {
            const incomeAmount = 10;

            const currentUserInfo = await user_collection.findOneAndUpdate(
              {
                $or: [
                  {
                    _id: currentReferUser.referUser,
                  },
                  {
                    phoneNumber: currentReferUser.referNumber,
                  },
                ],
              },
              {
                $inc: { balance: incomeAmount, totalIncome: incomeAmount },
              },
              {
                new: true,
              }
            );
            if (!currentUserInfo) {
              break;
            }

            currentReferUser = currentUserInfo._doc;

            await TransactionHistory.create({
              userID: currentReferUser._id,
              transactionType: "Generation Income",
              balanceType: "Main Balance",
              amount: incomeAmount,
              netAmount: incomeAmount,
              status: "Approve",
            });
            await Generations.create({
              referByUser: currentReferUser._id,
              generationNumber: currentIndex,
              referredUser: activeHostUser._id,
              incomes: incomeAmount,
            });
          } else if (currentIndex === 3) {
            const incomeAmount = 5;

            const currentUserInfo = await user_collection.findOneAndUpdate(
              {
                $or: [
                  {
                    _id: currentReferUser.referUser,
                  },
                  {
                    phoneNumber: currentReferUser.referNumber,
                  },
                ],
              },
              {
                $inc: { balance: incomeAmount, totalIncome: incomeAmount },
              },
              {
                new: true,
              }
            );
            if (!currentUserInfo) {
              break;
            }
            currentReferUser = currentUserInfo._doc;

            await TransactionHistory.create({
              userID: currentReferUser._id,
              transactionType: "Generation Income",
              balanceType: "Main Balance",
              amount: incomeAmount,
              netAmount: incomeAmount,
              status: "Approve",
            });
            await Generations.create({
              referByUser: currentReferUser._id,
              generationNumber: currentIndex,
              referredUser: activeHostUser._id,
              incomes: incomeAmount,
            });
          } else if (currentIndex === 4) {
            const incomeAmount = 3;
            const currentUserInfo = await user_collection.findOneAndUpdate(
              {
                $or: [
                  {
                    _id: currentReferUser.referUser,
                  },
                  {
                    phoneNumber: currentReferUser.referNumber,
                  },
                ],
              },
              {
                $inc: { balance: incomeAmount, totalIncome: incomeAmount },
              },
              {
                new: true,
              }
            );
            if (!currentUserInfo) {
              break;
            }
            currentReferUser = currentUserInfo._doc;

            await TransactionHistory.create({
              userID: currentReferUser._id,
              transactionType: "Generation Income",
              balanceType: "Main Balance",
              amount: incomeAmount,
              netAmount: incomeAmount,
              status: "Approve",
            });
            await Generations.create({
              referByUser: currentReferUser._id,
              generationNumber: currentIndex,
              referredUser: activeHostUser._id,
              incomes: incomeAmount,
            });
          } else if (currentIndex === 5) {
            const incomeAmount = 2;
            const currentUserInfo = await user_collection.findOneAndUpdate(
              {
                $or: [
                  {
                    _id: currentReferUser.referUser,
                  },
                  {
                    phoneNumber: currentReferUser.referNumber,
                  },
                ],
              },
              {
                $inc: { balance: incomeAmount, totalIncome: incomeAmount },
              },
              {
                new: true,
              }
            );
            if (!currentUserInfo) {
              break;
            }
            currentReferUser = currentUserInfo._doc;

            await TransactionHistory.create({
              userID: currentReferUser._id,
              transactionType: "Generation Income",
              balanceType: "Main Balance",
              amount: incomeAmount,
              netAmount: incomeAmount,
              status: "Approve",
            });
            await Generations.create({
              referByUser: currentReferUser._id,
              generationNumber: currentIndex,
              referredUser: activeHostUser._id,
              incomes: incomeAmount,
            });
          } else if (currentIndex === 6) {
            const incomeAmount = 2;
            const currentUserInfo = await user_collection.findOneAndUpdate(
              {
                $or: [
                  {
                    _id: currentReferUser.referUser,
                  },
                  {
                    phoneNumber: currentReferUser.referNumber,
                  },
                ],
              },
              {
                $inc: { balance: incomeAmount, totalIncome: incomeAmount },
              },
              {
                new: true,
              }
            );
            if (!currentUserInfo) {
              break;
            }
            currentReferUser = currentUserInfo._doc;

            await TransactionHistory.create({
              userID: currentReferUser._id,
              transactionType: "Generation Income",
              balanceType: "Main Balance",
              amount: incomeAmount,
              netAmount: incomeAmount,
              status: "Approve",
            });
            await Generations.create({
              referByUser: currentReferUser._id,
              generationNumber: currentIndex,
              referredUser: activeHostUser._id,
              incomes: incomeAmount,
            });
          } else if (currentIndex === 7) {
            const incomeAmount = 1;
            const currentUserInfo = await user_collection.findOneAndUpdate(
              {
                $or: [
                  {
                    _id: currentReferUser.referUser,
                  },
                  {
                    phoneNumber: currentReferUser.referNumber,
                  },
                ],
              },
              {
                $inc: { balance: incomeAmount, totalIncome: incomeAmount },
              },
              {
                new: true,
              }
            );
            if (!currentUserInfo) {
              break;
            }
            currentReferUser = currentUserInfo._doc;

            await TransactionHistory.create({
              userID: currentReferUser._id,
              transactionType: "Generation Income",
              balanceType: "Main Balance",
              amount: incomeAmount,
              netAmount: incomeAmount,
              status: "Approve",
            });
            await Generations.create({
              referByUser: currentReferUser._id,
              generationNumber: currentIndex,
              referredUser: activeHostUser._id,
              incomes: incomeAmount,
            });
          } else if (currentIndex === 8) {
            const incomeAmount = 1;
            const currentUserInfo = await user_collection.findOneAndUpdate(
              {
                $or: [
                  {
                    _id: currentReferUser.referUser,
                  },
                  {
                    phoneNumber: currentReferUser.referNumber,
                  },
                ],
              },
              {
                $inc: { balance: incomeAmount, totalIncome: incomeAmount },
              },
              {
                new: true,
              }
            );
            if (!currentUserInfo) {
              break;
            }
            currentReferUser = currentUserInfo._doc;

            await TransactionHistory.create({
              userID: currentReferUser._id,
              transactionType: "Generation Income",
              balanceType: "Main Balance",
              amount: incomeAmount,
              netAmount: incomeAmount,
              status: "Approve",
            });
            await Generations.create({
              referByUser: currentReferUser._id,
              generationNumber: currentIndex,
              referredUser: activeHostUser._id,
              incomes: incomeAmount,
            });
          } else if (currentIndex === 9) {
            const incomeAmount = 1;
            const currentUserInfo = await user_collection.findOneAndUpdate(
              {
                $or: [
                  {
                    _id: currentReferUser.referUser,
                  },
                  {
                    phoneNumber: currentReferUser.referNumber,
                  },
                ],
              },
              {
                $inc: { balance: incomeAmount, totalIncome: incomeAmount },
              },
              {
                new: true,
              }
            );
            if (!currentUserInfo) {
              break;
            }
            currentReferUser = currentUserInfo._doc;

            await TransactionHistory.create({
              userID: currentReferUser._id,
              transactionType: "Generation Income",
              balanceType: "Main Balance",
              amount: incomeAmount,
              netAmount: incomeAmount,
              status: "Approve",
            });
            await Generations.create({
              referByUser: currentReferUser._id,
              generationNumber: currentIndex,
              referredUser: activeHostUser._id,
              incomes: incomeAmount,
            });
          } else if (currentIndex === 10) {
            const incomeAmount = 1;
            const currentUserInfo = await user_collection.findOneAndUpdate(
              {
                $or: [
                  {
                    _id: currentReferUser.referUser,
                  },
                  {
                    phoneNumber: currentReferUser.referNumber,
                  },
                ],
              },
              {
                $inc: { balance: incomeAmount, totalIncome: incomeAmount },
              },
              {
                new: true,
              }
            );
            if (!currentUserInfo) {
              break;
            }
            currentReferUser = currentUserInfo._doc;

            await TransactionHistory.create({
              userID: currentReferUser._id,
              transactionType: "Generation Income",
              balanceType: "Main Balance",
              amount: incomeAmount,
              netAmount: incomeAmount,
              status: "Approve",
            });
            await Generations.create({
              referByUser: currentReferUser._id,
              generationNumber: currentIndex,
              referredUser: activeHostUser._id,
              incomes: incomeAmount,
            });
          }
        }

        const salaryCountDay =
          configInfo.salary.salaryPaymentCondition.salaryCountDay;
        const salaryCountReferNumber =
          configInfo.salary.salaryPaymentCondition.salaryCountReferNumber;
        const salaryPaymentAmount =
          configInfo.salary.salaryPaymentCondition.salaryPaymentAmount;
        const startDate = new Date();
        const startOfDay = new Date(startDate.setHours(0, 0, 0, 0));
        let endOfDay = new Date(startDate.setHours(23, 59, 59, 999));
        endOfDay.setDate(endOfDay.getDate() - salaryCountDay);
        endOfDay = new Date(endOfDay);
        console.log("endOfDay ==>", endOfDay);
        const referCount = await Generations.countDocuments({
          referByUser: activeHostUser.referUser,
          generationNumber: 1,
          $and: [
            {
              createdAt: { $gte: startOfDay },
            },
            {
              createdAt: { $lte: endOfDay },
            },
          ],
        });
        if (referCount >= salaryCountReferNumber) {
          // salaryPaymentAmount
          const updateInfo = {
            userID: activeHostUser.referUser,
            amount: Number(salaryPaymentAmount),
            id: generateRandom8DigitNumber(),
            createdAt: new Date(),
          };
          const salary = await Salary.create(updateInfo);
      
          if (salary) {
            await user_collection.findOneAndUpdate(
              { _id: activeHostUser.referUser },
              { $inc: { balance: Number(salaryPaymentAmount) } }
            );
          }
        }

        // await Promise.all(
        // await new Array(10).fill("").map(async (item, index) => {
        //   try {

        //   } catch (error) {
        //   }
        // });
        // );
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
    const body = req.body;
    const { paymentNotice, paymentFormNotice, paymentsNumbers } = body;
    const isConfigExist = await Configs.findOne({});
    if (!isConfigExist) {
      await Configs.create({});
    }

    const updateInfo = {};

    if (body.hasOwnProperty("paymentNotice")) {
      updateInfo["payment.paymentNotice"] = paymentNotice;
    }
    if (body.hasOwnProperty("paymentFormNotice")) {
      updateInfo["payment.paymentFormNotice"] = paymentFormNotice;
    }
    if (paymentsNumbers.hasOwnProperty("bkashNumber")) {
      updateInfo["payment.paymentsNumbers.bkashNumber"] =
        paymentsNumbers.bkashNumber;
    }
    if (paymentsNumbers.hasOwnProperty("nagadNumber")) {
      updateInfo["payment.paymentsNumbers.nagadNumber"] =
        paymentsNumbers.nagadNumber;
    }
    if (paymentsNumbers.hasOwnProperty("rocketNumber")) {
      updateInfo["payment.paymentsNumbers.rocketNumber"] =
        paymentsNumbers.rocketNumber;
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
