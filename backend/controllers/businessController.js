// Business controller placeholder
const Business = require("../models/Business");

exports.createBusiness = async (req, res) => {
  try {
    const { businessName, logoUrl, address, lat, lng, geoFenceRadius } = req.body;

    const existing = await Business.findOne({ ownerId: req.user._id });

    if (existing) {
      return res.status(400).json({ message: "Business already exists" });
    }

    const business = await Business.create({
      ownerId: req.user._id,
      businessName,
      logoUrl,
      address,
      location: {
        lat,
        lng
      },
      geoFenceRadius: geoFenceRadius || 50
    });

    res.status(201).json(business);
  } catch (error) {
    res.status(500).json({ message: "Business creation failed", error: error.message });
  }
};

exports.getMyBusiness = async (req, res) => {
  try {
    const business = await Business.findOne({ ownerId: req.user._id });

    res.json(business);
  } catch (error) {
    res.status(500).json({ message: "Failed to get business" });
  }
};

exports.updateBusiness = async (req, res) => {
  try {
    const { businessName, logoUrl, address, lat, lng, geoFenceRadius } = req.body;

    const business = await Business.findOneAndUpdate(
      {
        _id: req.params.id,
        ownerId: req.user._id
      },
      {
        businessName,
        logoUrl,
        address,
        location: {
          lat,
          lng
        },
        geoFenceRadius
      },
      { new: true }
    );

    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }

    res.json(business);
  } catch (error) {
    res.status(500).json({ message: "Business update failed", error: error.message });
  }
};