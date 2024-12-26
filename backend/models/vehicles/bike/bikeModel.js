const mongoose = require('mongoose');

const bikeSchema = new mongoose.Schema({
    itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },  // Reference to the Item model
    itemCategory: { type: String, required: true },
    itemType: { type: String, required: true },
    itemBrand: { type: String,rquired:true },
    itemName: { type: String, required: true },
    model: { type: String, required: true },
    itemNo: { type: String, required: true },
    itemQuantity: { type: Number, required: true },
    year: { type: Number, required: true },
    price: { type: Number, required: true },
    priceUnit: { type: String, required: true },
    description: { type: String, required: true },
    features: { type: String, required: true },
    itemImage: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Bike', bikeSchema);
