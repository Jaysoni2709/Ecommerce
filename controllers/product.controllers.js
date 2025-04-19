const Product = require('../models/Product');

// Create product (Admin only)
const createProduct = async (req, res) => {
    try {
      const imageUrl = req.file?.path;
  
      const product = new Product({
        ...req.body,
        image: imageUrl, // Save Cloudinary image URL
      });
  
      await product.save();
      res.status(201).json(product);
    } catch (err) {
      res.status(500).json({ message: 'Error creating product', error: err.message });
    }
  };
  

// Get all products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching products' });
  }
};

// Get single product
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching product' });
  }
};

// Update product (Admin only)
const updateProduct = async (req, res) => {
    try {
      const updateData = { ...req.body };
  
      if (req.file) {
        updateData.image = req.file.path; // New image from Cloudinary
      }
  
      const updated = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
  
      if (!updated) return res.status(404).json({ message: 'Product not found' });
  
      res.json(updated);
    } catch (err) {
      res.status(500).json({ message: 'Error updating product', error: err.message });
    }
  };
  

// Delete product (Admin only)
const deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting product' });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
