// routes/recommendation/recommendationRoutes.js
const express = require('express');
const {
    createOrUpdateRecommendation,
    getRecommendation,
} = require('../../controllers/recommendation/recommendationController');

const router = express.Router();

// Route to create or update a recommendation
router.post('/', createOrUpdateRecommendation);

// Route to get recommendations by category and type
router.get('/', getRecommendation);

module.exports = router;
