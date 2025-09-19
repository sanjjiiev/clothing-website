const mongoose = require('mongoose');

const kidsProductSchema = new mongoose.Schema({
  name: String,
  category: { type: String, default: 'Kids' },
  description: String,
  price: Number,
  stock: Number,
  sold: { type: Number, default: 0 },
  imageUrl: [String]
});

module.exports = mongoose.model('KidsProduct', kidsProductSchema);
