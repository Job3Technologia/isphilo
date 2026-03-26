const User = require('../models/User');
const Order = require('../models/Order');

exports.getDashboardData = async (req, res, next) => {
  const userId = req.params.userId || req.user.id;
  try {
    const user = await User.findById(userId);
    const stats = await Order.getStats(userId);
    const recentActivity = await Order.findByUserId(userId, 5);

    res.json({
      user,
      stats: {
        total_orders: stats.total_orders || 0,
        total_spent: parseFloat(stats.total_spent || 0).toFixed(2),
        top_category: stats.top_category || 'N/A'
      },
      recentActivity
    });
  } catch (err) {
    next(err);
  }
};