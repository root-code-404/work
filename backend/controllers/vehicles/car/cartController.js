const Cart = require('../../../models/vehicles/car/cartModel');
const Car = require('../../../models/vehicles/car/carModel');

const addToCart = async (req, res) => {
  try {
    const { carId } = req.body;
    const userId = req.user.userId;

    // Validate car existence
    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    // Check for duplicates in the cart
    const existingCart = await Cart.findOne({ carId, userId });
    if (existingCart) {
      return res.status(409).json({ message: 'Car already in cart' });
    }

    // Add car to the cart
    const newCartEntry = new Cart({ carId, userId });
    await newCartEntry.save();

    res.status(201).json({ message: 'Car added to cart', cart: newCartEntry });
  } catch (error) {
    console.error('Error adding car to cart:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getCartItems = async (req, res) => {
  try {
    console.log('User from token:', req.user); // Debugging log

    const userId = req.user.userId;
    if (!userId) {
      return res.status(400).json({ message: 'Invalid user ID in token' });
    }

    // Fetch cart items and populate related data
    const cartItems = await Cart.find({ userId })
      .populate({
        path: 'carId',
        select: 'brand model year price carImage',
      })
      .populate({
        path: 'userId',
        select: 'email',
      });

    // If cart is empty
    if (!cartItems || cartItems.length === 0) {
      return res.status(404).json({ message: 'Cart is empty' });
    }

    // Format the data
    const formattedItems = cartItems.map((item) => ({
      carId: item.carId?._id || null,
      brand: item.carId?.brand || null,
      model: item.carId?.model || null,
      year: item.carId?.year || null,
      price: item.carId?.price || null,
      carImage: item.carId?.carImage || null,
      userEmail: item.userId?.email || null,
    }));

    console.log('Formatted Cart Items:', formattedItems);

    // Send the response
    res.status(200).json(formattedItems);
  } catch (error) {
    console.error('Error fetching cart items:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const { id } = req.params; // carId
    const userId = req.user.userId; // Ensure you're using userId from the token

    console.log(`Attempting to remove car with ID: ${id} for user: ${userId}`);

    // Check if the cart item exists for the user
    const cartItem = await Cart.findOne({ carId: id, userId });

    if (!cartItem) {
      console.log('Item not found in cart');
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    // If the cart item exists, delete it
    await Cart.findOneAndDelete({ carId: id, userId });
    res.status(200).json({ message: 'Car removed from cart' });
  } catch (error) {
    console.error('Error removing cart item:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getCartItems, removeFromCart, addToCart };
