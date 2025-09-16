const Product = require('../models/Product');

// Add a new product with multiple images
exports.addProduct = async (req, res) => {
  try {
    const { name, category, description, price, stock } = req.body;

    // Handle uploaded images
    const images = req.files.map(file => `/uploads/${file.filename}`);

    const product = new Product({
      name,
      category,
      description,
      price,
      stock,
      images
    });

    const savedProduct = await product.save();
    res.status(201).json({ message: "Product added", product: savedProduct });
  } catch (error) {
    res.status(500).json({ message: "Error adding product", error: error.message });
  }
};

// Get all products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error: error.message });
  }
};

// Get a single product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Error fetching product", error: error.message });
  }
};

// Update a product by ID
exports.updateProduct = async (req, res) => {
  try {
    const { name, category, description, price, stock } = req.body;
    let images = [];

    if (req.files && req.files.length > 0) {
      images = req.files.map(file => `/uploads/${file.filename}`);
    }

    const updateData = {
      name,
      category,
      description,
      price,
      stock
    };

    // If new images are uploaded, update the images field
    if (images.length > 0) {
      updateData.images = images;
    }

    const product = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });

    if (!product) return res.status(404).json({ message: "Product not found" });

    res.json({ message: "Product updated", product });
  } catch (error) {
    res.status(500).json({ message: "Error updating product", error: error.message });
  }
};

// Delete a product by ID
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting product", error: error.message });
  }
};
