const Product = require('../models/Product');

// Add new product
exports.addProduct = async (req, res) => {
  try {
    const { name, category, description, price, stock } = req.body;

    // Handle images
    const images = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];

    const product = new Product({
      name,
      category,
      description,
      price,
      stock,
      imageUrl: images
    });

    const savedProduct = await product.save();
    res.status(201).json({ message: 'Product added successfully', product: savedProduct });
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ message: 'Error adding product', error: error.message });
  }
};

// Get all products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
};

// Get product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Error fetching product', error: error.message });
  }
};

// Update product by ID
exports.updateProduct = async (req, res) => {
  try {
    const { name, category, description, price, stock } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Update fields if provided
    if (name) product.name = name;
    if (category) product.category = category;
    if (description) product.description = description;
    if (price) product.price = price;
    if (stock) product.stock = stock;

    // If new images uploaded, replace
    if (req.files && req.files.length > 0) {
      product.imageUrl = req.files.map(file => `/uploads/${file.filename}`);
    }

    const updatedProduct = await product.save();
    res.json({ message: 'Product updated successfully', product: updatedProduct });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Error updating product', error: error.message });
  }
};

// Delete product by ID
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Error deleting product', error: error.message });
  }
};
