const slider_collection = require("../../db/schemas/slider_schema");
const path = require("path");
const fs = require("fs-extra");
const { sliderDirectory } = require("../../constants/storageDirectory");
const ECommerceSlider = require("../../db/schemas/eCommerce_slider_schema");

const slider_img_delete = async (req, res) => {
  try {
    const { id, tab } = await req.query;
    let imageContaienr = null;

    if (tab === "Work Slider") {
      imageContaienr = await slider_collection.findOneAndDelete({ _id: id });
    } else if (tab === "E-Commerce Slider") {
      imageContaienr = await ECommerceSlider.findOneAndDelete({ _id: id });
    }

    if (imageContaienr.img) {
      const iamgePath = await `${sliderDirectory()}/${imageContaienr.img}`;

      fs.remove(iamgePath, (error) => {
        if (error) {
          res
            .status(500)
            .json({ failed: "Failed to delete slider, please try again." });
        } else {
          res.status(200).json({ success: "Slider has been deleted successfully" });
        }
      });
    } else {
      res
        .status(500)
        .json({ failed: "Failed to delete image, please try again." });
    }
  } catch (error) {
    console.log("error ==>>", error);
    res
      .status(500)
      .json({ failed: "Failed to delete image, please try again." });
  }
};

module.exports = slider_img_delete;
