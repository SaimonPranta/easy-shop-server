const router = require("express").Router();
const user_collection = require("../../db/schemas/user_schema");
const path = require("path");
const fs = require("fs");
const proveHistory = require("../../db/schemas/prove");
const { proveDirectory } = require("../../constants/storageDirectory");
const { default: mongoose } = require("mongoose");
const Configs = require("../../db/schemas/Configs");

router.get("/get-post-details", async (req, res) => {
  try {
    const userID = req.id;
    const { postID } = req.query;
    const data = await proveHistory.findOne({ _id: postID });
    res.json({
      data: data,
    });
  } catch (error) {
    res.json({
      message: "Internal server error",
    });
  }
});
router.post("/get-list", async (req, res) => {
  try {
    const userID = req.id;
    const { balance, fromDate, toDate, search } = req.body;
    const query = {
      userID: mongoose.Types.ObjectId(userID),
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
        {
          "withdraw.phoneNumber": new RegExp(search, "i"),
        },
        {
          status: new RegExp(search, "i"),
        },
        {
          provider: new RegExp(search, "i"),
        },
      ];
    }
    let totalItems = await proveHistory.aggregate([
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

    const skip = Number(page - 1) * limit;

    if (skip >= totalItems) {
      return res.json({
        message: "All item are already loaded",
      });
    }
    const data = await proveHistory
      .find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

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
});
router.post("/add-prove", async (req, res) => {
  try {
    const files = req.files;
    const id = req.id;
    const keys = Object.keys(files);
    const imageNameList = [];
    const config = await Configs.findOne({}).select("provePost");
    const images = await Promise.all(
      keys.map(async (key) => {
        const img = files[key];
        const extension = path.extname(img.name);
        let name = img.name.replace(extension, Date.now());
        img.name = `${name}${extension}`;
        imageNameList.push(img.name);
        return img;
      })
    );
    const body = JSON.parse(req.body.data);
    const { description } = body;

    if (!description || !images.length) {
      return res.json({
        message: "Please fill all required field",
      });
    }
    const info = {
      userID: id,
      description,
      images: imageNameList,
    };
    if (config && config.provePost && config.provePost.postAutoApprove) {
      info["disable"] = config.provePost.postAutoApprove ? false : true
    }else{
      info["disable"] = true
    }
    const data = await proveHistory.create(info);
    if (data) {
      await images.map(async (img) => {
        const imagePath = await path.join(proveDirectory(), img.name);
        await img.mv(imagePath);
      });
    }

    res.json({
      success: "Prove post submitted successfully",
      data,
    });
  } catch (error) {
    res.json({
      message: "Internal server error",
    });
  }
});
router.post("/edit-prove", async (req, res) => {
  try {
    const files = req.files;
    const id = req.id;
    const keys = Object.keys(files || {});
    let imageNameList = [];

    const images = await Promise.all(
      keys.map(async (key) => {
        const img = files[key];
        const extension = path.extname(img.name);
        let name = img.name.replace(extension, Date.now());
        img.name = `${name}${extension}`;
        imageNameList.push(img.name);
        return img;
      })
    );
    const body = JSON.parse(req.body.data);
    const { description, _id, removeImages } = body;

    const postInfo = await proveHistory.findOne({ _id: _id });

    await postInfo.images.forEach((img) => {
      if (!removeImages.includes(img)) {
        imageNameList.push(img);
      }
    });
    const info = {
      images: imageNameList,
    };
    if (description) {
      info["description"] = description;
    }
    const data = await proveHistory.findOneAndUpdate(
      { _id: _id },
      {
        ...info,
      }
    );
    if (data) {
      await images.map(async (img) => {
        const imagePath = await path.join(proveDirectory(), img.name);
        await img.mv(imagePath);
      });
      if (removeImages.length) {
        await removeImages.forEach(async (img) => {
          const imagePath = await path.join(proveDirectory(), img);
          if (fs.existsSync(imagePath)) {
            await fs.unlinkSync(imagePath);
          }
        });
      }
    }

    res.json({
      success: "Prove post submitted successfully",
      data,
    });
  } catch (error) {
    res.json({
      message: "Internal server error",
    });
  }
});
router.delete("/delete", async (req, res) => {
  try {
    const id = req.id;
    const { postID } = req.query;

    const postInfo = await proveHistory.findOneAndDelete({
      _id: postID,
      userID: id,
    });

    if (postInfo && postInfo.images && postInfo.images.length) {
      await postInfo.images.forEach(async (img) => {
        const imagePath = await path.join(proveDirectory(), img);
        if (fs.existsSync(imagePath)) {
          await fs.unlinkSync(imagePath);
        }
      });
    }

    res.json({
      data: postInfo,
    });
  } catch (error) {
    res.json({
      message: "Internal server error",
    });
  }
});

module.exports = router;
