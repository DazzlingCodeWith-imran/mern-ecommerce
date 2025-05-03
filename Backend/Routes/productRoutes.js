const express = require("express");
const {
  addProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  searchProducts
} = require("../controllers/productController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const productRouter = express.Router();

// Public routes
productRouter.get("/", getAllProducts);
productRouter.get("/:id", getSingleProduct);
// Protected routes
productRouter.post("/", authMiddleware, adminMiddleware, addProduct);
productRouter.put("/:id", authMiddleware,adminMiddleware, updateProduct);
productRouter.delete("/:id", authMiddleware,adminMiddleware, deleteProduct);
productRouter.get("/search", searchProducts);

module.exports = productRouter;