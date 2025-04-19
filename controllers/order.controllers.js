const Order = require('../models/Order');
const Cart = require('../models/Cart');
const { clearCart } = require('./cart.controllers');

// Place an order
const placeOrder = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
    if (!cart || cart.items.length === 0)
      return res.status(400).json({ message: 'Cart is empty' });

    let total = 0;
    const orderItems = cart.items.map(item => {
      total += item.product.price * item.quantity;
      return {
        product: item.product._id,
        quantity: item.quantity,
      };
    });

    const order = new Order({
      user: req.user.id,
      items: orderItems,
      totalAmount: total,
    });

    await order.save();
    await clearCart(req.user.id);

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: 'Error placing order', error: err.message });
  }
};

// Get user orders
const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).populate('items.product');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching orders' });
  }
};

module.exports = {
  placeOrder,
  getUserOrders,
};
