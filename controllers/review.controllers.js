const Review = require('../models/Reviews');
const Product = require('../models/Product');

// Add a review
const addReview = async (req, res) => {
  const { productId, rating, comment } = req.body;

  try {
    // Prevent duplicate review
    const existing = await Review.findOne({ user: req.user.id, product: productId });
    if (existing) return res.status(400).json({ message: 'You already reviewed this product' });

    const review = new Review({
      user: req.user.id,
      product: productId,
      rating,
      comment,
    });

    await review.save();

    // Recalculate rating
    const reviews = await Review.find({ product: productId });
    const avg = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;

    await Product.findByIdAndUpdate(productId, {
      averageRating: avg.toFixed(1),
      reviewCount: reviews.length,
    });

    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: 'Error adding review', error: err.message });
  }
};

// Get reviews for a product
const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId }).populate('user', 'username');
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching reviews' });
  }
};

module.exports = { addReview, getReviews };
