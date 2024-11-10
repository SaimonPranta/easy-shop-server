const router = require("express").Router();
const Tutorial = require("../../db/schemas/tutorial");

router.get("/", async (req, res) => {
  try {
    const data = await Tutorial.find({}).sort({createdAt: -1})
    res.json({
      message: "Your tutorial is completed successfully",
      data: data,
      success: true,
    });
  } catch (error) {
    console.log("error ==>>", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
});


module.exports = router;
