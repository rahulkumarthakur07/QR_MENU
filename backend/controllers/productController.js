// Product controller placeholder
const Product = require("../models/Product");
const Business = require("../models/Business");
const Category = require("../models/Category");

const checkBusinessOwner = async (businessId, userId) => {
  return await Business.findOne({
    _id: businessId,
    ownerId: userId
  });
};

const parseCsvLine = (line) => {
  const result = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }

  result.push(current);
  return result;
};

const normalizeHeader = (header) => {
  const normalized = header.trim().replace(/^"|"$/g, "").toLowerCase();

  if (normalized === "categoryname" || normalized === "category name") {
    return "categoryName";
  }

  if (normalized === "categoryid" || normalized === "category id") {
    return "categoryId";
  }

  return header.trim().replace(/^"|"$/g, "");
};

const parseCsv = (csvContent) => {
  const lines = csvContent.split(/\r?\n/).filter((line) => line.trim() !== "");
  if (lines.length === 0) {
    return { headers: [], rows: [] };
  }

  const headers = parseCsvLine(lines[0]).map(normalizeHeader);
  const rows = lines.slice(1).map((line) => {
    const values = parseCsvLine(line);
    return headers.reduce((row, header, index) => {
      row[header] = values[index] ? values[index].trim().replace(/^"|"$/g, "") : "";
      return row;
    }, {});
  }).filter((row) => Object.values(row).some((value) => value !== ""));

  return { headers, rows };
};

exports.createProduct = async (req, res) => {
  try {
    const {
      businessId,
      categoryId,
      name,
      description,
      price,
      imageUrl
    } = req.body;

    const business = await checkBusinessOwner(businessId, req.user._id);

    if (!business) {
      return res.status(403).json({ message: "Not allowed" });
    }

    const product = await Product.create({
      businessId,
      categoryId,
      name,
      description,
      price,
      imageUrl
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: "Product creation failed", error: error.message });
  }
};

exports.bulkUploadProducts = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "CSV file is required" });
    }

    const content = req.file.buffer.toString("utf-8");
    const { headers, rows } = parseCsv(content);

    const categoryField = headers.includes("categoryName") ? "categoryName" : "categoryId";
    const requiredHeaders = [categoryField, "name", "description", "price", "imageUrl"];
    const missingHeaders = requiredHeaders.filter((header) => !headers.includes(header));

    if (missingHeaders.length > 0) {
      return res.status(400).json({ message: `Missing headers: ${missingHeaders.join(", ")}` });
    }

    if (!rows.length) {
      return res.status(400).json({ message: "CSV file contains no data" });
    }

    const hasMissingCategory = rows.some((row) => !((row[categoryField] || "").trim()));
    if (hasMissingCategory) {
      return res.status(400).json({ message: `Each row must include a ${categoryField}` });
    }

    const business = await Business.findOne({ ownerId: req.user._id });
    if (!business) {
      return res.status(403).json({ message: "Not allowed" });
    }

    let categoryMap = new Map();
    const categories = await Category.find({ businessId: business._id });

    if (categoryField === "categoryId") {
      const categoryIds = [...new Set(rows.map((row) => row.categoryId))].filter(Boolean);
      const businessCategoryIds = categories.map((category) => category._id.toString());
      const invalidIds = categoryIds.filter((categoryId) => !businessCategoryIds.includes(categoryId));

      if (invalidIds.length > 0) {
        return res.status(400).json({ message: `Invalid category IDs for this business: ${invalidIds.join(", ")}` });
      }

      categories.forEach((category) => categoryMap.set(category._id.toString(), category));
    } else {
      const categoryGroups = categories.reduce((map, category) => {
        const key = category.name.trim().toLowerCase();
        map[key] = category;
        return map;
      }, {});

      const categoryNames = rows
        .map((row) => (row.categoryName || "").trim())
        .filter(Boolean);

      const missingNames = [...new Set(categoryNames
        .map((name) => name.toLowerCase())
        .filter((name) => !categoryGroups[name]))];

      const missingNameToOriginal = categoryNames.reduce((map, name) => {
        const normalized = name.toLowerCase();
        if (!map[normalized]) {
          map[normalized] = name;
        }
        return map;
      }, {});

      const newCategories = [];
      for (const missingName of missingNames) {
        const created = await Category.create({
          businessId: business._id,
          name: missingNameToOriginal[missingName]
        });
        categoryGroups[missingName] = created;
        newCategories.push(created);
      }

      Object.entries(categoryGroups).forEach(([key, category]) => {
        categoryMap.set(key, category);
      });
    }

    const products = rows.map((row) => {
      const category = categoryField === "categoryId"
        ? categoryMap.get(row.categoryId)
        : categoryMap.get((row.categoryName || "").trim().toLowerCase());

      return {
        businessId: business._id,
        categoryId: category._id,
        name: row.name,
        description: row.description,
        price: Number(row.price) || 0,
        imageUrl: row.imageUrl
      };
    });

    const createdProducts = await Product.insertMany(products);

    res.status(201).json({
      message: "Products uploaded successfully",
      products: createdProducts
    });
  } catch (error) {
    res.status(500).json({ message: "Bulk product upload failed", error: error.message });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find({
      businessId: req.params.businessId
    }).populate("categoryId");

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Failed to get products" });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Product update failed" });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);

    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: "Product delete failed" });
  }
};