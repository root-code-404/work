const Cart = require('../../models/cart/cartModel');
const Item = require('../../models/item/itemModel');

exports.addToCart = async (req, res) => {
    const { itemTypeId, userId } = req.body;

    if (!itemTypeId || !userId) {
        return res.status(400).json({ message: 'Item ID and User ID are required.' });
    }

    try {
        // Simulating saving the cart item to the database
        const newCartItem = await Cart.create({ itemTypeId, userId });
        return res.status(201).json({ message: 'Item added to cart.', cartItem: newCartItem });
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};
