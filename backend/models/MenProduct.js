const mongoose = require('mongoose');

const menProductSchema = new mongoose.Schema({
  name: String,
  category: { type: String, default: 'Men' },
  description: String,
  price: Number,
  stock: Number,
  sold: { type: Number, default: 0 },
  imageUrl: [String]
});

module.exports = mongoose.model('MenProduct', menProductSchema);
