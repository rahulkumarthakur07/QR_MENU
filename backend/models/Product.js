// Product model placeholder
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",
      required: true
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category"
    },
    name: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    price: {
      type: Number,
      required: true
    },
    imageUrl: {
      type: String
    },
    isAvailable: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);