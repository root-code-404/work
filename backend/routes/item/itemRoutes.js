const express = require('express');
const { 
  getAllItems, 
  addItem, 
  getItemById, 
  getCategories, 
  getTypesByCategory, 
  getModelByCategoryAndType, 
  getBrandByCategoryAndType,
  getNameByCategoryAndType,
  getNoByCategoryAndType,
  getQntyByCategoryAndType,
  updateItemQuantity,
  getItemsByCategoryAndType, 
  updateItem,
  deleteItem,
  getItemByCategoryTypeAndBrand, 

  
} = require('../../controllers/item/itemController');

const router = express.Router();

// Add item
router.post('/add', addItem);

// Get all items
router.get('/', getAllItems);

// Get an item by ID
router.get('/:id', getItemById);

// Get all categories
router.get('/categories/all', getCategories);

// Get types by category
router.get('/categories/:category/types', getTypesByCategory);

// Get model by category
router.get('/categories/:category/types/:type/models', getModelByCategoryAndType);

// Get brand by category
router.get('/categories/:category/types/:type/models/:model/brand', getBrandByCategoryAndType);

// Get name by category
router.get('/categories/:category/types/:type/models/:model/brand/:brand/name', getNameByCategoryAndType);

router.get('/categories/:category/types/:type/models/:model/brand/:brand/name/:name/number', getNoByCategoryAndType);

router.get('/categories/:category/types/:type/models/:model/brand/:brand/name/:name/number/:number/qnty', getQntyByCategoryAndType);




//  Get dashboard items by category and type
router.get('/categories/:category/types/:type/items', getItemsByCategoryAndType);

// Update item by ID
router.put('/:id', updateItem);

// Delete item by ID
router.delete('/:id', deleteItem);




router.put("/quantity/:id", updateItemQuantity);

router.get( "/categories/:category/types/:type/brands/:brand", getItemByCategoryTypeAndBrand);



module.exports = router;
