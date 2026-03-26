const express = require('express');
const router = express.Router();
const { 
  getDeliveries, 
  getDeliveryById, 
  getDeliveryByTrackingId, 
  createDelivery, 
  updateDeliveryStatus 
} = require('../controllers/deliveryController');

router.get('/', getDeliveries);
router.get('/:id', getDeliveryById);
router.get('/tracking/:delivery_id', getDeliveryByTrackingId);
router.post('/', createDelivery);
router.put('/:id/status', updateDeliveryStatus);

module.exports = router;