const router = require("express").Router();
const user_collection = require("../../db/schemas/user_schema");
const path = require("path");
const fs = require("fs");
const proveHistory = require("../../db/schemas/prove");
const { proveDirectory } = require("../../constants/storageDirectory");
const { default: mongoose } = require("mongoose");

router.post("/get-list", async (req, res) => {
  try {
      const userID = req.id
      const { balance, fromDate, toDate, search } = req.body;
      const query = {
          userID: mongoose.Types.ObjectId(userID), 
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
                  'withdraw.phoneNumber': new RegExp(search, "i")
              },
              {
                  'status': new RegExp(search, "i")
              },
              {
                  'provider': new RegExp(search, "i")
              },
          ]
      } 
      let totalItems = await proveHistory.aggregate([
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

      const skip = Number(page - 1) * limit

      if (skip >= totalItems) {
          return res.json({
              message: "All item are already loaded",
          })
      } 
      const data = await proveHistory.find(query).skip(skip).limit(limit).sort({ createdAt: -1 })

     console.log("data ==>>", data)
      res.json({
          data: data,
          total: totalItems,
          page: Number(page), 
      })
  } catch (error) {
    console.log("error ===>>", error)
      res.json({
          message: "Internal server error"
      })
  }
})
router.post("/add-prove", async (req, res) => {
  try {
    const files = req.files;
    const id = req.id;
    const body = JSON.parse(req.body.data);
    const { description } = body;

    if (!description || !files || !files.img) {
      return res.json({
        message: "Please fill all required field",
      });
    }
    let img = files.img;
    const extension = path.extname(img.name);
    let name = img.name.replace(extension, Date.now());
    img.name = `${name}${extension}`;

    const info = {
      userID: id,
      description,
      images: [img.name],
    };
    const data = await proveHistory.create(info);
    if (data) {
      const imagePath = await path.join(proveDirectory(), img.name);
      await img.mv(imagePath);
    }

    res.json({
      success: "Prove post submitted successfully",
      data,
    });
  } catch (error) {
    console.log("error ==>>", error);
    res.json({
      message: "Internal server error",
    });
  }
});

module.exports = router;
