const router = require("express").Router();
const SocialMedia = require("../../db/schemas/socialMedia");
const fs = require("fs");
const path = require("path");
const { socialDirectory } = require("../../constants/storageDirectory");

router.post("/set-config", async (req, res) => {
  try {
    const { socialMediaTitle, socialMediaLink } = JSON.parse(req.body.data);
    const files = req.files;
    const image = files.img;
    if (!image || !socialMediaTitle || !socialMediaLink) {
      return res.json({
        message: "Please, fill the required field",
      });
    }
    let name = image.name;
    const ext = path.extname(name);
    image.name = `${name.replace(ext, "")}_${Date.now()}${ext}`;

    const data = await SocialMedia.create({
      socialMediaTitle,
      socialMediaLink,
      socialMediaLogo: image.name,
    });
    if (data) {
      if (fs.existsSync(socialDirectory())) {
        await image.mv(path.join(socialDirectory(), image.name));
      }
    }
    res.json({
      data: data,
    });
  } catch (error) {
    console.log("error ===>>", error);
    res.json({
      message: "Internal server error",
    });
  }
});
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

router.delete("/delete", async (req, res) => {
  try {
    const { id } = req.query;
    console.log("req.query ==>>", req.query)
    console.log("id ==>>", id)
    const data = await SocialMedia.findOneAndDelete({ _id: id });
    console.log("data ==>>", data)
    if (data) {
      const filePath = path.join(socialDirectory(), data.socialMediaLogo);
      if (fs.existsSync(filePath)) {
        await fs.unlinkSync(filePath);
      }
    }
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
