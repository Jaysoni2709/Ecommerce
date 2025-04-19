const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  quantity: Number,
});

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [orderItemSchema],
  totalAmount: Number,
  status: {
    type: String,
    enum: ['pending', 'paid', 'shipped'],
    default: 'pending',
  },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
