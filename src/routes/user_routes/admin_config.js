const router = require("express").Router();
const Configs = require("../../db/schemas/Configs");

router.post("/set-config", async (req, res) => {
  try {
    const body = req.body;
    const { registration, headline} = req.body;
    const isConfigExist = await Configs.findOne({});
    if (!isConfigExist) {
      await Configs.create({});
    }
    const updateInfo = {};
    if (registration.hasOwnProperty("videoTitle")) {
      updateInfo["tutorial.registration.videoTitle"] = registration.videoTitle;
    }
    if (registration.hasOwnProperty("videoID")) {
      updateInfo["tutorial.registration.videoID"] = registration.videoID;
    }
    if (headline.hasOwnProperty("title")) {
      updateInfo["headline.title"] = headline.title || "";
    }
console.log("updateInfo ==>>", updateInfo)
    const updateConfig = await Configs.findOneAndUpdate(
      {},
      {
        ...updateInfo,
      },
      { new: true }
    );
console.log("updateConfig ==>>", updateConfig)

    res.json({
      message: "Your Config is completed successfully",
      data: updateConfig,
      success: true,
    });
  } catch (error) {
    console.log("error ===>>", error)
    res.status(500).json({
      message: "Internal server error",
    });
  }
});

module.exports = router;
