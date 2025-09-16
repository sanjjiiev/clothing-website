const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  category: String,
  description: String,
  price: Number,
  stock: Number,
  sold: { type: Number, default: 0 },
  imageUrl: [String]
});

module.exports = mongoose.model('Product', productSchema);
