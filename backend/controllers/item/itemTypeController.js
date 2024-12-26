
// Create a item
const path = require('path');
const Car = require('../../models/vehicles/car/carModel');
const Bike = require('../../models/vehicles/bike/bikeModel');
const Men = require('../../models/clothes/men/menModel');

const Item = require('../../models/item/itemModel'); // Imported for fetching base item
const fs = require('fs');

// Create an item
exports.createItem = async (req, res) => {
    try {
        const {
            itemCategory, itemType, itemBrand, itemName, itemNo, model, year, price,
            priceUnit, description, features, itemQuantity,
        } = req.body;
        const itemImage = req.file ? path.join('uploads', req.file.filename) : null;

        console.log("Received data:", req.body);  // Log the incoming data
        console.log("Received data:", itemImage);  // Log the incoming data


        // Fetch the corresponding item based on itemNo
        const item = await Item.findOne({ itemNo });
        if (!item) {
            return res.status(404).json({ message: "Item not found for the provided itemNo." });
        }

        let itemCollection;

        switch (itemType) {
            case 'Car':
                itemCollection = Car;
                break;
            case 'Bike':
                itemCollection = Bike;
                break;
            case 'Men':
                itemCollection = Men;
                break;
            default:
                return res.status(400).json({ message: 'Invalid item type' });
        }

        // Handle file upload for item image

        // Validate input
        if (!itemCategory || !itemType || !itemName || !itemNo || !itemQuantity || !itemBrand ||
            !model || !year || !price || !priceUnit || !description || !features || !itemImage) {
            return res.status(400).json({ message: "All fields are required." });
        }

        const uploadedItemsCount = await itemCollection.countDocuments({ itemNo });
        if (uploadedItemsCount >= itemQuantity) {
            return res.status(400).json({
                message: `Cannot upload more items. Maximum quantity (${itemQuantity}) reached for itemNo: ${itemNo}.`
            });
        }

        const existingItem = await itemCollection.findOne({ itemBrand, itemName, year, model });
        if (existingItem) {
            return res.status(409).json({ message: "An item with similar details already exists." });
        }

        const newItem = new itemCollection({
            itemId: item._id,
            itemCategory, itemType, itemBrand, itemName, itemNo, itemQuantity,
            model, year, price, priceUnit, description, features, itemImage
        });

        await newItem.save();
        res.status(201).json({ message: "Item added successfully", newItem });
    } catch (error) {
        console.error("Error adding item:", error); // Log the full error
        res.status(500).json({ message: "Error adding item", error: error.message });
    }
};



// Update an existing item
 // Adjust the paths based on your project structure

exports.updateItem = async (req, res) => {
    const { id } = req.params;
    const {
        itemBrand, itemName, model, year, price, priceUnit,
        description, features, itemType,
    } = req.body;

    // Prepare updated data
    const updatedData = {
        itemBrand,
        itemName,
        model,
        year,
        price,
        priceUnit,
        description,
        features,
        itemType,
    };

    try {
        // Fetch the current item (Car or Bike) to check for existing image
        let existingItem;
        if (itemType === 'Car') {
            existingItem = await Car.findById(id);
        } else if (itemType === 'Bike') {
            existingItem = await Bike.findById(id);
        } 
        else if (itemType === 'Men') {
            existingItem = await Bike.findById(id);
        } else {
            return res.status(400).json({ message: 'Invalid item type' });
        }

        // If the item doesn't exist, return an error
        if (!existingItem) {
            return res.status(404).json({ message: 'Item not found' });
        }

        // Handle new item image if uploaded
        if (req.file) {
            // Construct the old image path (debugging)
            const oldImagePath = path.join(__dirname, '..', '..', existingItem.itemImage);
            console.log('Attempting to delete old image at:', oldImagePath); // Debugging line

            // Check if the file exists and then delete it
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
                console.log('Old image deleted successfully'); // Debugging line
            } else {
                console.log('Old image does not exist, skipping deletion'); // Debugging line
            }

            // Set the new image path
            const itemImage = path.join('uploads', req.file.filename);
            updatedData.itemImage = itemImage; // Update with the new image
        } else {
            // If no new image is uploaded, retain the existing image
            updatedData.itemImage = existingItem.itemImage;
        }

        // Update the item in the corresponding collection (Car or Bike)
        let updatedItem;
        if (itemType === 'Car') {
            updatedItem = await Car.findByIdAndUpdate(id, updatedData, { new: true });
        } else if (itemType === 'Bike') {
            updatedItem = await Bike.findByIdAndUpdate(id, updatedData, { new: true });
        } else if (itemType === 'Men') {
                updatedItem = await Bike.findByIdAndUpdate(id, updatedData, { new: true });
        }

        // Check if update was successful
        if (!updatedItem) {
            return res.status(404).json({ message: 'Item not found' });
        }

        // Return the updated item
        res.status(200).json({ message: 'Item updated successfully', updatedItem });
    } catch (error) {
        console.error('Error updating item:', error);
        res.status(500).json({ message: 'Error updating item', error: error.message });
    }
};





// Fetch items by filters
exports.getItemsByType = async (req, res) => {
    try {
        const { itemName, itemBrand, model, year } = req.query;

        const filter = {};
        if (itemName) filter.itemName = { $regex: itemName, $options: 'i' };
        if (itemBrand) filter.itemBrand = { $regex: itemBrand, $options: 'i' };
        if (model) filter.model = { $regex: model, $options: 'i' };
        if (year) filter.year = year;

        const cars = await Car.find(filter);
        const bikes = await Bike.find(filter);
        const men = await Men.find(filter);


        const itemsByType = {
            Car: cars,
            Bike: bikes,
            Men: men,

        };

        res.status(200).json(itemsByType);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching items', error: error.message });
    }
};


exports.getItemById = async (req, res) => {
    const { id } = req.params;
    try {
        const car = await Car.findById(id);
        const bike = await Bike.findById(id);
        const men = await Men.findById(id);


        if (!car && !bike && !men) {
            return res.status(404).json({ message: "Item not found" });
        }

        // If car is found, return car details, otherwise bike
        if (car) {
            return res.status(200).json({ item: car });
        } else if(bike){
            return res.status(200).json({ item: bike });
        } else {
            return res.status(200).json({ item: men });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


// Delete an item by ID
exports.deleteItem = async (req, res) => {
    try {
        const { id } = req.params;

        // Find and delete the item
        const deletedItem = await Item.findByIdAndDelete(id);
        if (!deletedItem) {
            return res.status(404).json({ message: 'Item not found' });
        }

        // Also delete related data from Car and Bike collections
        const carDeleteResult = await Car.deleteMany({ itemId: id });
        const bikeDeleteResult = await Bike.deleteMany({ itemId: id });
        const menDeleteResult = await Men.deleteMany({ itemId: id });


        console.log('Car delete result:', carDeleteResult);
        console.log('Bike delete result:', bikeDeleteResult);
        console.log('Bike delete result:', menDeleteResult);


        res.status(200).json({
            message: 'Item and related data deleted successfully!',
            deletedItem,
        });
    } catch (error) {
        console.error('Error deleting item:', error);
        res.status(500).json({ message: 'Failed to delete item and related data.' });
    }
};
