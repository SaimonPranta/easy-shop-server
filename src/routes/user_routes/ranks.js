const router = require("express").Router();
const user_collection = require("../../db/schemas/user_schema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Ranks = require("../../db/schemas/ranks");

router.get("/", async (req, res) => {
  try {
    const data = await Ranks.find({}).sort({createdAt: -1})
    res.json({ 
      data: data,
    });
  } catch (error) {
    console.log("error ==>", error);
    res.json({
      message: "Internal server error",
    });
  }
});
 

module.exports = router;
