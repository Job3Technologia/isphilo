const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const { protect, admin } = require('../middleware/auth');

router.get('/conversation/:userId1/:userId2', protect, messageController.getConversation);
router.post('/', protect, messageController.sendMessage);
router.get('/admin/conversations', protect, admin, messageController.getAdminConversations);
router.put('/mark-read/:receiverId/:senderId', protect, messageController.markAsRead);

module.exports = router;
