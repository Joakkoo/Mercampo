const express = require('express');
const router = express.Router();
const specsController = require('../controllers/specs.controller');

router.get('/lookup', specsController.lookup);

module.exports = router;
