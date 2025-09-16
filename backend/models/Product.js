const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  category: String,
  description: String,
  price: Number,
  imageUrl: [String],
  stock: Number,
  sold: { type: Number, default: 0 },
});

module.exports = mongoose.model('Product', productSchema);
