const express = require('express');
const { protect, admin } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');
const {
  addProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductsByCategory
} = require('../controllers/productController');

const router = express.Router();

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});

const upload = multer({ storage });

// -------- Add Product --------
router.post('/', protect, admin, upload.array('images', 10), addProduct);

// -------- Get All Products --------
router.get('/', getProducts);

// -------- Get Product by ID --------
router.get('/:id', getProductById);

// -------- Get Products by Category --------
router.get('/category/:category', getProductsByCategory);

// -------- Update Product --------
router.put('/:id', protect, admin, upload.array('images', 10), updateProduct);

// -------- Delete Product --------
router.delete('/:id', protect, admin, deleteProduct);

module.exports = router;
