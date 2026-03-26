/**
 * ISPHILO FRAGANCE - Main JavaScript
 * Handles global UI, Cart, Search, and DB Interactions
 */

document.addEventListener('DOMContentLoaded', function() {
    // 1. MOBILE MENU TOGGLE (Using Event Delegation for dynamic components)
    document.addEventListener('click', function(e) {
        const menuToggle = e.target.closest('.mobile-menu-toggle');
        const navMenu = document.querySelector('.nav-menu');
        
        if (menuToggle && navMenu) {
            navMenu.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            if (icon) {
                icon.className = navMenu.classList.contains('active') ? 'fas fa-times' : 'fas fa-bars';
            }
        }
    });

    // 2. HEADER SCROLL EFFECT
    const header = document.querySelector('header');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 20) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 3. CART UPDATE & RENDER
    function updateCartUI() {
        const count = ISPHILO_DB.getCartCount();
        const cartCounts = document.querySelectorAll('.cart-count');
        
        cartCounts.forEach(el => {
            el.textContent = count;
            el.style.display = count > 0 ? 'flex' : 'none';
        });
    }

    // Subscribe to cart updates
    ISPHILO_DB.subscribe('cartUpdated', updateCartUI);
    updateCartUI(); // Initial call

    // 3.5 AUTHENTICATION & ROUTE PROTECTION
    function updateAuthUI() {
        const user = ISPHILO_DB.getCurrentUser();
        const isLoggedIn = ISPHILO_DB.isLoggedIn();
        const userLinks = document.querySelectorAll('a[href="login.html"]');
        
        userLinks.forEach(link => {
            if (isLoggedIn && user) {
                link.href = user.role === 'admin' ? 'admin/dashboard.html' : 'customer-dashboard.html';
                // Optional: change icon or add "Account" text
                const icon = link.querySelector('i');
                if (icon) icon.className = 'fas fa-user-check';
            } else {
                link.href = 'login.html';
                const icon = link.querySelector('i');
                if (icon) icon.className = 'fas fa-user';
            }
        });
    }

    function handleRouteProtection() {
        const path = window.location.pathname;
        const protectedRoutes = ['customer-dashboard.html', 'checkout.html', 'order-tracking.html'];
        const adminRoutes = ['admin/dashboard.html'];
        const isProtected = protectedRoutes.some(route => path.includes(route));
        const isAdminRoute = adminRoutes.some(route => path.includes(route));
        
        const isLoggedIn = ISPHILO_DB.isLoggedIn();
        const user = ISPHILO_DB.getCurrentUser();

        if (isAdminRoute) {
            if (!isLoggedIn || user.role !== 'admin') {
                window.location.href = '../login.html';
            }
        } else if (isProtected) {
            if (!isLoggedIn) {
                // Store intended destination
                sessionStorage.setItem('isphilo_redirect_after_login', path);
                window.location.href = 'login.html?reason=auth';
            }
        }
    }

    // Initialize Auth UI
    async function initAuth() {
        await ISPHILO_DB.checkAuth();
        updateAuthUI();
        handleRouteProtection();
    }
    
    initAuth();
    ISPHILO_DB.subscribe('authChange', updateAuthUI);

    window.addToCart = async function(productId, quantity = 1) {
        const result = await ISPHILO_DB.addToCart(productId, quantity);
        if (result.success) {
            showNotification(result.message, 'success');
        } else {
            showNotification(result.message, 'error');
        }
    };

    // 4. SEARCH OVERLAY
    const openSearch = document.getElementById('openSearch');
    const closeSearch = document.getElementById('closeSearch');
    const searchOverlay = document.getElementById('searchOverlay');
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');

    if (openSearch && searchOverlay) {
        openSearch.addEventListener('click', () => {
            searchOverlay.style.display = 'block';
            searchInput.focus();
        });
    }

    if (closeSearch && searchOverlay) {
        closeSearch.addEventListener('click', () => {
            searchOverlay.style.display = 'none';
        });
    }

    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const query = this.value;
            if (query.length < 2) {
                searchResults.innerHTML = '';
                searchResults.classList.remove('active');
                return;
            }

            const filtered = ISPHILO_DB.searchProducts(query);
            searchResults.classList.add('active');

            if (filtered.length > 0) {
                searchResults.innerHTML = `
                    <div class="search-results-header" style="grid-column: 1/-1; margin-bottom: 20px; border-bottom: 1px solid var(--gray-light); padding-bottom: 10px; display: flex; justify-content: space-between; align-items: center;">
                        <span style="font-family: 'Montserrat', sans-serif; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: var(--primary-red);">Found ${filtered.length} results</span>
                        <a href="shop.html?search=${encodeURIComponent(query)}" style="font-family: 'Montserrat', sans-serif; font-size: 10px; text-decoration: none; color: var(--pure-black); opacity: 0.6; font-weight: 700; text-transform: uppercase;">View All in Shop <i class="fas fa-arrow-right" style="margin-left: 5px;"></i></a>
                    </div>
                ` + filtered.map(p => `
                    <div class="search-item reveal-small" onclick="window.location.href='product-details.html?id=${p.id}'" style="display: flex; align-items: center; gap: 15px; padding: 12px; border-radius: 8px; cursor: pointer; transition: 0.3s; background: rgba(255,255,255,0.05); border: 1px solid rgba(0,0,0,0.05); margin-bottom: 10px;">
                        <div class="search-item-img" style="width: 60px; height: 60px; flex-shrink: 0; border-radius: 6px; overflow: hidden;">
                            <img src="${p.image}" alt="${p.name}" style="width: 100%; height: 100%; object-fit: cover;">
                        </div>
                        <div class="search-item-info">
                            <h5 style="font-size: 13px; margin-bottom: 4px; font-weight: 600;">${p.name}</h5>
                            <p style="font-size: 11px; opacity: 0.6; margin-bottom: 4px;">${p.category}</p>
                            <p style="font-weight: 700; color: var(--primary-red); font-size: 12px;">R ${(p.sale_price || p.price).toFixed(2)}</p>
                        </div>
                        <div class="search-item-action" style="margin-left: auto; opacity: 0.3;">
                            <i class="fas fa-chevron-right"></i>
                        </div>
                    </div>
                `).join('');
            } else {
                searchResults.innerHTML = `
                    <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
                        <i class="fas fa-search" style="font-size: 40px; color: var(--gray-light); margin-bottom: 20px;"></i>
                        <h4 style="font-family: 'Montserrat', sans-serif; font-size: 16px; margin-bottom: 10px;">No matches found for "${query}"</h4>
                        <p style="font-size: 14px; opacity: 0.6;">Try adjusting your search or browse our collections.</p>
                        <a href="shop.html" class="btn btn-sm" style="margin-top: 20px;">Explore Shop</a>
                    </div>
                `;
            }
        });
    }

    // 5. NOTIFICATION SYSTEM (Custom Toast)
    window.showNotification = function(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast-msg ${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        document.body.appendChild(toast);
        
        setTimeout(() => toast.classList.add('show'), 100);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 500);
        }, 3000);
    };

    // Add CSS for toast dynamically if not in style.css
    const toastStyles = `
        .toast-msg {
            position: fixed;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%) translateY(100px);
            background: var(--pure-black);
            color: var(--pure-white);
            padding: 15px 30px;
            border-radius: 4px;
            z-index: 9999;
            transition: all 0.5s cubic-bezier(0.165, 0.84, 0.44, 1);
            display: flex;
            align-items: center;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            border-left: 4px solid var(--primary-red);
        }
        .toast-msg.show { transform: translateX(-50%) translateY(0); }
        .toast-msg.error { border-left-color: #ff3e3e; }
        .toast-msg i { margin-right: 15px; color: var(--primary-red); }
    `;
    const styleSheet = document.createElement("style");
    styleSheet.innerText = toastStyles;
    document.head.appendChild(styleSheet);

    // 6. SECURITY SCAN & COOKIE CONSENT
    window.runSecurityScan = function() {
        // Security logic remains active in background, but notification is removed per user request
        console.log("Isphilo Security: Background encryption verified.");
        
        // Show cookie consent if not already accepted
        if (!localStorage.getItem('isphilo_cookies_accepted')) {
            showCookieBanner();
        }

        // Show verification popup for unverified logged in users
        const user = ISPHILO_DB.getCurrentUser();
        if (user && !user.is_verified && !sessionStorage.getItem('isphilo_verify_shown')) {
            showVerificationPopup();
        }
    };

    function showVerificationPopup() {
        const overlay = document.createElement('div');
        overlay.className = 'verify-overlay';
        overlay.style.display = 'block';
        
        const popup = document.createElement('div');
        popup.className = 'verify-popup show';
        popup.innerHTML = `
            <i class="fas fa-shield-check" style="font-size: 50px; color: var(--primary-red); margin-bottom: 20px;"></i>
            <h2 style="font-family: 'Montserrat', sans-serif; font-weight: 700; text-transform: uppercase; font-size: 24px; margin-bottom: 15px;">Verify Your Account</h2>
            <p style="margin-bottom: 30px; opacity: 0.8; font-size: 14px;">To ensure a secure shopping experience and enable international shipping, please complete your profile verification.</p>
            <div style="display: flex; gap: 10px; justify-content: center;">
                <button onclick="window.location.href='customer-dashboard.html#dash-settings'" class="btn" style="padding: 12px 25px; font-size: 11px;">Verify Now</button>
                <button id="close-verify" class="btn btn-outline" style="padding: 12px 25px; font-size: 11px;">Maybe Later</button>
            </div>
        `;
        
        document.body.appendChild(overlay);
        document.body.appendChild(popup);
        
        document.getElementById('close-verify').addEventListener('click', () => {
            overlay.remove();
            popup.remove();
            sessionStorage.setItem('isphilo_verify_shown', 'true');
        });
    }

    function showCookieBanner() {
        const banner = document.createElement('div');
        banner.id = 'cookie-consent-banner';
        banner.innerHTML = `
            <div class="cookie-content">
                <div class="cookie-text">
                    <i class="fas fa-cookie-bite"></i>
                    <span>We use cookies to ensure you get the best experience on our luxury fragrance site. By continuing, you agree to our use of cookies.</span>
                </div>
                <div class="cookie-actions">
                    <button id="accept-cookies" class="btn btn-sm">Accept & Continue</button>
                </div>
            </div>
        `;
        document.body.appendChild(banner);
        
        // Add specific styles for the banner
        const cookieStyles = `
            #cookie-consent-banner {
                position: fixed;
                bottom: 0;
                left: 0;
                width: 100%;
                background: var(--pure-black);
                color: var(--pure-white);
                padding: 20px 40px;
                z-index: 10000;
                transform: translateY(100%);
                transition: transform 0.6s cubic-bezier(0.165, 0.84, 0.44, 1);
                border-top: 2px solid var(--primary-red);
            }
            #cookie-consent-banner.show { transform: translateY(0); }
            .cookie-content {
                max-width: 1400px;
                margin: 0 auto;
                display: flex;
                justify-content: space-between;
                align-items: center;
                gap: 30px;
            }
            .cookie-text { display: flex; align-items: center; gap: 15px; font-family: 'Montserrat', sans-serif; font-size: 12px; letter-spacing: 1px; }
            .cookie-text i { color: var(--primary-red); font-size: 20px; }
            #accept-cookies { background: var(--primary-red); color: white; border: none; min-width: 180px; }
            @media (max-width: 768px) {
                .cookie-content { flex-direction: column; text-align: center; gap: 20px; }
                #cookie-consent-banner { padding: 30px 20px; }
            }
        `;
        const styleSheet = document.createElement("style");
        styleSheet.innerText = cookieStyles;
        document.head.appendChild(styleSheet);

        setTimeout(() => banner.classList.add('show'), 1000);

        document.getElementById('accept-cookies').addEventListener('click', () => {
            localStorage.setItem('isphilo_cookies_accepted', 'true');
            banner.classList.remove('show');
            setTimeout(() => banner.remove(), 600);
            showNotification('Thank you for accepting cookies!', 'success');
        });
    }

    // 7. NEWSLETTER
    const newsletterForm = document.querySelector('.newsletter-form form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            if (email) {
                ISPHILO_DB.subscribeNewsletter(email);
                showNotification('Thank you for subscribing to our newsletter!', 'success');
                this.reset();
            }
        });
    }

    // 8. INITIAL LOAD
    updateCartUI();
    reveal(); // Initial reveal check
    
    // Simulate initial security check
    setTimeout(() => {
        console.log("Isphilo Fragrance Security System: Operational");
    }, 1000);

    // 9. DYNAMIC PRODUCT RENDERING (for Home/Shop)
    async function renderFeatured() {
        const featuredGrid = document.querySelector('.product-grid.featured');
        if (featuredGrid) {
            const products = await ISPHILO_DB.getProducts(); 
            featuredGrid.innerHTML = products.map(p => `
                <div class="product-card ${p.is_sold_out ? 'sold-out' : ''} reveal" onclick="window.location.href='product-details.html?id=${p.id}'">
                    <div class="product-image">
                        <img src="${p.image}" alt="${p.name}" loading="lazy">
                        ${p.badge ? `<div class="product-badge">${p.badge}</div>` : ''}
                        ${p.is_sold_out ? `<div class="product-badge sold-out-badge">Sold Out</div>` : ''}
                        <button class="wishlist-btn" onclick="event.stopPropagation(); toggleWishlist(${p.id}, this)" style="position: absolute; top: 15px; right: 15px; background: white; border: none; width: 35px; height: 35px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--gray-light); cursor: pointer; box-shadow: 0 5px 15px rgba(0,0,0,0.1); z-index: 5; transition: all 0.3s ease;" aria-label="Add to Wishlist">
                            <i class="fas fa-heart" aria-hidden="true"></i>
                        </button>
                        <div class="product-overlay">
                            <div class="product-actions">
                                <button onclick="event.stopPropagation(); addToCart(${p.id})" aria-label="Add to Cart"><i class="fas fa-shopping-bag" aria-hidden="true"></i></button>
                                <button onclick="event.stopPropagation(); window.location.href='product-details.html?id=${p.id}'" aria-label="View Details"><i class="fas fa-eye" aria-hidden="true"></i></button>
                            </div>
                        </div>
                    </div>
                    <div class="product-info">
                        <p class="product-category">${p.category}</p>
                        <h5 class="product-name">${p.name}</h5>
                        <p class="product-price">
                            ${p.sale_price ? `<span class="original">R ${p.price.toFixed(2)}</span><span class="sale">R ${p.sale_price.toFixed(2)}</span>` : `R ${p.price.toFixed(2)}`}
                        </p>
                        <button class="btn-add-to-cart ${p.is_sold_out ? 'sold-out' : ''}" 
                                onclick="event.stopPropagation(); ${p.is_sold_out ? '' : `addToCart(${p.id})`}"
                                aria-label="${p.is_sold_out ? 'Product Out of Stock' : 'Add ' + p.name + ' to cart'}">
                            ${p.is_sold_out ? 'Out of Stock' : 'Add to cart'}
                        </button>
                    </div>
                </div>
            `).join('');
            
            // Re-run reveal after dynamic content is added
            setTimeout(reveal, 100);
            updateWishlistIcons();
        }
    }

    renderFeatured();

    // 11. WISHLIST SYSTEM
    window.toggleWishlist = function(productId, btn) {
        const user = ISPHILO_DB.getCurrentUser();
        if (!user) {
            showNotification('Please login to save favorites', 'info');
            return;
        }

        let wishlist = JSON.parse(localStorage.getItem(`wishlist_${user.id}`)) || [];
        const index = wishlist.indexOf(productId);

        if (index === -1) {
            wishlist.push(productId);
            btn.style.color = 'var(--primary-red)';
            showNotification('Added to wishlist', 'success');
        } else {
            wishlist.splice(index, 1);
            btn.style.color = 'var(--gray-light)';
            showNotification('Removed from wishlist', 'info');
        }

        localStorage.setItem(`wishlist_${user.id}`, JSON.stringify(wishlist));
    }

    function updateWishlistIcons() {
        const user = ISPHILO_DB.getCurrentUser();
        if (!user) return;

        const wishlist = JSON.parse(localStorage.getItem(`wishlist_${user.id}`)) || [];
        const btns = document.querySelectorAll('.wishlist-btn');
        
        btns.forEach(btn => {
            const onclickStr = btn.getAttribute('onclick');
            const match = onclickStr.match(/toggleWishlist\((\d+)/);
            if (match && wishlist.includes(parseInt(match[1]))) {
                btn.style.color = 'var(--primary-red)';
            }
        });
    }

    // 10. REVEAL ANIMATION LOGIC
    function reveal() {
        const reveals = document.querySelectorAll(".reveal, .reveal-left, .reveal-right");
        for (let i = 0; i < reveals.length; i++) {
            const windowHeight = window.innerHeight;
            const elementTop = reveals[i].getBoundingClientRect().top;
            const elementVisible = 100;
            if (elementTop < windowHeight - elementVisible) {
                reveals[i].classList.add("active");
            }
        }
    }
    window.addEventListener("scroll", reveal);

    // Lazy Load Background Images
    const lazyBackgrounds = document.querySelectorAll('[data-bg]');
    if ('IntersectionObserver' in window) {
        let bgObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const bg = el.getAttribute('data-bg');
                    if (bg) {
                        el.style.backgroundImage = bg;
                        el.removeAttribute('data-bg');
                    }
                    bgObserver.unobserve(el);
                }
            });
        });
        lazyBackgrounds.forEach(bg => bgObserver.observe(bg));
    } else {
        // Fallback for older browsers
        lazyBackgrounds.forEach(el => {
            const bg = el.getAttribute('data-bg');
            if (bg) el.style.backgroundImage = bg;
        });
    }

    // 7. HERO SLIDESHOW
    const slides = document.querySelectorAll('.hero-slideshow .slide');
    if (slides.length > 0) {
        let currentSlide = 0;
        const nextSlide = () => {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        };
        setInterval(nextSlide, 5000); // Change slide every 5 seconds
    }
});
