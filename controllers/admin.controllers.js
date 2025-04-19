const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const paidOrders = await Order.find({ status: 'paid' });

    const totalRevenue = paidOrders.reduce((acc, order) => acc + order.totalAmount, 0);

    const pendingOrders = await Order.countDocuments({ status: 'pending' });
    const paidCount = await Order.countDocuments({ status: 'paid' });

    res.json({
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue,
      pendingOrders,
      paidOrders: paidCount,
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching dashboard stats', error: err.message });
  }
};

module.exports = { getDashboardStats };
