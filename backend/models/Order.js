const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  products: [{ productId: String, quantity: Number }],
  total: Number,
  status: { type: String, default: 'Pending' },
  paymentId: String,
});

module.exports = mongoose.model('Order', orderSchema);
