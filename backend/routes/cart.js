const express = require('express');
const router = express.Router();
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  getCartCount
} = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

// All cart routes require authentication
router.use(protect);

// GET /cart - Get user's cart
router.get('/', getCart);

// POST /cart/add - Add item to cart
router.post('/add', addToCart);

// PUT /cart/update - Update item quantity
router.put('/update', updateCartItem);

// DELETE /cart/remove/:productId - Remove item from cart
router.delete('/remove/:productId', removeFromCart);

// DELETE /cart/clear - Clear entire cart
router.delete('/clear', clearCart);

// GET /cart/count - Get cart item count
router.get('/count', getCartCount);

module.exports = router;
