const Order = require('../models/Order');
const Product = require('../models/Product');

exports.createOrder = async (req, res) => {
  const { userId, products, total, paymentId } = req.body;
  const order = new Order({ user: userId, products, total, paymentId });
  await order.save();

  for (let item of products) {
    const product = await Product.findById(item.productId);
    if (product) {
      product.stock -= item.quantity;
      product.sold += item.quantity;
      await product.save();
    }
  }

  res.json({ message: "Order placed", order });
};

exports.getOrders = async (req, res) => {
  const orders = await Order.find().populate('user', 'name email');
  res.json(orders);
};
