// Business model placeholder
const mongoose = require("mongoose");

const businessSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    businessName: {
      type: String,
      required: true
    },
    logoUrl: {
      type: String
    },
    address: {
      type: String
    },
    location: {
      lat: {
        type: Number,
        required: true
      },
      lng: {
        type: Number,
        required: true
      }
    },
    geoFenceRadius: {
      type: Number,
      default: 50
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Business", businessSchema);