const Product = require('../models/Product');

exports.getProducts = async (req, res, next) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (err) {
    next(err);
  }
};

exports.getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ msg: 'Product not found' });
    res.json(product);
  } catch (err) {
    next(err);
  }
};

exports.getFeaturedProducts = async (req, res, next) => {
  try {
    const products = await Product.findFeatured();
    res.json(products);
  } catch (err) {
    next(err);
  }
};