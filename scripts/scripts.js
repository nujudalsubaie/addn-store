//  ADDN STORE — scripts.js
//  Online Store Front-End JavaScript

"use strict";

// ─── State ───────────────────────────────────
let products = [];
let cart = JSON.parse(localStorage.getItem('ADDNCart')) || [];
let currentFilter = 'all';
let currentSort = 'default';
let isGridView = true;
let currentPage = 'home';
let wishlist = JSON.parse(localStorage.getItem('ADDNWishlist')) || [];

// ─── DOM References ───────────────────────────
const productGrid   = document.getElementById('productGrid');
const cartOverlay   = document.getElementById('cartOverlay');
const cartSidebar   = document.getElementById('cartSidebar');
const cartItemsEl   = document.getElementById('cartItems');
const cartCountBadge = document.getElementById('cartCount');
const toastContainer = document.getElementById('toastContainer');
const backToTopBtn  = document.getElementById('backToTop');
const hamburger     = document.getElementById('hamburger');
const navLinks      = document.getElementById('navLinks');
const resultCount   = document.getElementById('resultCount');
const sortSelect    = document.getElementById('sortSelect');
const searchInput   = document.getElementById('searchInput');
const navSearchInput = document.getElementById('navSearchInput');

// ─── Initialization ──────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    updateCartBadge();
    updateWishlistBadge();
    initScrollAnimations();
    initScrollBehavior();
    showPage('home');
});

// ─── Load Products ────────────────────────────
async function loadProducts() {
    try {
        const res = await fetch('data/products.json');
        products = await res.json();
    } catch {
        // Fallback inline data if fetch fails (e.g. file:// protocol)
        products = getInlineProducts();
    }
    renderProducts(products);
    updateResultCount(products.length);
}

function getInlineProducts() {
    return [
        { id:1, name:"Obsidian Chronograph", category:"watches",     price:349, originalPrice:499, rating:4.8, reviews:142, badge:"Sale",       description:"Precision-crafted timepiece with sapphire crystal glass and matte black ceramic case.",         image:"watch",     inStock:true  },
        { id:2, name:"ADDN Leather Jacket",  category:"apparel",     price:289, originalPrice:null,rating:4.9, reviews:87,  badge:"Bestseller",  description:"Full-grain genuine leather with asymmetric zip closure and interior pockets.",                  image:"jacket",    inStock:true  },
        { id:3, name:"Eclipse Headphones",   category:"electronics", price:199, originalPrice:249, rating:4.7, reviews:213, badge:"Sale",         description:"Active noise cancellation with 40hr battery life and titanium-reinforced headband.",            image:"headphones",inStock:true  },
        { id:4, name:"Void Ceramic Mug",     category:"home",        price:48,  originalPrice:null,rating:4.6, reviews:56,  badge:"New",          description:"Hand-thrown ceramic with matte black glaze and minimal embossed logo.",                         image:"mug",       inStock:true  },
        { id:5, name:"Carbon Fiber Wallet",  category:"accessories", price:79,  originalPrice:null,rating:4.5, reviews:199, badge:null,           description:"Ultra-slim RFID-blocking wallet holding up to 12 cards with quick-eject mechanism.",            image:"wallet",    inStock:true  },
        { id:6, name:"Midnight Fragrance",   category:"lifestyle",   price:125, originalPrice:null,rating:4.8, reviews:64,  badge:"Limited",      description:"Dark amber and black oud with sandalwood base notes. 50ml eau de parfum.",                      image:"perfume",   inStock:true  },
        { id:7, name:"Shadow Sneakers",      category:"apparel",     price:165, originalPrice:220, rating:4.6, reviews:310, badge:"Sale",         description:"Lightweight mesh upper with memory foam insole and gum rubber outsole.",                        image:"sneakers",  inStock:false },
        { id:8, name:"Phantom Desk Lamp",    category:"home",        price:139, originalPrice:null,rating:4.7, reviews:42,  badge:"New",          description:"Adjustable arm with 5 color temperature settings and USB-C charging base.",                    image:"lamp",      inStock:true  }
    ];
}

// ─── Product Emoji Map ────────────────────────
const productEmojis = {
    watch: '⌚', jacket: '🧥', headphones: '🎧',
    mug: '☕', wallet: '👛', perfume: '🌑',
    sneakers: '👟', lamp: '🪔'
};

// ─── Render Products ──────────────────────────
function renderProducts(list) {
    if (!productGrid) return;

    if (list.length === 0) {
        productGrid.innerHTML = `
            <div style="grid-column:1/-1; text-align:center; padding:4rem; color:var(--text-muted)">
                <div style="font-size:3rem;margin-bottom:1rem">🔍</div>
                <p style="font-size:1rem">No products found</p>
                <p style="font-size:0.82rem;margin-top:0.5rem">Try adjusting your search or filter</p>
            </div>
        `;
        return;
    }

    productGrid.innerHTML = list.map((p, i) => `
        <article class="product-card fade-in" style="transition-delay:${i * 0.06}s" data-id="${p.id}">
            <div class="product-card-image">
                <div class="product-emoji">${productEmojis[p.image] || '📦'}</div>
                <div class="product-card-overlay">
                    <button class="overlay-btn" onclick="toggleWishlist(${p.id})" title="Wishlist"
                        aria-label="${wishlist.includes(p.id) ? 'Remove from wishlist' : 'Add to wishlist'}"
                        style="${wishlist.includes(p.id) ? 'color:var(--accent-gold);background:var(--accent-glow);border-color:var(--accent-dim)' : ''}">
                        <i class="fas fa-heart" style="${wishlist.includes(p.id) ? 'color:var(--accent-gold)' : 'color:var(--text-muted)'}"></i>
                    </button>
                    <button class="overlay-btn add-to-cart" onclick="addToCart(${p.id})"
                        ${!p.inStock ? 'disabled' : ''} aria-label="Add to cart">
                        <i class="fas fa-bag-shopping"></i>
                        ${p.inStock ? 'Add to Cart' : 'Out of Stock'}
                    </button>
                    <button class="overlay-btn" onclick="quickView(${p.id})" title="Quick view"
                        aria-label="Quick view">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
                ${p.badge ? `<span class="product-badge ${p.badge.toLowerCase()}">${p.badge}</span>` : ''}
                ${!p.inStock ? `<span class="out-of-stock-tag">Out of Stock</span>` : ''}
            </div>
            <div class="product-card-body">
                <p class="product-category">${p.category}</p>
                <h3 class="product-name">${p.name}</h3>
                <p class="product-desc">${p.description}</p>
                <div class="product-rating">
                    <div class="stars" aria-label="${p.rating} stars">
                        ${renderStars(p.rating)}
                    </div>
                    <span class="rating-value">${p.rating}</span>
                    <span class="rating-count">(${p.reviews})</span>
                </div>
                <div class="product-footer">
                    <div class="product-price">
                        <span class="price-current">$${p.price.toFixed(2)}</span>
                        ${p.originalPrice ? `<span class="price-original">$${p.originalPrice.toFixed(2)}</span>` : ''}
                    </div>
                    <button class="product-card-add-btn" onclick="addToCart(${p.id})"
                        ${!p.inStock ? 'disabled' : ''} aria-label="Add to cart">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
            </div>
        </article>
    `).join('');

    // Re-trigger intersection observer for new cards
    observeFadeIns();
}

function renderStars(rating) {
    return Array.from({ length: 5 }, (_, i) => {
        const filled = i < Math.floor(rating);
        const half   = !filled && i < rating;
        return `<i class="fas fa-star${half ? '-half-alt' : ''}" style="opacity:${filled || half ? 1 : 0.25}"></i>`;
    }).join('');
}

// ─── Filtering & Sorting ──────────────────────
function filterProducts(category) {
    currentFilter = category;
    const filtered = applySort(
        category === 'all' ? [...products] : products.filter(p => p.category === category)
    );
    renderProducts(filtered);
    updateResultCount(filtered.length);

    // Update category UI
    document.querySelectorAll('.category-card').forEach(c => {
        c.classList.toggle('active', c.dataset.category === category);
    });
}

function applySort(list) {
    const sorted = [...list];
    switch (currentSort) {
        case 'price-asc':    return sorted.sort((a, b) => a.price - b.price);
        case 'price-desc':   return sorted.sort((a, b) => b.price - a.price);
        case 'rating':       return sorted.sort((a, b) => b.rating - a.rating);
        case 'popular':      return sorted.sort((a, b) => b.reviews - a.reviews);
        default:             return sorted;
    }
}

function searchProducts(query) {
    const q = query.toLowerCase().trim();
    if (!q) { filterProducts(currentFilter); return; }
    const results = products.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
    renderProducts(applySort(results));
    updateResultCount(results.length);
}

function updateResultCount(count) {
    if (resultCount) resultCount.textContent = `${count} product${count !== 1 ? 's' : ''}`;
}

// ─── Cart ─────────────────────────────────────
function addToCart(id) {
    const product = products.find(p => p.id === id);
    if (!product || !product.inStock) return;

    const existing = cart.find(item => item.id === id);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ ...product, qty: 1 });
    }

    saveCart();
    updateCartBadge();
    showToast(`<i class="fas fa-check"></i> ${product.name} added to cart`);
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    updateCartBadge();
    renderCart();
}

function updateQty(id, delta) {
    const item = cart.find(i => i.id === id);
    if (!item) return;
    item.qty = Math.max(1, item.qty + delta);
    if (item.qty < 1) { removeFromCart(id); return; }
    saveCart();
    renderCart();
    updateCartBadge();
}

function saveCart() {
    localStorage.setItem('ADDNCart', JSON.stringify(cart));
}

function updateCartBadge() {
    const total = cart.reduce((sum, i) => sum + i.qty, 0);
    if (cartCountBadge) {
        cartCountBadge.textContent = total;
        cartCountBadge.style.display = total > 0 ? 'flex' : 'none';
    }
}

function openCart() {
    cartOverlay.classList.add('open');
    cartSidebar.classList.add('open');
    renderCart();
    document.body.style.overflow = 'hidden';
}

function closeCart() {
    cartOverlay.classList.remove('open');
    cartSidebar.classList.remove('open');
    document.body.style.overflow = '';
}

function renderCart() {
    if (!cartItemsEl) return;

    if (cart.length === 0) {
        cartItemsEl.innerHTML = `
            <div class="cart-empty">
                <div class="cart-empty-icon">🛍️</div>
                <p>Your cart is empty</p>
                <p style="font-size:0.75rem;margin-top:0.3rem">Add some items to get started</p>
            </div>
        `;
    } else {
        cartItemsEl.innerHTML = cart.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <div class="cart-item-image">${productEmojis[item.image] || '📦'}</div>
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                    <div class="cart-item-controls">
                        <button class="qty-btn" onclick="updateQty(${item.id}, -1)">−</button>
                        <span class="qty-value">${item.qty}</span>
                        <button class="qty-btn" onclick="updateQty(${item.id}, 1)">+</button>
                    </div>
                </div>
                <button class="cart-item-remove" onclick="removeFromCart(${item.id})" aria-label="Remove">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `).join('');
    }

    // Update totals
    const subtotal  = cart.reduce((s, i) => s + i.price * i.qty, 0);
    const shipping  = subtotal > 0 ? (subtotal >= 150 ? 0 : 9.99) : 0;
    const total     = subtotal + shipping;

    const el = id => document.getElementById(id);
    if (el('cartSubtotal'))  el('cartSubtotal').textContent  = `$${subtotal.toFixed(2)}`;
    if (el('cartShipping'))  el('cartShipping').textContent  = shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`;
    if (el('cartTotal'))     el('cartTotal').textContent     = `$${total.toFixed(2)}`;
}

// ─── Wishlist ─────────────────────────────────
function toggleWishlist(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    if (wishlist.includes(id)) {
        wishlist = wishlist.filter(wId => wId !== id);
        showToast(`<i class="fas fa-heart-broken"></i> Removed from wishlist`);
    } else {
        wishlist.push(id);
        showToast(`<i class="fas fa-heart" style="color:var(--accent-gold)"></i> ${product.name} saved to wishlist`);
    }
    localStorage.setItem('ADDNWishlist', JSON.stringify(wishlist));
    updateWishlistBadge();
    // Re-render products so heart icon updates immediately
    const currentList = currentFilter === 'all' ? products : products.filter(p => p.category === currentFilter);
    renderProducts(applySort(currentList));
    // If wishlist sidebar is open, refresh it
    if (document.getElementById('wishlistSidebar')?.classList.contains('open')) {
        renderWishlist();
    }
}

function openWishlist() {
    document.getElementById('wishlistOverlay').classList.add('open');
    document.getElementById('wishlistSidebar').classList.add('open');
    renderWishlist();
    document.body.style.overflow = 'hidden';
}

function closeWishlist() {
    document.getElementById('wishlistOverlay').classList.remove('open');
    document.getElementById('wishlistSidebar').classList.remove('open');
    document.body.style.overflow = '';
}

function renderWishlist() {
    const wishlistItems = document.getElementById('wishlistItems');
    const wishlistFooter = document.getElementById('wishlistFooter');
    const wishlistCount = document.getElementById('wishlistCount');
    if (!wishlistItems) return;

    const items = products.filter(p => wishlist.includes(p.id));

    if (wishlistCount) wishlistCount.textContent = items.length > 0 ? `(${items.length})` : '';
    if (wishlistFooter) wishlistFooter.style.display = items.length > 0 ? 'flex' : 'none';

    if (items.length === 0) {
        wishlistItems.innerHTML = `
            <div class="cart-empty">
                <div class="cart-empty-icon">🤍</div>
                <p>Your wishlist is empty</p>
                <p style="font-size:0.75rem;margin-top:0.3rem">Click the ♡ on any product to save it here</p>
            </div>
        `;
        return;
    }

    wishlistItems.innerHTML = items.map(p => `
        <div class="cart-item" data-id="${p.id}">
            <div class="cart-item-image">${productEmojis[p.image] || '📦'}</div>
            <div class="cart-item-info">
                <div class="cart-item-name">${p.name}</div>
                <div class="cart-item-price">$${p.price.toFixed(2)}</div>
                <div style="margin-top:0.5rem">
                    <button onclick="addToCart(${p.id}); showToast('<i class=\\'fas fa-check\\'></i> Added to cart')"
                        style="background:var(--accent-glow);border:1px solid var(--accent-dim);color:var(--accent-gold);
                               padding:0.3rem 0.8rem;border-radius:var(--radius-pill);font-size:0.7rem;
                               cursor:pointer;letter-spacing:0.05em;font-family:var(--font-body);transition:all 0.2s"
                        ${!p.inStock ? 'disabled' : ''}>
                        ${p.inStock ? '＋ Add to Cart' : 'Out of Stock'}
                    </button>
                </div>
            </div>
            <button class="cart-item-remove" onclick="toggleWishlist(${p.id})" aria-label="Remove from wishlist" title="Remove">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `).join('');
}

function updateWishlistBadge() {
    const badge = document.getElementById('wishlistBadge');
    if (badge) {
        badge.textContent = wishlist.length;
        badge.style.display = wishlist.length > 0 ? 'flex' : 'none';
    }
}

// ─── Quick View ───────────────────────────────
function quickView(id) {
    const p = products.find(prod => prod.id === id);
    if (!p) return;

    const modal = document.createElement('div');
    modal.className = 'cart-overlay open';
    modal.id = 'quickViewOverlay';
    modal.innerHTML = `
        <div class="cart-sidebar open" style="width:520px;max-width:95vw">
            <div class="cart-header">
                <h3 class="cart-title">Quick View</h3>
                <button class="cart-close" onclick="document.getElementById('quickViewOverlay').remove(); document.body.style.overflow=''">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div style="padding:2rem;flex:1;overflow-y:auto">
                <div style="font-size:6rem;text-align:center;margin-bottom:1.5rem;background:var(--bg-elevated);border-radius:var(--radius-lg);padding:2rem">
                    ${productEmojis[p.image] || '📦'}
                </div>
                <span style="font-family:var(--font-mono);font-size:0.65rem;letter-spacing:0.2em;color:var(--accent-gold);text-transform:uppercase">${p.category}</span>
                <h2 style="font-family:var(--font-display);font-size:1.8rem;font-weight:300;margin:0.5rem 0;color:var(--text-primary)">${p.name}</h2>
                <div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:1rem">
                    <div class="stars">${renderStars(p.rating)}</div>
                    <span style="font-size:0.78rem;color:var(--text-muted)">${p.rating} (${p.reviews} reviews)</span>
                </div>
                <p style="font-size:0.9rem;color:var(--text-secondary);line-height:1.7;margin-bottom:1.5rem">${p.description}</p>
                <div style="display:flex;align-items:baseline;gap:0.8rem;margin-bottom:1.5rem">
                    <span style="font-family:var(--font-display);font-size:2rem;color:var(--text-primary)">$${p.price.toFixed(2)}</span>
                    ${p.originalPrice ? `<span style="font-size:0.9rem;color:var(--text-muted);text-decoration:line-through">$${p.originalPrice.toFixed(2)}</span>` : ''}
                </div>
                <button onclick="addToCart(${p.id}); document.getElementById('quickViewOverlay').remove(); document.body.style.overflow=''"
                    class="checkout-btn" ${!p.inStock ? 'disabled' : ''}>
                    <i class="fas fa-bag-shopping"></i>
                    ${p.inStock ? 'Add to Cart' : 'Out of Stock'}
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    modal.addEventListener('click', e => {
        if (e.target === modal) { modal.remove(); document.body.style.overflow = ''; }
    });
}

// ─── Toast Notifications ──────────────────────
function showToast(html) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = html;
    toastContainer.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// ─── Page Navigation ──────────────────────────
function showPage(page) {
    currentPage = page;

    document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-links a').forEach(a => {
        a.classList.toggle('active', a.dataset.page === page);
    });

    const target = document.getElementById(`page-${page}`);
    if (target) {
        target.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Close mobile nav
    navLinks?.classList.remove('mobile-open');
}

// ─── Scroll Animations ────────────────────────
function initScrollAnimations() {
    observeFadeIns();
}

function observeFadeIns() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('visible');
                observer.unobserve(e.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}

// ─── Scroll Behavior ─────────────────────────
function initScrollBehavior() {
    window.addEventListener('scroll', () => {
        if (backToTopBtn) {
            backToTopBtn.classList.toggle('visible', window.scrollY > 400);
        }
    }, { passive: true });
}

// ─── Copy Promo Code ──────────────────────────
function copyPromoCode() {
    navigator.clipboard?.writeText('ADDN20').then(() => {
        showToast('<i class="fas fa-copy"></i> Promo code copied!');
    }).catch(() => {
        showToast('<i class="fas fa-copy"></i> Code: ADDN20');
    });
}

// ─── Newsletter Form ──────────────────────────
function handleNewsletterSubmit(e) {
    e.preventDefault();
    const input = document.getElementById('newsletterEmail');
    const email = input.value.trim();

    if (!validateEmail(email)) {
        input.classList.add('error');
        showToast('<i class="fas fa-exclamation-triangle" style="color:#c94444"></i> Please enter a valid email');
        return;
    }

    input.classList.remove('error');
    input.classList.add('valid');
    input.value = '';
    showToast('<i class="fas fa-check"></i> Subscribed! Welcome to ADDN.');
    setTimeout(() => input.classList.remove('valid'), 3000);
}

// ─── Contact Form ─────────────────────────────
function handleContactSubmit(e) {
    e.preventDefault();
    const fields = ['contactName', 'contactEmail', 'contactMessage'];
    let valid = true;

    fields.forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        const val = el.value.trim();
        const err = document.getElementById(id + 'Error');

        if (!val || (id === 'contactEmail' && !validateEmail(val))) {
            el.classList.add('error');
            el.classList.remove('valid');
            if (err) err.textContent = id === 'contactEmail' ? 'Enter a valid email' : 'This field is required';
            valid = false;
        } else {
            el.classList.remove('error');
            el.classList.add('valid');
            if (err) err.textContent = '';
        }
    });

    if (valid) {
        showToast('<i class="fas fa-paper-plane"></i> Message sent! We\'ll be in touch.');
        e.target.reset();
        fields.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.classList.remove('valid', 'error');
        });
    }
}

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ─── View Toggle ──────────────────────────────
function toggleGridView(isGrid) {
    isGridView = isGrid;
    if (productGrid) {
        productGrid.classList.toggle('list-view', !isGrid);
    }
    document.querySelectorAll('.view-btn').forEach((btn, i) => {
        btn.classList.toggle('active', (i === 0) === isGrid);
    });
}

// ─── Mobile Nav ───────────────────────────────
if (hamburger) {
    hamburger.addEventListener('click', () => {
        navLinks?.classList.toggle('mobile-open');
    });
}

// Close nav when clicking outside
document.addEventListener('click', e => {
    if (navLinks?.classList.contains('mobile-open') &&
        !navLinks.contains(e.target) &&
        !hamburger?.contains(e.target)) {
        navLinks.classList.remove('mobile-open');
    }
});

// ─── Event Wiring ─────────────────────────────
// Sort
if (sortSelect) {
    sortSelect.addEventListener('change', () => {
        currentSort = sortSelect.value;
        filterProducts(currentFilter);
    });
}

// Search (product section)
if (searchInput) {
    searchInput.addEventListener('input', () => searchProducts(searchInput.value));
}

// Nav Search
if (navSearchInput) {
    navSearchInput.addEventListener('input', () => {
        if (currentPage === 'home') {
            document.getElementById('page-shop')?.classList.add('active');
            document.getElementById('page-home')?.classList.remove('active');
        }
        searchProducts(navSearchInput.value);
    });
    navSearchInput.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
            showPage('shop');
            searchProducts(navSearchInput.value);
        }
    });
}

// Cart open/close
document.getElementById('cartBtn')?.addEventListener('click', openCart);
document.getElementById('cartClose')?.addEventListener('click', closeCart);
cartOverlay?.addEventListener('click', e => { if (e.target === cartOverlay) closeCart(); });

// Wishlist open/close
document.getElementById('wishlistBtn')?.addEventListener('click', openWishlist);
document.getElementById('wishlistClose')?.addEventListener('click', closeWishlist);
document.getElementById('wishlistOverlay')?.addEventListener('click', e => {
    if (e.target === document.getElementById('wishlistOverlay')) closeWishlist();
});

// Add all wishlist items to cart
document.getElementById('addAllToCartBtn')?.addEventListener('click', () => {
    const items = products.filter(p => wishlist.includes(p.id) && p.inStock);
    if (items.length === 0) { showToast('<i class="fas fa-info-circle"></i> No in-stock items to add'); return; }
    items.forEach(p => addToCart(p.id));
    closeWishlist();
    openCart();
});

// Clear entire wishlist
document.getElementById('clearWishlistBtn')?.addEventListener('click', () => {
    wishlist = [];
    localStorage.setItem('ADDNWishlist', JSON.stringify(wishlist));
    updateWishlistBadge();
    renderWishlist();
    // Refresh product cards so hearts reset
    const currentList = currentFilter === 'all' ? products : products.filter(p => p.category === currentFilter);
    renderProducts(applySort(currentList));
});

// Checkout
document.getElementById('checkoutBtn')?.addEventListener('click', () => {
    if (cart.length === 0) {
        showToast('<i class="fas fa-info-circle"></i> Your cart is empty');
        return;
    }
    cart = [];
    saveCart();
    updateCartBadge();
    renderCart();
    closeCart();
    showToast('<i class="fas fa-check-circle"></i> Order placed! Thank you for shopping with ADDN.');
});

// Back to top
backToTopBtn?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// Make functions global for inline onclick use
window.addToCart      = addToCart;
window.removeFromCart = removeFromCart;
window.updateQty      = updateQty;
window.openCart       = openCart;
window.closeCart      = closeCart;
window.toggleWishlist = toggleWishlist;
window.openWishlist   = openWishlist;
window.closeWishlist  = closeWishlist;
window.quickView      = quickView;
window.filterProducts = filterProducts;
window.showPage       = showPage;
window.copyPromoCode  = copyPromoCode;
window.toggleGridView = toggleGridView;
window.handleNewsletterSubmit = handleNewsletterSubmit;
window.handleContactSubmit    = handleContactSubmit;
