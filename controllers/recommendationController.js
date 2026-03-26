const Order = require('../models/Order');

exports.getRecommendations = async (req, res, next) => {
  try {
    const stats = await Order.getStats(req.user.id);
    const topCategory = stats.top_category;

    // Basic recommendation logic:
    // 1. If they have a top category, recommend popular items from that category
    // 2. Otherwise, recommend generally popular items
    
    // For this prototype, we'll return a static-like personalized list
    const recommendations = [];
    
    if (topCategory) {
      recommendations.push({
        reason: `Based on your interest in ${topCategory}`,
        products: [
          { name: `Premium ${topCategory} Blend`, price: 599.00 },
          { name: `${topCategory} Essential Kit`, price: 850.00 }
        ]
      });
    }

    recommendations.push({
      reason: "Popular right now",
      products: [
        { name: "Oud Wood Classic", price: 1200.00 },
        { name: "Midnight Rose", price: 450.00 }
      ]
    });

    res.json(recommendations);
  } catch (err) {
    next(err);
  }
};