const router = require("express").Router();
const SocialMedia = require("../../db/schemas/socialMedia");
 
 
router.post("/get-list", async (req, res) => {
  try {
    const data = await SocialMedia.find({});
    res.json({
      data: data,
    });
  } catch (error) {
    res.json({
      message: "Internal server error",
    });
  }
});

 

module.exports = router;
