const express = require('express');
const router = express.Router();
const { processYocoPayment } = require('../controllers/paymentController');

router.post('/process', processYocoPayment);

module.exports = router;