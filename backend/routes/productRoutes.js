// Product routes placeholder
const express = require("express");
const multer = require("multer");
const router = express.Router();

const {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  bulkUploadProducts
} = require("../controllers/productController");

const { protect } = require("../middleware/authMiddleware");
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", protect, createProduct);
router.post("/bulk-upload", protect, upload.single("file"), bulkUploadProducts);
router.get("/:businessId", getProducts);
router.put("/:id", protect, updateProduct);
router.delete("/:id", protect, deleteProduct);

module.exports = router;