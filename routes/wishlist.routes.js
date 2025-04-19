const express = require('express');
const router = express.Router();
const {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
} = require('../controllers/wishlist.controllers');
const { verifyToken } = require('../middlewares/auth.middleware');

// Add a product to wishlist
router.post('/add', verifyToken, addToWishlist);

// Get wishlist
router.get('/', verifyToken, getWishlist);

// Remove a product
router.delete('/:productId', verifyToken, removeFromWishlist);

module.exports = router;
