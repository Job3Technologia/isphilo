const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const xss = require('xss-clean');
const hpp = require('hpp');
const path = require('path');
require('dotenv').config();

const { errorHandler } = require('./middleware/error');
const db = require('./config/db');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.JWT_SECRET)); // Use secret for signed cookies

// Security Middlewares
app.use(helmet({
  contentSecurityPolicy: false, // Disabling CSP for now to ensure external fonts/images load properly
}));
app.use(xss());
app.use(hpp());
app.use(cors());
app.use(compression());
app.use(morgan('dev'));

// Static Folders
app.use('/Images', express.static(path.join(__dirname, 'Images')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Serve specific HTML files to avoid exposing sensitive server files
const publicHtmlFiles = [
  'index.html', 'about.html', 'shop.html', 'specials.html', 'reviews.html', 
  'contact.html', 'cart.html', 'checkout.html', 'login.html', 'register.html',
  'product-details.html', 'wishlist.html', 'faq.html', 'privacy.html', 
  'terms.html', 'refund-policy.html', 'fragrance-guide.html', 'verify-otp.html',
  'forgot-password.html', 'order-tracking.html', 'order-success.html', 
  'customer-dashboard.html', '404.html'
];

publicHtmlFiles.forEach(file => {
  app.get(`/${file}`, (req, res) => {
    res.sendFile(path.join(__dirname, file));
  });
});

// Serve index.html for the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/user', require('./routes/user'));
app.use('/api/products', require('./routes/product'));
app.use('/api/orders', require('./routes/order'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/payments', require('./routes/payment'));
app.use('/api/deliveries', require('./routes/delivery'));
app.use('/api/expenses', require('./routes/expense'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/recommendations', require('./routes/recommendation'));
app.use('/api/coupons', require('./routes/coupon'));

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ msg: 'Route not found' });
});

// Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Connect to database and start server
const startServer = async () => {
  try {
    // Test database connection
    const [rows] = await db.query('SELECT 1');
    console.log('Database connection established successfully');

    app.listen(PORT, () => {
      console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to connect to the database:', error.message);
    process.exit(1);
  }
};

startServer();