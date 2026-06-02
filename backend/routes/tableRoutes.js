// Table routes placeholder
const express = require("express");
const router = express.Router();

const {
  generateTables,
  getTables,
  resetTable,
  deleteTable
} = require("../controllers/tableController");

const { protect } = require("../middleware/authMiddleware");

router.post("/generate", protect, generateTables);
router.get("/:businessId", protect, getTables);
router.put("/:id/reset", protect, resetTable);
router.delete("/:id", protect, deleteTable);

module.exports = router;