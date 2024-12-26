const Item = require('../../models/item/itemModel');

// Add individual item details (cars or other specific items)
exports.addIndividualItem = async (req, res) => {
  try {
    const { itemName, itemCategory, itemType, itemDetails } = req.body;

    // Check if the item already exists in the database
    const existingItem = await Item.findOne({ itemName, itemCategory, itemType });

    if (existingItem) {
      return res.status(400).json({ message: 'Item already exists in the database.' });
    }

    const newItem = new Item({ itemName, itemCategory, itemType, itemDetails });
    await newItem.save();

    // If the category is 'Vehicles' (for cars), add specific car details
    if (itemCategory === 'Vehicles') {
      // Save additional details to the 'cars' collection or a separate part of the item model
    }

    res.status(201).json(newItem);
  } catch (error) {
    console.error('Error adding individual item:', error);
    res.status(500).json({ message: 'Error adding item', error });
  }
};
