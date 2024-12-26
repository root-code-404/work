const express = require('express');
const {
  
    getAllPurchases,
    getUserPurchases, 
    getPurchasesByItemCategory, 
    getPurchasesByItemBrand, 
    getPurchasesByItemName, 
    getPurchasesByModel, 
    getFilteredPurchases, 
    getPurchasesByItemType,

  
} = require('../../controllers/purchase/purchaseListController');

const router = express.Router();

// Get user details and purchase history

router.get("/history", getAllPurchases);

router.get("/user/:userId", getUserPurchases);
router.get("/category/:itemCategory", getPurchasesByItemCategory);
router.get("/itemBrand/:itemTypeId", getPurchasesByItemBrand);
router.get("/itemName/:itemTypeId", getPurchasesByItemName);
router.get("/model/:itemTypeId", getPurchasesByModel);
router.get("/itemType/:itemType", getPurchasesByItemType);





module.exports = router;
