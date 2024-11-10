const router = require("express").Router();
const Tutorial = require("../../db/schemas/tutorial");

router.post("/set-config", async (req, res) => {
  try { 
    const { title, videoID } = req.body;
    if (!videoID) {
      return res.status(500).json({
        message: "Internal server error",
      });
    }
    const updateInfo = {
      videoID,
    };

    if (title) {
      updateInfo["title"] = title;
    }

    const data = await Tutorial.create({
      ...updateInfo,
    });

    console.log("data ==>>", data);

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

router.delete("/delete", async (req, res) => {
  try {
    const { id } = req.query;
    const data = await Tutorial.findOneAndDelete({ _id: id });
    res.json({
      message: "Tutorial has been deleted successfully",
      data: data,
      success: true,
    });
  } catch (error) {
    console.log("error ===>>", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
});

module.exports = router;
