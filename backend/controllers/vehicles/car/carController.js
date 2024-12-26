const Car = require('../../../models/vehicles/car/carModel');
const Item = require('../../../models/item/itemModel'); // Add this line at the top
const fs = require('fs');
const path = require('path');

// Create a car
exports.createCar = async (req, res) => {
    try {
        const {
            itemCategory, itemType, itemBrand, itemName, itemNo, model, year, price,
            priceUnit, description, features, itemQuantity
        } = req.body;

        // Fetch the corresponding item based on itemNo
        const item = await Item.findOne({ itemNo });

        if (!item) {
            return res.status(404).json({ message: "Item not found for the provided itemNo." });
        }

        const itemImage = req.file ? path.join('uploads', req.file.filename) : null;

        // Validate input
        if (!itemCategory || !itemType || !itemBrand || !itemName || !itemNo || !itemQuantity ||
            !model || !year || !price || !priceUnit || !description || !features || !itemImage) {
            return res.status(400).json({ message: "All fields are required." });
        }

        // Check if the total uploaded cars for the same itemNo exceed the quantity
        const uploadedCarsCount = await Car.countDocuments({ itemNo });
        if (uploadedCarsCount >= itemQuantity) {
            return res.status(400).json({
                message: `Cannot upload more cars. Maximum quantity (${itemQuantity}) reached for itemNo: ${itemNo}.`
            });
        }

        // Check if a similar car already exists
        const existingCar = await Car.findOne({ itemBrand, itemName, year, model });
        if (existingCar) {
            return res.status(409).json({ message: "A car with similar details already exists." });
        }

        const car = new Car({
            itemId: item._id,
            itemCategory, itemType, itemBrand, itemName, itemNo, itemQuantity,
            model, year, price, priceUnit, description, features, itemImage
        });

        await car.save();

        res.status(201).json({ message: "Car added successfully", car });
    } catch (error) {
        console.error("Error adding car:", error);
        res.status(500).json({ message: "Error adding car", error: error.message });
    }
};

// Update car details
exports.updateCar = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;

        if (req.file) {
            const car = await Car.findById(id);
            if (car && car.carImage) {
                await fs.promises.unlink(car.carImage); // Delete old image
            }
            updatedData.carImage = req.file.path; // Set new image path
        }

        const updatedCar = await Car.findByIdAndUpdate(id, updatedData, { new: true });

        if (!updatedCar) {
            return res.status(404).json({ message: 'Car not found' });
        }

        res.status(200).json({ message: 'Car updated successfully', car: updatedCar });
    } catch (error) {
        res.status(500).json({ message: 'Error updating car', error: error.message });
    }
};

// Get car by ID
exports.getCarById = async (req, res) => {
    try {
        const car = await Car.findById(req.params.id);
        if (!car) return res.status(404).json({ message: "Car not found" });
        res.status(200).json(car);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Delete a car
exports.deleteCar = async (req, res) => {
    try {
        const { id } = req.params;
        const car = await Car.findByIdAndDelete(id);

        if (car && car.carImage) {
            await fs.promises.unlink(car.carImage);
        }

        res.status(200).json({ message: 'Car deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting car', error: error.message });
    }
};

// Get all cars with optional filtering
exports.getAllCars = async (req, res) => {
    try {
        const { search, itemBrand, itemName, year, itemType } = req.query;
        const filterCriteria = {};

        if (itemBrand && itemBrand !== 'All') filterCriteria.itemBrand = itemBrand;
        if (year && year !== 'All') filterCriteria.year = year;
        if (itemType && itemType !== 'All') filterCriteria.itemType = itemType;
        if (itemName && itemName !== 'All') filterCriteria.itemName = itemName;

        if (search) {
            filterCriteria.$or = [
                { itemBrand: { $regex: search, $options: 'i' } },
                { itemName: { $regex: search, $options: 'i' } },
            ];
        }

        const cars = await Car.find(filterCriteria);
        res.status(200).json(cars);
    } catch (error) {
        console.error('Error fetching cars:', error);
        res.status(500).json({ message: 'Error fetching cars', error: error.message });
    }
};

// Create multiple cars
exports.createMultipleCars = async (req, res) => {
    try {
        const cars = req.body;

        if (!Array.isArray(cars)) {
            return res.status(400).json({ message: 'Invalid input, expected an array of car objects' });
        }

        // Validate each car object
        for (const car of cars) {
            const { itemBrand, itemName, year, itemType, price, description, features, priceUnit, itemNo } = car;

            // Get the itemId based on the itemNo
            const item = await Item.findOne({ itemNo });
            if (!item) {
                return res.status(400).json({ message: `Item with itemNo: ${itemNo} does not exist.` });
            }

            if (!itemBrand || !itemName || !year || !itemType || !price || !description || !features || !priceUnit) {
                return res.status(400).json({ message: 'All fields are required for each car' });
            }

            const existingCar = await Car.findOne({ itemBrand, itemName, year, itemType });
            if (existingCar) {
                return res.status(409).json({ message: `Car with brand ${itemBrand}, model ${itemName}, year ${year}, and type ${itemType} already exists` });
            }

            car.itemId = item._id; // Add itemId to the car object
        }

        const insertedCars = await Car.insertMany(cars);
        res.status(201).json({ message: 'Cars added successfully', cars: insertedCars });
    } catch (error) {
        res.status(500).json({ message: 'Error adding cars', error: error.message });
    }
};


