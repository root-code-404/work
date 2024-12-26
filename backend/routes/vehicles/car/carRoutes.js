
const express = require('express');
const {
    createCar,
    getAllCars,
    updateCar,
    deleteCar,
    getCarById,
    createMultipleCars,
    // getRecommendations,
} = require('../../../controllers/vehicles/car/carController');
const { upload } = require('../../../middleware/vehicles/car/uploadMiddleware');

const router = express.Router();

router.post('/', upload.single('itemImage'), createCar);
router.get('/', getAllCars);
router.get('/:id', getCarById);
// router.get("/recommendations", getRecommendations);
router.put('/:id', upload.single('itemImage'), updateCar);
router.delete('/:id', deleteCar);
router.post('/bulk', createMultipleCars);

module.exports = router;





