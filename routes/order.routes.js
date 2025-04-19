const express = require('express');
const router = express.Router();
const { placeOrder, getUserOrders } = require('../controllers/order.controllers');
const { verifyToken } = require('../middlewares/auth.middleware');

// Place order
router.post('/', verifyToken, placeOrder);

// Get user's orders
router.get('/', verifyToken, getUserOrders);

module.exports = router;
