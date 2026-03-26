const Message = require('../models/Message');

exports.getConversation = async (req, res, next) => {
  const { userId1, userId2 } = req.params;
  try {
    const messages = await Message.findConversation(userId1, userId2 === 'admin' ? 1 : userId2);
    res.json(messages);
  } catch (err) {
    next(err);
  }
};

exports.sendMessage = async (req, res, next) => {
  const { sender_id, receiver_id, message, sender_type, order_id } = req.body;
  try {
    const messageId = await Message.create({ sender_id, receiver_id, message, sender_type, order_id });
    res.status(201).json({ success: true, messageId });
  } catch (err) {
    next(err);
  }
};

exports.getAdminConversations = async (req, res, next) => {
  try {
    const conversations = await Message.findAdminConversations();
    res.json(conversations);
  } catch (err) {
    next(err);
  }
};

exports.markAsRead = async (req, res, next) => {
  const { receiverId, senderId } = req.params;
  try {
    await Message.markAsRead(receiverId, senderId);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};
