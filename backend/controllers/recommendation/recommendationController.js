// controllers/recommendation/recommendationController.js
const Recommendation = require('../../models/recommendation/recommendationModel');
const Item = require('../../models/item/itemModel');

// Add or Update Recommendation
exports.createOrUpdateRecommendation = async (req, res) => {
    try {
        const { itemCategory, itemType, recommendedItemIds } = req.body;

        if (!itemCategory || !itemType || !Array.isArray(recommendedItemIds)) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Ensure the recommended items exist
        const items = await Item.find({ _id: { $in: recommendedItemIds } });
        if (items.length !== recommendedItemIds.length) {
            return res.status(404).json({ message: 'Some recommended items do not exist' });
        }

        // Create or update the recommendation
        const recommendation = await Recommendation.findOneAndUpdate(
            { itemCategory, itemType },
            { recommendedItems: recommendedItemIds },
            { new: true, upsert: true } // Upsert: Create if not exists
        );

        res.status(200).json({ message: 'Recommendation saved successfully', recommendation });
    } catch (error) {
        console.error('Error saving recommendation:', error);
        res.status(500).json({ message: 'Error saving recommendation', error: error.message });
    }
};

// Get Recommendation by Category and Type
exports.getRecommendation = async (req, res) => {
    try {
        const { itemCategory, itemType } = req.query;

        if (!itemCategory || !itemType) {
            return res.status(400).json({ message: 'itemCategory and itemType are required' });
        }

        const recommendation = await Item.findOne({ itemCategory, itemType });

        if (!recommendation) {
            return res.status(404).json({ message: 'No recommendation found for the given category and type' });
        }

        res.status(200).json(recommendation);
    } catch (error) {
        console.error('Error fetching recommendation:', error);
        res.status(500).json({ message: 'Error fetching recommendation', error: error.message });
    }
};
