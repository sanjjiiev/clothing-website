const express = require('express');
const { createOrder, getOrders } = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/create', createOrder);
router.get('/', protect, admin, getOrders);

module.exports = router;
