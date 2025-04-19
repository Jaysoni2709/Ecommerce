const express = require('express');
const router = express.Router();
const { addReview, getReviews } = require('../controllers/review.controllers');
const { verifyToken } = require('../middlewares/auth.middleware');

// Add review
router.post('/', verifyToken, addReview);

// Get all reviews for a product
router.get('/:productId', getReviews);

module.exports = router;
