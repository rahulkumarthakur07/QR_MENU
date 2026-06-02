// Category controller placeholder
const Category = require("../models/Category");
const Business = require("../models/Business");

const checkBusinessOwner = async (businessId, userId) => {
  return await Business.findOne({
    _id: businessId,
    ownerId: userId
  });
};

exports.createCategory = async (req, res) => {
  try {
    const { businessId, name } = req.body;

    const business = await checkBusinessOwner(businessId, req.user._id);

    if (!business) {
      return res.status(403).json({ message: "Not allowed" });
    }

    const category = await Category.create({
      businessId,
      name
    });

    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: "Category creation failed" });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find({
      businessId: req.params.businessId
    });

    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Failed to get categories" });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name },
      { new: true }
    );

    res.json(category);
  } catch (error) {
    res.status(500).json({ message: "Category update failed" });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);

    res.json({ message: "Category deleted" });
  } catch (error) {
    res.status(500).json({ message: "Category delete failed" });
  }
};