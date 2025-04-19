const express = require('express');
const router = express.Router();
const { addToCart, getCart } = require('../controllers/cart.controllers');
const { verifyToken } = require('../middlewares/auth.middleware');

// User routes
router.post('/add', verifyToken, addToCart);
router.get('/', verifyToken, getCart);

module.exports = router;
