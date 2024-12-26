const express = require('express');
const {  getCartItems, removeFromCart } = require('../../../controllers/vehicles/car/cartController');
const cartMiddleware = require('../../../middleware/cart/cartMiddleware');

const router = express.Router();

router.post('/', cartMiddleware, addToCart);
router.get('/', cartMiddleware, getCartItems); // Get all items in cart
router.delete('/:id', cartMiddleware, removeFromCart); // Remove item from cart

module.exports = router;

// const { addToCart } = require('../controllers/cartController');
// const { verifyToken } = require('../middleware/authMiddleware');

// Route to add item to the cart
// router.post('/cart', verifyToken, addToCart);

module.exports = router;
