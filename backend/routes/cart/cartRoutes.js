const express = require('express');
const router = express.Router();
const { addToCart } = require('../../controllers/cart/cartController');
const cartMiddleware = require('../../middleware/cart/cartMiddleware');

// Route to add item to the cart
router.post('/', cartMiddleware, addToCart);

module.exports = router;
