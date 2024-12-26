const express = require('express');
const { purchaseItem,  } = require('../../controllers/purchase/purchaseController'); // Destructure the function

const router = express.Router();

// POST route to confirm purchase
router.post("/", purchaseItem);

module.exports = router;
