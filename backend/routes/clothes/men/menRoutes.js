const express = require('express');
const {getAllMen,} = require('../../../controllers/clothes/men/menController');


const router = express.Router();


router.get('/', getAllMen);
module.exports = router;
