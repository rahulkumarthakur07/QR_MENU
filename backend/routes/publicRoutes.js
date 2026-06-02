// Public routes placeholder
const express = require("express");
const router = express.Router();

const Business = require("../models/Business");
const Product = require("../models/Product");
const Category = require("../models/Category");
const Table = require("../models/Table");

router.get("/business/:businessId", async (req, res) => {
  try {
    const business = await Business.findById(req.params.businessId).select(
      "businessName logoUrl address geoFenceRadius"
    );

    res.json(business);
  } catch (error) {
    res.status(500).json({ message: "Failed to get business" });
  }
});

router.get("/menu/:businessId", async (req, res) => {
  try {
    const categories = await Category.find({
      businessId: req.params.businessId
    });

    const products = await Product.find({
      businessId: req.params.businessId,
      isAvailable: true
    }).populate("categoryId");

    res.json({
      categories,
      products
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to get menu" });
  }
});

const handleTableRequest = async (req, res) => {
  try {
    const table = await Table.findOne({
      businessId: req.params.businessId,
      tableNumber: req.params.tableNumber
    });

    if (!table || !table.isActive || req.params.token !== table.token) {
      return res.status(404).json({ message: "QR code not found or expired" });
    }

    res.json(table);
  } catch (error) {
    res.status(500).json({ message: "Failed to get table" });
  }
};

router.get("/table/:businessId/:tableNumber/:token", handleTableRequest);
router.get("/table/:businessId/:tableNumber", handleTableRequest);

module.exports = router;