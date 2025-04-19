const express = require('express');
const router = express.Router();
const { createCheckoutSession, handleWebhook } = require('../controllers/payment.controllers');
const { verifyToken } = require('../middlewares/auth.middleware');
const bodyParser = require('body-parser');


router.post('/checkout', verifyToken, createCheckoutSession);
router.post('/webhook', bodyParser.raw({ type: 'application/json' }), handleWebhook);

module.exports = router;
