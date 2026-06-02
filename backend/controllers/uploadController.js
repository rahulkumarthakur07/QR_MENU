// Upload controller placeholder
const axios = require("axios");

exports.uploadImage = async (req, res) => {
  try {
    const { imageBase64 } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ message: "Image is required" });
    }

    const formData = new URLSearchParams();
    formData.append("key", process.env.IMGBB_API_KEY);
    formData.append("image", imageBase64);

    const response = await axios.post("https://api.imgbb.com/1/upload", formData);

    res.json({
      success: true,
      imageUrl: response.data.data.url
    });
  } catch (error) {
    res.status(500).json({
      message: "Image upload failed",
      error: error.message
    });
  }
};