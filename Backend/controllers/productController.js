const ProductModel = require("../models/Product"); // Corrected import path

// Add Product (C)
const addProduct = async (req, res) => {
  try {
    const { productTitle, productDesc, productPrice, productImage, category, brand } = req.body;

    if (!productTitle || !productDesc || !productPrice || !productImage || !category || !brand) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const data = await ProductModel.create({
      productTitle,
      productDesc,
      productPrice,
      productImage,
      category,
      brand,
    });

    res.status(201).json({
      success: true,
      message: "Product added successfully",
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Failed to add product: ${error.message}`,
    });
  }
};

// Get All Products (R)

const getAllProducts = async (req, res) => {
  try {
    const { limit = 10, page = 1, search } = req.query;
    const query = search ? { productTitle: { $regex: search, $options: "i" } } : {};
    const products = await ProductModel.find(query)
      .limit(parseInt(limit))
      .skip((page - 1) * parseInt(limit));
    const total = await ProductModel.countDocuments(query);
    res.status(200).json({
      success: true,
      data: {
        products,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Server error: ${error.message}`,
    });
  }
};

// Get Single Product by ID (R)
const getSingleProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await ProductModel.findById(id);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product fetched successfully",
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Failed to fetch product: ${error.message}`,
    });
  }
};

// Update Product using findByIdAndUpdate (U)
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { productTitle, productDesc, productPrice, productImage, category, brand } = req.body;

    const updatedProduct = await ProductModel.findByIdAndUpdate(
      id,
      {
        $set: {
          productTitle,
          productDesc,
          productPrice,
          productImage,
          category,
          brand,
          updatedAt: Date.now(),
        },
      },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Failed to update product: ${error.message}`,
    });
  }
};

// Delete Product (D)
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await ProductModel.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Failed to delete product: ${error.message}`,
    });
  }
};
const searchProducts = async (req, res) => {
  try {
    const { query, category, price_min, price_max } = req.query;
    let filter = {};

    // Debugging logs
    console.log("Search Query:", { query, category, price_min, price_max });

    if (query) {
      filter.productTitle = { $regex: query, $options: "i" };
    }
    if (category) {
      filter.category = category; // Corrected field
    }
    if (price_min || price_max) {
      filter.productPrice = {};
      if (price_min) filter.productPrice.$gte = Number(price_min) || 0;
      if (price_max) filter.productPrice.$lte = Number(price_max) || Infinity;
    }

    const products = await ProductModel.find(filter); // Corrected model name
    console.log("Found Products:", products);

    res.status(200).json({ success: true, data: { products } });
  } catch (error) {
    console.error("Search products error:", error.message, error.stack);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};


module.exports = {
  addProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  searchProducts,
};