const express = require("express");
const { verifyToken } = require("../middlewares/verifyToken");
const {getProducts, createProduct, updateProduct, deleteProduct, purchaseProduct, getCategories, createCategory, updateCategory, deleteCategory} = require("../controllers/storeController");

const router = express.Router();

router.get("/products", getProducts);
router.post("/products", createProduct);
router.put("/products/:name", updateProduct);
router.delete("/products/:name", deleteProduct);

router.post("/purchase", verifyToken, purchaseProduct);

router.get("/categories", getCategories);
router.post("/categories", createCategory);
router.put("/categories/:name", updateCategory);
router.delete("/categories/:name", deleteCategory);

module.exports = router;