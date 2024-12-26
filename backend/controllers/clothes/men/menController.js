// Get all men with optional filtering
const Men = require('../../../models/clothes/men/menModel');

exports.getAllMen = async (req, res) => {
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

        const men = await Men.find(filterCriteria);
        res.status(200).json(men);
    } catch (error) {
        console.error('Error fetching men:', error);
        res.status(500).json({ message: 'Error fetching men', error: error.message });
    }
};