const fs = require("fs-extra");
const slider_collection = require("../../db/schemas/slider_schema");
const ECommerceSlider = require("../../db/schemas/eCommerce_slider_schema");
const { sliderDirectory } = require("../../constants/storageDirectory");

const add_slider_img = async (req, res) => {
  try {
    const { tab } = req.body
    const image = await req.files.image;
    if (
      image.mimetype !== "image/jpg" &&
      image.mimetype !== "image/png" &&
      image.mimetype !== "image/jpeg"
    ) {
      res
        .status(500)
        .send({ failed: "Only .jpg .png or .jpeg format allowed!" });
    } else if (image.size >= "1500012") {
      res.status(500).send({ failed: "File are too large!" });
    } else {
      const extention = await image.mimetype.split("/")[1];
      image.name =
        (await image.name.split(".")[0]) +
        Math.floor(Math.random() * 10) +
        Date.now() +
        "." +
        extention;

      await image.mv(`${sliderDirectory()}/${image.name}`);

      const imgInfo = await {
        img: image.name,
      };
      let imgOutPut = null;
      if (tab === "Work Slider") {
        imgOutPut = await slider_collection(imgInfo);
      } else if (tab === "E-Commerce Slider") {
        imgOutPut = await ECommerceSlider(imgInfo);
      }
      const createdUser = await imgOutPut.save();
      if (createdUser._id) {
        let allIamge = []
        if (tab === "Work Slider") {
            allIamge = await slider_collection.find({});
          } else if (tab === "E-Commerce Slider") {
            allIamge = await ECommerceSlider.find({}); 
          }
        
        res.status(200).json({ sucess: "Iamge upload sucessfull" });
      } else {
        res
          .status(200)
          .json({ failed: "Failed to upload image, please try again" });
      }
    }
  } catch (error) {
    res
      .status(200)
      .json({ failed: "Failed to upload image, please try again" });
  }
};

module.exports = add_slider_img;
