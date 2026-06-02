// Order controller placeholder
const Order = require("../models/Order");
const Business = require("../models/Business");
const Table = require("../models/Table");
const calculateDistance = require("../utils/calculateDistance");

exports.checkLocation = async (req, res) => {
  try {
    const { businessId, customerLat, customerLng } = req.body;

    const business = await Business.findById(businessId);

    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }

    const distance = calculateDistance(
      business.location.lat,
      business.location.lng,
      customerLat,
      customerLng
    );

    const allowed = distance <= business.geoFenceRadius;

    res.json({
      allowed,
      distance: Math.round(distance),
      radius: business.geoFenceRadius
    });
  } catch (error) {
    res.status(500).json({ message: "Location check failed" });
  }
};

exports.createOrder = async (req, res) => {
  try {
    const {
      businessId,
      tableNumber,
      items,
      totalAmount,
      customerLat,
      customerLng
    } = req.body;

    const business = await Business.findById(businessId);

    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }

    const table = await Table.findOne({
      businessId,
      tableNumber
    });

    if (!table) {
      return res.status(404).json({ message: "Table not found" });
    }

    const distance = calculateDistance(
      business.location.lat,
      business.location.lng,
      customerLat,
      customerLng
    );

    if (distance > business.geoFenceRadius) {
      return res.status(403).json({
        message: "You are outside restaurant area. Order blocked.",
        distance: Math.round(distance)
      });
    }

    const order = await Order.create({
      businessId,
      tableId: table._id,
      tableNumber,
      items,
      totalAmount,
      customerLocation: {
        lat: customerLat,
        lng: customerLng
      },
      status: "pending"
    });

    res.status(201).json({
      message: "Order placed successfully",
      order
    });
  } catch (error) {
    res.status(500).json({
      message: "Order creation failed",
      error: error.message
    });
  }
};

exports.getBusinessOrders = async (req, res) => {
  try {
    const business = await Business.findOne({
      _id: req.params.businessId,
      ownerId: req.user._id
    });

    if (!business) {
      return res.status(403).json({ message: "Not allowed" });
    }

    const orders = await Order.find({
      businessId: req.params.businessId
    }).sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to get orders" });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Order status update failed" });
  }
};