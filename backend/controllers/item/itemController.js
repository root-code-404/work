const Item = require('../../models/item/itemModel');
const Car = require('../../models/vehicles/car/carModel');
const Bike = require('../../models/vehicles/bike/bikeModel');
// Add item
exports.addItem = async (req, res) => {
try {
    const { itemName, itemCategory, itemBrand } = req.body;

    // Check if the item already exists in the database
    const existingItem = await Item.findOne({ 
      itemName, 
      itemCategory, 
      itemBrand 
    });

    if (existingItem) {
      return res.status(400).json({ message: 'Item already exists in the database.' });
    }

    // If no duplicate found, create the new item
    const newItem = new Item(req.body);
    await newItem.save();
    res.status(201).json(newItem);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding item', error });
  }
};

// Get all items
exports.getAllItems = async (req, res) => {
    try {
        const items = await Item.find();
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get an item by ID
exports.getItemById = async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        if (!item) return res.status(404).json({ message: 'Item not found' });

        res.status(200).json(item);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


// Get all categories
exports.getCategories = async (req, res) => {
    try {
        const categories = await Item.distinct('itemCategory');
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get all types under a specific category
exports.getTypesByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const types = await Item.find({ itemCategory: category }).distinct('itemType');
        res.status(200).json(types);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get all models(carType) under a specific category and type
exports.getModelByCategoryAndType = async (req, res) => {
  try {
    const { category, type } = req.params;
    const models = await Item.find({ itemCategory: category, itemType: type }).distinct('model');
    res.status(200).json(models);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all itembrand under a specific category and type
exports.getBrandByCategoryAndType = async (req, res) => {
  try {
    const { category, type,model } = req.params;
    const brand = await Item.find({ itemCategory: category, itemType: type, model: model }).distinct('itemBrand');
    res.status(200).json(brand);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all itemname under a specific category and type
exports.getNameByCategoryAndType = async (req, res) => {
  try {
    const { category, type, model,brand } = req.params;
    const name = await Item.find({ itemCategory: category, itemType: type, model: model, itemBrand: brand }).distinct('itemName');
    res.status(200).json(name);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all itemname under a specific category and type
exports.getNoByCategoryAndType = async (req, res) => {
  try {
    const { category, type, model, brand, name } = req.params;
    const number = await Item.find({ itemCategory: category, itemType: type, model: model, itemBrand: brand, itemName: name }).distinct('itemNo');
    res.status(200).json(number);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// Get all item quantities by category, type, model, brand, name, and number
exports.getQntyByCategoryAndType = async (req, res) => {
  try {
    const { category, type, model, brand, name, number } = req.params;
    const qnty = await Item.find({
      itemCategory: category,
      itemType: type,
      model: model,
      itemBrand: brand,
      itemName: name,
      itemNo: number
    }).distinct('itemQuantity');
    res.status(200).json(qnty);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// Get items by category and type
exports.getItemsByCategoryAndType = async (req, res) => {
    try {
        const { category, type } = req.params;
        const items = await Item.find({ itemCategory: category, itemType: type });
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update item by ID

exports.updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    let updates = req.body;

    // Exclude _id field from updates
    const { _id, ...validUpdates } = updates;

    // Check if the item exists in the database
    const item = await Item.findById(id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Update the item in the Item collection
    const updatedItem = await Item.findByIdAndUpdate(id, validUpdates, { new: true });
    if (!updatedItem) {
      return res.status(404).json({ message: 'Failed to update item' });
    }

    // Update related Car and Bike collections
    const carUpdate = await Car.updateMany(
      { itemId: id },
      { $set: validUpdates },
      { new: true }
    );
    console.log('Car update result:', carUpdate);

    const bikeUpdate = await Bike.updateMany(
      { itemId: id },
      { $set: validUpdates }
    );
    console.log('Bike update result:', bikeUpdate);

    res.status(200).json({
      message: 'Item and related data updated successfully!',
      updatedItem,
    });
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ message: 'Failed to update item and related data.' });
  }
};


exports.deleteItem = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedItem = await Item.findByIdAndDelete(id);

    if (!deletedItem) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Delete related car and bike entries
    await Car.deleteMany({ itemId: id });
    await Bike.deleteMany({ itemId: id });

    res.status(200).json({ message: 'Item and related data deleted successfully!' });
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ message: 'Failed to delete item and related data.' });
  }
};

exports.updateItemQuantity = async (req, res) => {
  try {
    const { id } = req.params; // Item ID
    const { qauntity } = req.body;

    if (!qauntity || qauntity <= 0) {
      return res.status(400).json({ message: "Invalid purchase quantity." });
    }

    const item = await Item.findById(id);
    if (!item) {
      return res.status(404).json({ message: "Item not found." });
    }

    if (item.itemQuantity < qauntity) {
      return res.status(400).json({ message: "Insufficient stock available." });
    }

    item.itemQuantity -= qauntity;
    await item.save();

    res.status(200).json({ message: "Item quantity updated.", updatedItem: item });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

exports.getItemByCategoryTypeAndBrand = async (req, res) => {
  const { category, type, brand } = req.params;

  try {
    const items = await Item.find({
      itemCategory: category,
      itemType: type,
      itemBrand: brand,
    });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: "Error fetching items by brand" });
  }
};
