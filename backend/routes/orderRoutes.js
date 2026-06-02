// Order routes placeholder
const express = require("express");
const router = express.Router();

const {
  checkLocation,
  createOrder,
  getBusinessOrders,
  updateOrderStatus
} = require("../controllers/orderController");

const { protect } = require("../middleware/authMiddleware");

router.post("/check-location", checkLocation);
router.post("/", createOrder);
router.get("/business/:businessId", protect, getBusinessOrders);
router.patch("/:id/status", protect, updateOrderStatus);

module.exports = router;