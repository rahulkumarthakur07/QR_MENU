// Table controller placeholder
const crypto = require("crypto");
const QRCode = require("qrcode");
const Table = require("../models/Table");
const Business = require("../models/Business");

const generateTableUrl = (businessId, tableNumber, token) => {
  return `${process.env.FRONTEND_URL}/menu/${businessId}/table/${tableNumber}/${token}`;
};

exports.generateTables = async (req, res) => {
  try {
    const { businessId, numberOfTables } = req.body;

    const business = await Business.findOne({
      _id: businessId,
      ownerId: req.user._id
    });

    if (!business) {
      return res.status(403).json({ message: "Not allowed" });
    }

    await Table.deleteMany({ businessId });

    const tables = [];

    for (let i = 1; i <= numberOfTables; i++) {
      const token = crypto.randomBytes(12).toString("hex");
      const menuUrl = generateTableUrl(businessId, i, token);
      const qrCodeDataUrl = await QRCode.toDataURL(menuUrl);

      const table = await Table.create({
        businessId,
        tableNumber: i,
        menuUrl,
        qrCodeDataUrl,
        token,
        isActive: true
      });

      tables.push(table);
    }

    res.status(201).json(tables);
  } catch (error) {
    res.status(500).json({
      message: "Table generation failed",
      error: error.message
    });
  }
};

exports.getTables = async (req, res) => {
  try {
    const tables = await Table.find({
      businessId: req.params.businessId
    }).sort("tableNumber");

    res.json(tables);
  } catch (error) {
    res.status(500).json({ message: "Failed to get tables" });
  }
};
exports.resetTable = async (req, res) => {
  try {
    const table = await Table.findById(req.params.id);

    if (!table) {
      return res.status(404).json({ message: "Table not found" });
    }

    const business = await Business.findOne({
      _id: table.businessId,
      ownerId: req.user._id
    });

    if (!business) {
      return res.status(403).json({ message: "Not allowed" });
    }

    const token = crypto.randomBytes(12).toString("hex");
    const menuUrl = generateTableUrl(table.businessId, table.tableNumber, token);
    const qrCodeDataUrl = await QRCode.toDataURL(menuUrl);

    table.menuUrl = menuUrl;
    table.qrCodeDataUrl = qrCodeDataUrl;
    table.token = token;
    table.isActive = true;

    await table.save();

    res.json(table);
  } catch (error) {
    res.status(500).json({ message: "Failed to reset table QR", error: error.message });
  }
};

exports.deleteTable = async (req, res) => {
  try {
    const table = await Table.findById(req.params.id);

    if (!table) {
      return res.status(404).json({ message: "Table not found" });
    }

    const business = await Business.findOne({
      _id: table.businessId,
      ownerId: req.user._id
    });

    if (!business) {
      return res.status(403).json({ message: "Not allowed" });
    }

    await Table.findByIdAndDelete(req.params.id);

    res.json({ message: "Table deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete table" });
  }
};
