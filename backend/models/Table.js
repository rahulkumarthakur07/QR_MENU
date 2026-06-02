// Table model placeholder
const mongoose = require("mongoose");

const tableSchema = new mongoose.Schema(
  {
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",
      required: true
    },
    tableNumber: {
      type: Number,
      required: true
    },
    menuUrl: {
      type: String,
      required: true
    },
    qrCodeDataUrl: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Table", tableSchema);