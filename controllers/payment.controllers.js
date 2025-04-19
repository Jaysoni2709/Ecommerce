const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/Order');

const createCheckoutSession = async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findById(orderId).populate('items.product');
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: order.items.map(item => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.product.name,
          },
          unit_amount: item.product.price * 100, // cents
        },
        quantity: item.quantity,
      })),
      success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
      metadata: {
        orderId: order._id.toString(),
      },
    });

    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ message: 'Error creating checkout session', error: err.message });
  }
};

const handleWebhook = async (req, res) => {

  let event;
  try {

    event = req.body;

  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const orderId = session.metadata?.orderId;

    if (orderId) {
      await Order.findByIdAndUpdate(orderId, { status: 'paid' });
      console.log(`✅ Order ${orderId} marked as PAID`);
    }
  }

  // ✅ charge.updated
  if (event.type === 'charge.updated') {
    const charge = event.data.object;
    const orderId = charge.metadata?.orderId;

    if (orderId && charge.status === 'succeeded') {
      await Order.findByIdAndUpdate(orderId, { status: 'paid' });
      console.log(`✅ Order ${orderId} updated to PAID from charge.updated`);
    }
  }

  res.status(200).json({ received: true });
};

module.exports = {
  createCheckoutSession,
  handleWebhook,
}