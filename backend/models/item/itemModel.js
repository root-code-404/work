const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema(
  {
    itemNo: { type: String, required: true, unique: true }, // Ensures that itemNo is unique
    itemName: { type: String, required: true },
    itemCategory: { 
      type: String, 
      required: true, 
      enum: ['Vehicles', 'Clothes', 'Electronics', 'Furniture', 'Books', 'Personal Care', 'Beauty', 'Other Accessories'] 
    },
    itemType: { type: String, required: true },
    itemBrand: { type: String, required: true },
    itemQuantity: { type: Number, required: true, min: 0 },

    model: { type: String, required: true },
    dateAdded: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;
