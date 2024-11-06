const mongoose = require("mongoose");

const categoriesSchema = new mongoose.Schema({
  img: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: true
  },
  value: {
    type: String,
    required: true
  },
  subCategories: [
    new mongoose.Schema({
      img: {
        type: String,
        required: false
      },
      label: {
        type: String,
        required: true
      },
      value: {
        type: String,
        required: true
      },
    })
  ],
});

const Categories = new mongoose.model(
  "category",
  categoriesSchema
);

module.exports = Categories;
