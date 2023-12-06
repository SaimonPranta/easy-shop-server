const express = require("express");
const { addProduct, product, deleteProduct, updateProduct, getProduct } = require("../../collections/product/product_controller");

const router = express.Router();


router.get("/", product);
router.post("/add_product", addProduct);
router.get("/get_product/:id", getProduct);
router.patch("/update_product", updateProduct);
router.delete("/delete_product/:id", deleteProduct);

module.exports = router