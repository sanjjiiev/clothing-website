const express = require('express');
const { protect, admin } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');
const Product = require('../models/Product');

const router = express.Router();

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});

const upload = multer({ storage });

// -------- Add Product --------
router.post('/', protect, admin, upload.array('images', 10), async (req, res) => {
  try {
    const { name, category, description, price, stock } = req.body;
    if (!name || !category || !price || !stock)
      return res.status(400).json({ message: 'Required fields missing' });

    const images = req.files ? req.files.map(f => `/uploads/${f.filename}`) : [];

    const product = new Product({ name, category, description, price, stock, imageUrl: images });
    await product.save();
    res.status(201).json({ message: 'Product added', product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error adding product', error: err.message });
  }
});

// -------- Get All Products --------
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching products', error: err.message });
  }
});

// -------- Update Product --------
router.put('/:id', protect, admin, upload.array('images', 10), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const { name, category, description, price, stock, removeImages } = req.body;

    if (name) product.name = name;
    if (category) product.category = category;
    if (description) product.description = description;
    if (price) product.price = price;
    if (stock) product.stock = stock;

    // Remove selected images
    if (removeImages) {
      const imagesToRemove = Array.isArray(removeImages) ? removeImages : [removeImages];
      product.imageUrl = product.imageUrl.filter(img => !imagesToRemove.includes(img));
    }

    // Add new uploaded images
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(f => `/uploads/${f.filename}`);
      product.imageUrl = product.imageUrl.concat(newImages);
    }

    await product.save();
    res.json({ message: 'Product updated', product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating product', error: err.message });
  }
});

// -------- Delete Product --------
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting product', error: err.message });
  }
});

module.exports = router;
