// File: server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
require("./config/db");

const authRoutes = require("./routes/auth.routes");
const productRoutes = require("./routes/product.routes");
const cartRoutes = require("./routes/cart.routes");
const orderRoutes = require("./routes/order.routes");
const paymentRoutes = require("./routes/payments.routes");
const reviewRoutes = require("./routes/review.routes");
const wishlistRoutes =  require("./routes/wishlist.routes");
const adminRoutes = require("./routes/admin.routes");

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/reviews",reviewRoutes);
app.use("/api/wishlist",wishlistRoutes);
app.use("/api/admin", adminRoutes);

app.get('/cancel', (req, res) => {
  res.json({ message: 'Payment Cancelled! Please try again.' });
});

app.get('/success', (req, res) => {
  res.json({ message: 'Payment Success!.' });
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
