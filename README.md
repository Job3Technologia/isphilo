# Iphilo Fragrance - Full-Stack Website & CRM

A premium, modern, and database-driven e-commerce platform for Iphilo Fragrance, built with **Node.js, Express, and MySQL**.

## 🚀 Features

### Public Website
- **Luxury Home Page**: Featured products, latest arrivals, and best sellers.
- **Product Catalog**: Full shop with filtering by category and sorting.
- **Product Details**: Fragrance notes, image gallery, and customer reviews.
- **Shopping Cart**: Real-time updates and persistence.
- **Secure Checkout**: Support for Card payments (Yoco) and EFT.
- **Customer Dashboard**: Order history, profile management, and wishlist.
- **Order Tracking**: Track status without logging in.

### Admin System
- **Comprehensive Dashboard**: Real-time sales statistics and low-stock alerts.
- **Product Management**: Add, edit, and delete products.
- **Order Management**: Update statuses and verify payments.
- **CRM / Customer Management**: View customer profiles and activity.
- **Expense Tracking**: Manage business expenses.

## 🛠️ Technology Stack
- **Backend**: Node.js, Express
- **Database**: MySQL 5.7+
- **Frontend**: HTML5, CSS3, JavaScript (Modern ES6+)
- **Icons**: Font Awesome 6
- **Fonts**: Montserrat & Cormorant Garamond

## 📂 Project Structure
```bash
/iphilo-fragrance/
├── server.js             # Entry point
├── /controllers/         # Request handlers
├── /models/              # Database models
├── /routes/              # API endpoints
├── /middleware/          # Custom middleware (Auth, Upload, etc.)
├── /config/              # Configuration (DB connection)
├── /assets/              # Static assets (CSS, JS)
├── /Images/              # Product images
├── /database/            # SQL scripts
└── *.html                # Frontend pages
```

## 🔧 Installation Instructions (Local Setup)

1. **Prerequisites**: Install [Node.js](https://nodejs.org/) and [MySQL](https://www.mysql.com/).
2. **Database Setup**:
   - Create a database named `your_modern_app_db`.
   - Import `database/database.sql` to create tables.
   - Import `database/seed.sql` to populate sample data.
3. **Configuration**:
   - Rename `.env.example` to `.env` (if provided) or edit `.env`.
   - Update `DB_HOST`, `DB_USER`, `DB_PASSWORD`, and `DB_NAME`.
4. **Install Dependencies**:
   ```bash
   npm install
   ```
5. **Run the App**:
   ```bash
   npm run dev
   ```
6. **Access**:
   - **Public Site**: `http://localhost:5000`
   - **Admin Portal**: `http://localhost:5000/admin/dashboard.html`
   - **Admin Login**: Use credentials from `seed.sql`.

## 🛡️ Security Features
- **JWT Authentication**: Secure API access.
- **Helmet**: Security headers.
- **Rate Limiting**: Prevent brute-force attacks.
- **Bcrypt**: Secure password hashing.

## 📝 Maintenance
- **Images**: Add new product images to the `Images/` folder.
- **Uploads**: User-uploaded files (like payment proof) are stored in `uploads/`.

---
*Established 29 March 2018*
