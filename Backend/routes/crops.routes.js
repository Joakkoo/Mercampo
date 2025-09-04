const express = require('express');
const router = express.Router();
const cropController = require('../controllers/crop.controller');

router.get('/', cropController.getCrops);

module.exports = router;
