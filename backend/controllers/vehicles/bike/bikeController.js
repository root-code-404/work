// Get all bikes with optional filtering
const Bike = require('../../../models/vehicles/bike/bikeModel');


exports.getAllBikes = async (req, res) => {
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

        const bikes = await Bike.find(filterCriteria);
        res.status(200).json(bikes);
    } catch (error) {
        console.error('Error fetching bikes:', error);
        res.status(500).json({ message: 'Error fetching bikes', error: error.message });
    }
};