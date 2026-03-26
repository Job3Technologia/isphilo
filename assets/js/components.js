/**
 * ISPHILO FRAGRANCE - Shared Components
 * This file dynamically injects the header and footer to reduce code duplication.
 */

const SHARED_COMPONENTS = {
    // Helper to get base path (e.g., if in /admin/, returns '../')
    getBasePath() {
        const path = window.location.pathname;
        const depth = (path.match(/\//g) || []).length;
        // Adjust for root cases and nested levels
        // Assuming standard structure where root files are at depth 1 or 2 depending on server config
        // A more reliable way is to check if we are in a subdirectory
        if (path.includes('/admin/')) return '../';
        return '';
    },

    getHeader() {
        const base = this.getBasePath();
        return `
        <div class="nav-container">
            <div style="display: flex; align-items: center;">
                <a href="${base}index.html" class="logo-container">
                    <img src="${base}Images/LOGO.jpg" alt="ISPHILO Logo" class="logo-img">
                    <div class="logo-text">Isphilo <span>Fragrance</span></div>
                </a>
            </div>
            
            <ul class="nav-menu">
                <li><a href="${base}index.html">Home</a></li>
                <li><a href="${base}shop.html">Shop</a></li>
                <li><a href="${base}specials.html">Specials</a></li>
                <li><a href="${base}about.html">About</a></li>
                <li><a href="${base}reviews.html">Reviews</a></li>
                <li><a href="${base}contact.html">Contact</a></li>
            </ul>
            
            <div class="header-actions">
                <a href="${base}wishlist.html" class="header-action-box" title="Wishlist">
                    <i class="far fa-heart"></i>
                </a>
                
                <a href="${base}cart.html" class="cart-pill" aria-label="View Cart">
                    <i class="fas fa-shopping-cart" aria-hidden="true"></i>
                    <span class="d-none d-md-inline">Cart</span>
                    <div class="cart-count-badge cart-count" aria-live="polite">0</div>
                </a>
                
                <div class="header-action-box d-none d-md-flex" id="openSearch" aria-label="Open Search" role="button" tabindex="0">
                    <i class="fas fa-search" aria-hidden="true"></i>
                </div>
                
                <a href="${base}login.html" class="header-action-box" style="background: var(--primary-red); color: white;" aria-label="Login or Account">
                    <i class="fas fa-user" aria-hidden="true"></i>
                </a>

                <div class="header-action-box mobile-menu-toggle d-lg-none" aria-label="Toggle Mobile Menu" role="button" tabindex="0">
                    <i class="fas fa-bars" aria-hidden="true"></i>
                </div>
            </div>
        </div>
    `;
    },

    getFooter() {
        const base = this.getBasePath();
        return `
        <div class="container">
            <div class="footer-grid">
                <div class="footer-brand">
                    <a href="${base}index.html" class="footer-logo">
                        <img src="${base}Images/LOGO.jpg" alt="ISPHILO Logo">
                        <div class="logo-text">Isphilo <span>Fragrance</span></div>
                    </a>
                    <p class="footer-description">
                        Experience the essence of luxury. Crafting premium, long-lasting fragrances in the heart of Durban since 2018.
                    </p>
                    <div class="footer-social">
                        <a href="https://www.facebook.com/isphilo/" target="_blank" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a>
                        <a href="https://www.instagram.com/iqabunga_isphilo/" target="_blank" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
                        <a href="https://www.tiktok.com/@official_isphilo" target="_blank" aria-label="TikTok"><i class="fab fa-tiktok"></i></a>
                        <a href="https://wa.me/27766834283" target="_blank" aria-label="WhatsApp"><i class="fab fa-whatsapp"></i></a>
                    </div>
                </div>

                <div class="footer-nav">
                    <h4>Collections</h4>
                    <ul>
                        <li><a href="${base}shop.html?cat=For%20Her">For Her</a></li>
                        <li><a href="${base}shop.html?cat=For%20Him">For Him</a></li>
                        <li><a href="${base}shop.html?cat=Limited%20Edition">Limited Edition</a></li>
                        <li><a href="${base}shop.html?cat=Exclusive">Exclusive Oudh</a></li>
                    </ul>
                </div>

                <div class="footer-nav">
                    <h4>Customer Care</h4>
                    <ul>
                        <li><a href="${base}order-tracking.html">Track Order</a></li>
                        <li><a href="${base}shipping-policy.html">Shipping Policy</a></li>
                        <li><a href="${base}refund-policy.html">Refunds & Returns</a></li>
                        <li><a href="mailto:info@isphilofragrance.com">Email Us</a></li>
                    </ul>
                </div>

                <div class="footer-newsletter">
                    <h4>Newsletter</h4>
                    <p>Join the ISPHILO inner circle for exclusive offers and fragrance launches. Support: info@isphilofragrance.com</p>
                    <form id="newsletterForm" class="footer-form">
                        <div class="footer-input-group">
                            <input type="email" placeholder="Email Address" required aria-label="Email Address">
                            <button type="submit" aria-label="Subscribe">
                                <span>Subscribe</span>
                                <i class="fas fa-paper-plane"></i>
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <div class="footer-bottom">
                <div class="footer-copyright">
                    &copy; ${new Date().getFullYear()} ISPHILO FRAGRANCE. All Rights Reserved.
                </div>
                <div class="footer-legal">
                    <a href="${base}privacy.html">Privacy Policy</a>
                    <a href="${base}terms.html">Terms of Service</a>
                </div>
            </div>
        </div>
    `;
    },

    init() {
        const headerEl = document.getElementById('header');
        const footerEl = document.getElementById('footer');

        if (headerEl) {
            headerEl.innerHTML = this.getHeader();
            this.setActiveLink();
        }
        if (footerEl) {
            footerEl.innerHTML = this.getFooter();
        }
    },

    setActiveLink() {
        const base = this.getBasePath();
        const currentPath = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-menu a');
        navLinks.forEach(link => {
            const href = link.getAttribute('href').replace(base, '');
            if (href === currentPath) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
};

// Initialize shared components when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    SHARED_COMPONENTS.init();
});
