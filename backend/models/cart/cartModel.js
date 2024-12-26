const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    itemTypeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    addedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Cart', cartSchema);
