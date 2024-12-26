const mongoose = require("mongoose");

const purchaseSchema = new mongoose.Schema({
    itemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item',  // You can reference the Item collection or use the respective collection (Car, Bike, etc.)
        required: true,
    },
    itemTypeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Car', // Assuming you have a User model for registered users
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Assuming you have a User model for registered users
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
    },

    purchaseDate: {
        type: Date,
        default: Date.now,
    },
},
    { timestamps: true }
);

const Purchase = mongoose.model("carpurchase", purchaseSchema);
module.exports = Purchase;
