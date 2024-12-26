// models/recommendation/recommendationModel.js
const mongoose = require('mongoose');

const recommendationSchema = new mongoose.Schema({
    itemCategory: { type: String, required: true },
    itemType: { type: String, required: true },
    recommendedItems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }], // Array of Item references
}, { timestamps: true });

module.exports = mongoose.model('Recommendation', recommendationSchema);
