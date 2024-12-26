const express = require('express');
const { addIndividualItem } = require('../../controllers/individualItem/individualController');

const router = express.Router();

// Route for adding individual items
router.post('/add-individual', addIndividualItem);
