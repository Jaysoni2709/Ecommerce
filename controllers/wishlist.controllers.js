const Wishlist = require('../models/Wishlist');

const addToWishlist = async (req, res) => {
  const { productId } = req.body;

  try {
    let wishlist = await Wishlist.findOne({ user: req.user.id });

    if (!wishlist) {
      wishlist = new Wishlist({
        user: req.user.id,
        items: [productId],
      });
    } else {
      if (wishlist.items.includes(productId)) {
        return res.status(400).json({ message: 'Product already in wishlist' });
      }
      wishlist.items.push(productId);
    }

    await wishlist.save();
    res.json(wishlist);
  } catch (err) {
    res.status(500).json({ message: 'Error adding to wishlist', error: err.message });
  }
};

const getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user.id }).populate('items');
    res.json(wishlist || { items: [] });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching wishlist' });
  }
};

const removeFromWishlist = async (req, res) => {
  const { productId } = req.params;

  try {
    const wishlist = await Wishlist.findOneAndUpdate(
      { user: req.user.id },
      { $pull: { items: productId } },
      { new: true }
    ).populate('items');

    res.json(wishlist);
  } catch (err) {
    res.status(500).json({ message: 'Error removing from wishlist', error: err.message });
  }
};

module.exports = {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
};
