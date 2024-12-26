const express = require('express');
const {
    getAllBikes,
} = require('../../../controllers/vehicles/bike/bikeController');


const router = express.Router();


router.get('/', getAllBikes);
module.exports = router;
