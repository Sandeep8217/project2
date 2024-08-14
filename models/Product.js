const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  supplier: String,
  sales: { type: Number, default: 0 },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  image: String // Optional field for image URL
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
