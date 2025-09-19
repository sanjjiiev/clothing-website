const mongoose = require('mongoose');

const womenProductSchema = new mongoose.Schema({
  name: String,
  category: { type: String, default: 'Women' },
  description: String,
  price: Number,
  stock: Number,
  sold: { type: Number, default: 0 },
  imageUrl: [String]
});

module.exports = mongoose.model('WomenProduct', womenProductSchema);
