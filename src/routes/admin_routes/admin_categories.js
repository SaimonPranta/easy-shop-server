const router = require("express").Router();
const { categoriesDirectory } = require("../../constants/storageDirectory");
const Categories = require("../../db/schemas/categories");
const imageValidation = require("../../functions/imageValidation");
const path = require("path");
const fs = require("fs");

router.post("/", async (req, res) => {
  try {
    const data = JSON.parse(req.body.data);
    console.log("hello")

    let updateCategories = null;

    if (data.categoriesID) {
      updateCategories = await Categories.findOneAndUpdate(
        { _id: data.categoriesID },
        {
          $push: { subCategories: { $each: [data] } },
        },
        { new: true }
      );
    } else {
      const images = Object.entries(req.files).map((item) => item[1]);

      const { validation, message } = await imageValidation(images);
      if (!validation) {
        return res.status(500).send({ failed: message });
      }

      const imgNameArray = [];
      const updatedImgArray = await images.map((img, index) => {
        const extension = img.mimetype.split("/")[1];
        const name =
          img.name.split(".")[0] +
          Math.floor(Math.random() * 10) +
          Date.now() +
          "." +
          extension;
        imgNameArray.push(name);
        return {
          ...img,
          name: name,
        };
      });

      const categories = await new Categories({
        ...data,
        img: imgNameArray.toString(),
      });
      updateCategories = await categories.save();
      if (!updateCategories) {
        return res.json({
          success: false,
          message: "Failed to update categories",
        });
      }
      await updatedImgArray.forEach(async (img) => {
        await img.mv(path.join(categoriesDirectory(), img.name));
      });
    }

    res.json({
      success: true,
      data: updateCategories,
      message: "Categories updated successfully",
    });
  } catch (error) {
    console.log("Error ===>>", error);
    res.json({
      success: false,
      message: "Internal server error",
    });
  }
});
router.delete("/", async (req, res) => {
  try {
    const { mainID } = req.body;
    const categoryInfo = await Categories.findOneAndDelete({ _id: mainID });
    const users = await Categories.find();
    if (categoryInfo.img) {
      const imgPath = path.join(categoriesDirectory(), categoryInfo.img);
      if (fs.existsSync(imgPath)) {
        await fs.unlinkSync(imgPath);
      }
      if (categoryInfo.subCategories && categoryInfo.subCategories.length) {
        await Promise.all(
          categoryInfo.subCategories.map(async (imgInfo) => {
            const currentImgPath = path.join(
              categoriesDirectory(),
              imgInfo.img
            );
            if (fs.existsSync(currentImgPath)) {
              await fs.unlinkSync(currentImgPath);
            }
          })
        );
      }
    }
    res.json({
      success: false,
      data: users,
    });
  } catch (error) {
    res.json({
      success: false,
      message: "Internal server error",
    });
  }
});
router.delete("/subcategories", async (req, res) => {
  try {
    const { mainID, subID } = req.body;

    const categoryInfo = await Categories.findOneAndUpdate(
      { _id: mainID },
      {
        $pull: {
          subCategories: { _id: subID },
        },
      }
    );
    if (categoryInfo.subCategories && categoryInfo.subCategories.length) {
      await Promise.all(
        categoryInfo.subCategories.map(async (imgInfo) => {
          if (imgInfo._id.toString() == subID) {
            const currentImgPath = path.join(
              categoriesDirectory(),
              imgInfo.img
            );
            if (fs.existsSync(currentImgPath)) {
              await fs.unlinkSync(currentImgPath);
            }
          }
        })
      );
    }
    const users = await Categories.find();
    res.json({
      success: false,
      data: users,
    });
  } catch (error) {
    console.log("Error ===>>", error);
    res.json({
      success: false,
      message: "Internal server error",
    });
  }
});

module.exports = router;
