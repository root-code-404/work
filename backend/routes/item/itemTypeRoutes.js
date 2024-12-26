
const express = require('express');
const {
    createItem,
    getItemsByType,
    getItemById,
    updateItem,
   
} = require('../../controllers/item/itemTypeController');
const { upload } = require('../../middleware/item/itemTypeMiddleware');

const router = express.Router();

router.post('/', upload.single('itemImage'), createItem);
router.get('/items-by-type', getItemsByType);
router.get('/:id', getItemById);
// Update item route
router.put('/:id', upload.single('itemImage'), updateItem);
// Get all cars by filters (brand, model, year)
router.get('/cars', getItemsByType);

// Get a single car by ID
router.get('/car/:id', getItemById);


module.exports = router;






