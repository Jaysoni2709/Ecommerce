const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Add or update item in cart
const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user.id;

  try {
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({
        user: userId,
        items: [{ product: productId, quantity }],
      });
    } else {
      const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ product: productId, quantity });
      }
    }

    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: 'Error adding to cart', error: err.message });
  }
};

// Get user's cart
const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
    res.json(cart || { items: [] });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching cart' });
  }
};

// Clear cart after order
const clearCart = async (userId) => {
  await Cart.findOneAndDelete({ user: userId });
};

module.exports = {
  addToCart,
  getCart,
  clearCart
};
