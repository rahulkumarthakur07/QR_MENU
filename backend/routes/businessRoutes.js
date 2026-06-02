// Business routes placeholder
const express = require("express");
const router = express.Router();

const {
  createBusiness,
  getMyBusiness,
  updateBusiness
} = require("../controllers/businessController");

const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, createBusiness);
router.get("/my-business", protect, getMyBusiness);
router.put("/:id", protect, updateBusiness);

module.exports = router;