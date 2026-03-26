/**
 * ISPHILO FRAGANCE - Client-side Database System
 * Powered by localStorage for persistent data without PHP
 */

const ISPHILO_DB = {
    // API CONFIG
    apiBase: window.location.origin + '/api', // Dynamic API base
    useAPI: true, // Set to true to use the Node.js/MySQL backend

    // Initial data to seed if localStorage is empty
    initialData: {
        products: [
            // For Her — 30ml | R200
            { id: 101, name: "Isphilo Her", category: "For Her", price: 200.00, sale_price: null, image: "Images/IMG-20260316-WA0035.jpg", badge: "Classic", description: "Our signature 30ml essence for her.", is_sold_out: false, size: "30ml" },
            { id: 102, name: "Pink Lady", category: "For Her", price: 200.00, sale_price: null, image: "Images/IMG-20260316-WA0037.jpg", badge: "Popular", description: "Elegant and feminine 30ml fragrance.", is_sold_out: false, size: "30ml" },
            { id: 103, name: "Nude", category: "For Her", price: 200.00, sale_price: null, image: "Images/IMG-20260316-WA0039.jpg", badge: "", description: "Subtle and sophisticated 30ml scent.", is_sold_out: false, size: "30ml" },
            { id: 104, name: "Rose", category: "For Her", price: 200.00, sale_price: null, image: "Images/IMG-20260316-WA0041.jpg", badge: "", description: "Timeless 30ml rose essence.", is_sold_out: false, size: "30ml" },
            { id: 105, name: "Secret", category: "For Her", price: 200.00, sale_price: null, image: "Images/IMG-20260316-WA0043.jpg", badge: "New", description: "Mysterious 30ml fragrance.", is_sold_out: false, size: "30ml" },
            { id: 106, name: "Deeply I Love", category: "For Her", price: 200.00, sale_price: null, image: "Images/IMG-20260316-WA0044.jpg", badge: "Romantic", description: "Enchanting 30ml romantic scent.", is_sold_out: false, size: "30ml" },

            // For Him — 50ml | R300
            { id: 201, name: "Isphilo Soft", category: "For Him", price: 300.00, sale_price: null, image: "Images/IMG-20260316-WA0036.jpg", badge: "Best Seller", description: "Signature 50ml soft masculine scent.", is_sold_out: false, size: "50ml" },
            { id: 202, name: "Oud Wood", category: "For Him", price: 300.00, sale_price: null, image: "Images/IMG-20260316-WA0038.jpg", badge: "Intense", description: "Rich 50ml woody fragrance.", is_sold_out: false, size: "50ml" },
            { id: 203, name: "Intimate", category: "For Him", price: 300.00, sale_price: null, image: "Images/IMG-20260316-WA0040.jpg", badge: "", description: "Refined 50ml intimate scent.", is_sold_out: false, size: "50ml" },
            { id: 204, name: "Montale Oud", category: "For Him", price: 300.00, sale_price: null, image: "Images/IMG-20260316-WA0042.jpg", badge: "", description: "Luxurious 50ml oud blend.", is_sold_out: false, size: "50ml" },
            { id: 205, name: "White Oud", category: "For Him", price: 300.00, sale_price: null, image: "Images/IMG-20260316-WA0045.jpg", badge: "", description: "Clean 50ml white oud essence.", is_sold_out: false, size: "50ml" },
            { id: 206, name: "Oud Intense", category: "For Him", price: 300.00, sale_price: null, image: "Images/IMG-20260316-WA0046.jpg", badge: "Limited", description: "Powerful 50ml intense oud.", is_sold_out: false, size: "50ml" },

            // Limited & Exclusive Editions
            { id: 301, name: "Red Limited Edition", category: "Limited Edition", price: 500.00, sale_price: null, image: "Images/IMG-20260316-WA0047.jpg", badge: "Limited", description: "Exclusive 50ml Red Edition.", is_sold_out: false, size: "50ml" },
            { id: 302, name: "White Limited Edition", category: "Limited Edition", price: 500.00, sale_price: null, image: "Images/IMG-20260316-WA0048.jpg", badge: "Limited", description: "Exclusive 50ml White Edition.", is_sold_out: false, size: "50ml" },
            { id: 303, name: "Music Limited Edition", category: "Limited Edition", price: 500.00, sale_price: null, image: "Images/IMG-20260316-WA0049.jpg", badge: "Limited", description: "Exclusive 50ml Music Edition.", is_sold_out: false, size: "50ml" },
            { id: 304, name: "Ladies Pink Limited Edition", category: "Limited Edition", price: 500.00, sale_price: null, image: "Images/IMG-20260316-WA0050.jpg", badge: "Limited", description: "Exclusive 50ml Pink Edition for Ladies.", is_sold_out: false, size: "50ml" },
            { id: 401, name: "Isphilo Oudh Exclusive", category: "Exclusive", price: 1000.00, sale_price: null, image: "Images/IMG-20260316-WA0051.jpg", badge: "Prestige", description: "Our most prestigious 50ml Oudh Exclusive.", is_sold_out: false, size: "50ml" }
        ],
        users: [
            { 
                id: 1, 
                name: "Admin User", 
                email: "info@isphilofragrance.com", 
                password: "admin", 
                role: "admin", 
                balance: 5000.00, 
                orders: [], 
                avatar: "Images/LOGO.jpg",
                phone: "+27 123 456 789",
                country: "South Africa",
                is_verified: true,
                verification_doc: null
            },
            { 
                id: 2, 
                name: "Demo Customer", 
                email: "demo@isphilofragrance.com", 
                password: "demo", 
                role: "customer", 
                balance: 1500.00, 
                orders: [], 
                avatar: null,
                phone: "+27 76 683 4283",
                country: "South Africa",
                is_verified: true,
                verification_doc: null,
                created_at: "2026-03-19T10:00:00.000Z"
            }
        ],
        orders: [],
        newsletter: [],
        cart: [],
        coupons: [
            { code: "WELCOME10", discount: 0.10, type: "percentage" },
            { code: "ISPHILO20", discount: 0.20, type: "percentage" },
            { code: "FIXED50", discount: 50.00, type: "fixed" }
        ]
    },

    // Event Listeners
    listeners: {},

    subscribe(event, callback) {
        if (!this.listeners[event]) this.listeners[event] = [];
        this.listeners[event].push(callback);
    },

    notify(event, data) {
        if (this.listeners[event]) {
            this.listeners[event].forEach(callback => callback(data));
        }
    },

    // Initialize DB
    init() {
        // Versioning check (simple)
        const currentVersion = "1.4";
        const savedVersion = localStorage.getItem('isphilo_db_version');

        if (savedVersion !== currentVersion) {
            console.log("Updating ISPHILO Database schema...");
            // Force update products and users for new demo
            localStorage.setItem('isphilo_products', JSON.stringify(this.initialData.products));
            localStorage.setItem('isphilo_users', JSON.stringify(this.initialData.users));
            localStorage.setItem('isphilo_db_version', currentVersion);
        }

        if (!localStorage.getItem('isphilo_products')) {
            localStorage.setItem('isphilo_products', JSON.stringify(this.initialData.products));
        }
        if (!localStorage.getItem('isphilo_users')) {
            localStorage.setItem('isphilo_users', JSON.stringify(this.initialData.users));
        }
        if (!localStorage.getItem('isphilo_orders')) {
            localStorage.setItem('isphilo_orders', JSON.stringify(this.initialData.orders));
        }
        if (!localStorage.getItem('isphilo_newsletter')) {
            localStorage.setItem('isphilo_newsletter', JSON.stringify(this.initialData.newsletter));
        }
        if (!localStorage.getItem('isphilo_cart')) {
            localStorage.setItem('isphilo_cart', JSON.stringify(this.initialData.cart));
        }
        if (!localStorage.getItem('isphilo_coupons')) {
            localStorage.setItem('isphilo_coupons', JSON.stringify(this.initialData.coupons));
        }
        if (!localStorage.getItem('isphilo_messages')) {
            localStorage.setItem('isphilo_messages', JSON.stringify([]));
        }
        console.log("ISPHILO Database Initialized (v" + currentVersion + ")");
    },

    // Helper methods
    getData(key) {
        try {
            return JSON.parse(localStorage.getItem(`isphilo_${key}`)) || [];
        } catch (e) {
            console.error("Error reading from ISPHILO DB:", e);
            return [];
        }
    },

    setData(key, data) {
        try {
            localStorage.setItem(`isphilo_${key}`, JSON.stringify(data));
            this.notify(key + 'Updated', data);
        } catch (e) {
            console.error("Error writing to ISPHILO DB:", e);
        }
    },

    // Search & Filter
    searchProducts(query, category = null, sort = 'default') {
        let products = this.getProducts();
        
        if (query) {
            query = query.toLowerCase();
            products = products.filter(p => 
                p.name.toLowerCase().includes(query) || 
                p.description.toLowerCase().includes(query) ||
                p.category.toLowerCase().includes(query)
            );
        }

        if (category && category !== 'All Fragrances') {
            products = products.filter(p => p.category === category);
        }

        switch (sort) {
            case 'price-low':
                products.sort((a, b) => (a.sale_price || a.price) - (b.sale_price || b.price));
                break;
            case 'price-high':
                products.sort((a, b) => (b.sale_price || b.price) - (a.sale_price || a.price));
                break;
            case 'newest':
                products.sort((a, b) => b.id - a.id);
                break;
        }

        return products;
    },

    // Product methods
    validateCoupon(code) {
        const coupons = this.getData('coupons');
        return coupons.find(c => c.code.toUpperCase() === code.toUpperCase());
    },

    // Product methods
    async getProducts(featuredOnly = false) {
        if (this.useAPI) {
            try {
                const endpoint = featuredOnly ? '/products/featured' : '/products';
                const res = await fetch(`${this.apiBase}${endpoint}`);
                return await res.json();
            } catch (e) {
                console.error("API Error, falling back to local storage:", e);
                return featuredOnly ? this.getData('products').filter(p => p.badge === 'Popular' || p.badge === 'Best Seller') : this.getData('products');
            }
        }
        return featuredOnly ? this.getData('products').filter(p => p.badge === 'Popular' || p.badge === 'Best Seller') : this.getData('products');
    },

    async saveProduct(product) {
        const products = await this.getProducts();
        if (product.id) {
            const index = products.findIndex(p => p.id === product.id);
            if (index !== -1) products[index] = product;
        } else {
            product.id = Date.now();
            products.push(product);
        }
        this.setData('products', products);
        return product;
    },

    async deleteProduct(id) {
        const products = (await this.getProducts()).filter(p => p.id !== id);
        this.setData('products', products);
    },

    // Session Management
    setSession(token, user) {
        localStorage.setItem('isphilo_token', token);
        localStorage.setItem('isphilo_current_user', JSON.stringify(user));
        this.notify('authChange', { isLoggedIn: true, user });
    },

    clearSession() {
        localStorage.removeItem('isphilo_token');
        localStorage.removeItem('isphilo_current_user');
        this.notify('authChange', { isLoggedIn: false, user: null });
    },

    getToken() {
        return localStorage.getItem('isphilo_token');
    },

    isLoggedIn() {
        return !!this.getToken();
    },

    async checkAuth() {
        if (!this.getToken()) return false;
        try {
            const res = await this.fetchWithAuth('/user/profile');
            if (res.ok) {
                const user = await res.json();
                localStorage.setItem('isphilo_current_user', JSON.stringify(user));
                return true;
            }
            return false;
        } catch (e) {
            return false;
        }
    },

    // API Request Helper
    async fetchWithAuth(endpoint, options = {}) {
        const token = this.getToken();
        const headers = {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
            ...(options.headers || {})
        };

        const res = await fetch(`${this.apiBase}${endpoint}`, {
            ...options,
            headers
        });

        // Handle token expiration
        if (res.status === 401) {
            this.clearSession();
            // Optional: redirect to login if not on public page
            if (!window.location.pathname.includes('login.html')) {
                window.location.href = 'login.html?expired=true';
            }
            throw new Error('Session expired. Please login again.');
        }

        return res;
    },

    // User Auth Methods
    async apiLogin(email, password) {
        try {
            const res = await fetch(`${this.apiBase}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            
            if (res.ok) {
                // Check if verification is needed
                if (data.redirect === 'verify-otp.html') {
                    sessionStorage.setItem('isphilo_verify_email', data.email);
                    window.location.href = data.redirect;
                    return { success: true, redirect: true };
                }
                this.setSession(data.accessToken, data.user);
                return { success: true, user: data.user };
            } else {
                return { success: false, message: data.msg || 'Login failed' };
            }
        } catch (e) {
            console.error('Login error:', e);
            return { success: false, message: 'Server connection failed' };
        }
    },

    async apiRegister(userData) {
        try {
            const res = await fetch(`${this.apiBase}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });
            const data = await res.json();
            
            if (res.ok) {
                if (data.redirect === 'verify-otp.html') {
                    sessionStorage.setItem('isphilo_verify_email', data.email);
                    window.location.href = data.redirect;
                    return { success: true, redirect: true };
                }
                return { success: true, message: data.msg };
            } else {
                return { success: false, message: data.msg || 'Registration failed' };
            }
        } catch (e) {
            console.error('Registration error:', e);
            return { success: false, message: 'Server connection failed' };
        }
    },

    async verifyOTP(email, otp) {
        try {
            const res = await fetch(`${this.apiBase}/auth/verify-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp })
            });
            const data = await res.json();
            if (res.ok) {
                this.setSession(data.accessToken, data.user);
                sessionStorage.removeItem('isphilo_verify_email');
                return { success: true, user: data.user };
            } else {
                return { success: false, message: data.msg || 'Verification failed' };
            }
        } catch (e) {
            return { success: false, message: 'Server connection failed' };
        }
    },

    async resendOTP(email) {
        try {
            const res = await fetch(`${this.apiBase}/auth/resend-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            const data = await res.json();
            if (res.ok) {
                return { success: true, message: data.msg };
            } else {
                return { success: false, message: data.msg || 'Failed to resend' };
            }
        } catch (e) {
            return { success: false, message: 'Server connection failed' };
        }
    },

    // User methods
    getUsers() {
        return this.getData('users');
    },

    getCurrentUser() {
        try {
            return JSON.parse(localStorage.getItem('isphilo_current_user'));
        } catch (e) {
            return null;
        }
    },

    // Update existing login/register to use API if useAPI is true
    async login(email, password) {
        if (this.useAPI) return await this.apiLogin(email, password);
        
        // Fallback to mock local storage (existing logic)
        const users = this.getUsers();
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
            this.setSession('mock_token_' + Date.now(), user);
            return { success: true, user };
        }
        return { success: false, message: "Invalid credentials" };
    },

    logout() {
        this.clearSession();
        window.location.href = 'login.html';
    },

    async register(name, email, password, phone = "", country = "South Africa") {
        if (this.useAPI) {
            return await this.apiRegister({ 
                first_name: name.split(' ')[0], 
                last_name: name.split(' ')[1] || '', 
                email, 
                password, 
                phone_number: phone, 
                username: email.split('@')[0] 
            });
        }
        
        // Fallback to mock local storage (existing logic)
        const users = this.getUsers();
        if (users.find(u => u.email === email)) return { success: false, message: "Email already exists" };
        
        const newUser = {
            id: Date.now(),
            name,
            email,
            password,
            role: "customer",
            balance: 0.00,
            orders: [],
            avatar: "Images/LOGO.jpg",
            phone,
            country,
            is_verified: false,
            verification_doc: null,
            created_at: new Date().toISOString()
        };
        users.push(newUser);
        this.setData('users', users);
        return { success: true, user: newUser };
    },

    updateUser(updatedUser) {
        const users = this.getUsers();
        const index = users.findIndex(u => u.id === updatedUser.id);
        if (index !== -1) {
            users[index] = updatedUser;
            this.setData('users', users);
            // Update session if it's the current user
            const currentUser = this.getCurrentUser();
            if (currentUser && currentUser.id === updatedUser.id) {
                sessionStorage.setItem('isphilo_current_user', JSON.stringify(updatedUser));
            }
            return true;
        }
        return false;
    },

    resetPassword(email, newPassword) {
        const users = this.getUsers();
        const user = users.find(u => u.email === email);
        if (user) {
            user.password = newPassword;
            this.updateUser(user);
            return { success: true, message: "Password updated successfully" };
        }
        return { success: false, message: "Email not found" };
    },

    // Cart methods
    getCart() {
        return this.getData('cart');
    },

    getCartCount() {
        const cart = this.getCart();
        return cart.reduce((sum, item) => sum + (parseInt(item.quantity) || 0), 0);
    },

    getCartTotal() {
        const cart = this.getCart();
        return cart.reduce((sum, item) => sum + (parseFloat(item.price) * (parseInt(item.quantity) || 0)), 0);
    },

    async addToCart(productId, quantity = 1) {
        const products = await this.getProducts();
        const product = products.find(p => p.id == productId);
        
        if (!product) {
            console.error("Product not found:", productId);
            return { success: false, message: "Product not found." };
        }
        
        if (product.is_sold_out) {
            return { success: false, message: "This product is currently out of stock." };
        }

        let cart = this.getCart();
        const existingItem = cart.find(item => item.id == productId);
        const qtyToAdd = Math.max(1, parseInt(quantity) || 1);
        
        if (existingItem) {
            existingItem.quantity += qtyToAdd;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: parseFloat(product.sale_price || product.price),
                image: product.image,
                quantity: qtyToAdd,
                added_at: new Date().toISOString()
            });
        }
        
        this.setData('cart', cart);
        return { success: true, message: "Product added to cart!" };
    },

    removeFromCart(productId) {
        let cart = this.getCart().filter(item => item.id != productId);
        this.setData('cart', cart);
    },

    updateCartQuantity(productId, quantity) {
        let cart = this.getCart();
        const item = cart.find(item => item.id == productId);
        if (item) {
            item.quantity = Math.max(1, parseInt(quantity));
            this.setData('cart', cart);
            return true;
        }
        return false;
    },

    clearCart() {
        this.setData('cart', []);
    },

    // Order methods
    getOrders() {
        return this.getData('orders');
    },

    placeOrder(customerDetails, paymentDetails) {
        const cart = this.getCart();
        if (cart.length === 0) return false;

        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const order = {
            id: 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
            customer: customerDetails,
            items: cart,
            total: total,
            status: 'Pending',
            payment: paymentDetails.type, // e.g., 'Credit Card'
            date: new Date().toISOString()
        };

        const orders = this.getOrders();
        orders.push(order);
        this.setData('orders', orders);

        // If logged in, add to user's history
        const currentUser = this.getCurrentUser();
        if (currentUser) {
            currentUser.orders.push(order.id);
            this.updateUser(currentUser);
        }

        this.clearCart();
        return order;
    },

    updateOrder(orderId, newStatus, tracking_number = null) {
        const orders = this.getOrders();
        const index = orders.findIndex(o => o.id === orderId);
        if (index !== -1) {
            orders[index].status = newStatus;
            if (tracking_number) orders[index].tracking_number = tracking_number;
            this.setData('orders', orders);
            
            // Send alert to user notifications
            const user = this.getUsers().find(u => u.email === orders[index].customer.email);
            if (user) {
                this.addNotification(user.id, `Order Update: Your order #${orderId} is now ${newStatus}.`, "order");
            }
            return true;
        }
        return false;
    },

    // Message methods
    async getConversation(userId1, userId2) {
        if (this.useAPI) {
            const res = await this.fetchWithAuth(`/messages/conversation/${userId1}/${userId2}`);
            return await res.json();
        }
        const messages = this.getData('messages');
        return messages.filter(m => 
            (m.sender_id == userId1 && m.receiver_id == userId2) || 
            (m.sender_id == userId2 && m.receiver_id == userId1)
        ).sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    },

    async sendMessage(sender_id, receiver_id, message, sender_type = 'customer', order_id = null) {
        const msgData = {
            id: Date.now(),
            sender_id,
            receiver_id,
            message,
            sender_type,
            order_id,
            is_read: 0,
            created_at: new Date().toISOString()
        };

        if (this.useAPI) {
            const res = await this.fetchWithAuth('/messages', {
                method: 'POST',
                body: JSON.stringify(msgData)
            });
            return await res.json();
        }

        const messages = this.getData('messages');
        messages.push(msgData);
        this.setData('messages', messages);
        return { success: true, messageId: msgData.id };
    },

    async getStats(userId) {
        if (this.useAPI) {
            const res = await this.fetchWithAuth(`/dashboard/stats/${userId}`);
            return await res.json();
        }
        
        const orders = this.getOrders().filter(o => {
            const user = this.getCurrentUser();
            return o.customer.email === user.email;
        });

        const totalSpent = orders.reduce((sum, o) => sum + o.total, 0);
        
        // Simple top category logic
        const cats = {};
        orders.forEach(o => {
            o.items.forEach(item => {
                // We'd need to find the product category here
                // For mock, just use a dummy or skip
            });
        });

        return {
            total_orders: orders.length,
            total_spent: totalSpent,
            top_category: "Exclusive Oudh" // Mock
        };
    },

    // Notification methods
    getNotifications(userId) {
        const allNotifs = JSON.parse(localStorage.getItem('isphilo_notifications') || '{}');
        return allNotifs[userId] || [];
    },

    addNotification(userId, message, type = "general") {
        const allNotifs = JSON.parse(localStorage.getItem('isphilo_notifications') || '{}');
        if (!allNotifs[userId]) allNotifs[userId] = [];
        
        allNotifs[userId].push({
            id: Date.now(),
            message,
            type,
            date: new Date().toISOString(),
            read: false
        });
        
        localStorage.setItem('isphilo_notifications', JSON.stringify(allNotifs));
    },

    markNotificationsRead(userId) {
        const allNotifs = JSON.parse(localStorage.getItem('isphilo_notifications') || '{}');
        if (allNotifs[userId]) {
            allNotifs[userId].forEach(n => n.read = true);
            localStorage.setItem('isphilo_notifications', JSON.stringify(allNotifs));
        }
    },

    // Newsletter methods
    subscribeNewsletter(email) {
        const newsletter = this.getData('newsletter');
        if (!newsletter.includes(email)) {
            newsletter.push({
                email,
                date: new Date().toISOString()
            });
            this.setData('newsletter', newsletter);
            return true;
        }
        return false;
    }
};

// Initialize on load
ISPHILO_DB.init();
