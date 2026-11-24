const products = [
    { id: 1, brand: 'Apple', category: 'Смартфоны', name: 'iPhone 15 Pro Max', price: 129990, oldPrice: 139990, specs: ['256 ГБ', 'Titanium', 'A17 Pro'], emoji: '📱', badge: 'Хит' },
    { id: 2, brand: 'Apple', category: 'Смартфоны', name: 'iPhone 15', price: 89990, oldPrice: 94990, specs: ['128 ГБ', 'Dynamic Island', 'A16 Bionic'], emoji: '📱', badge: 'new' },
    { id: 3, brand: 'Samsung', category: 'Смартфоны', name: 'Galaxy S24 Ultra', price: 119990, oldPrice: 129990, specs: ['512 ГБ', 'S Pen', '200 МП'], emoji: '📲', badge: 'Хит' },
    { id: 4, brand: 'Samsung', category: 'Смартфоны', name: 'Galaxy S24', price: 74990, oldPrice: null, specs: ['256 ГБ', 'AI Camera', 'Snapdragon 8'], emoji: '📲', badge: null },
    { id: 5, brand: 'Apple', category: 'Ноутбуки', name: 'MacBook Air M3', price: 134990, oldPrice: 149990, specs: ['13"', '8 ГБ RAM', '256 ГБ SSD'], emoji: '💻', badge: 'Хит' },
    { id: 6, brand: 'Apple', category: 'Ноутбуки', name: 'MacBook Pro 14"', price: 199990, oldPrice: null, specs: ['M3 Pro', '18 ГБ RAM', '512 ГБ'], emoji: '💻', badge: null },
    { id: 7, brand: 'Xiaomi', category: 'Ноутбуки', name: 'RedmiBook Pro 15', price: 74990, oldPrice: 84990, specs: ['Ryzen 7', '16 ГБ RAM', '512 ГБ'], emoji: '💻', badge: 'new' },
    { id: 8, brand: 'Apple', category: 'Планшеты', name: 'iPad Air M2', price: 69990, oldPrice: 74990, specs: ['11"', '128 ГБ', 'M2'], emoji: '📲', badge: null },
    { id: 9, brand: 'Samsung', category: 'Планшеты', name: 'Galaxy Tab S9', price: 59990, oldPrice: 64990, specs: ['11"', '256 ГБ', 'S Pen'], emoji: '📲', badge: 'Хит' },
    { id: 10, brand: 'Xiaomi', category: 'Планшеты', name: 'Xiaomi Pad 6', price: 29990, oldPrice: 34990, specs: ['11"', '128 ГБ', '144 Гц'], emoji: '📲', badge: 'new' },
    { id: 11, brand: 'Apple', category: 'Аксессуары', name: 'AirPods Pro 2', price: 24990, oldPrice: 27990, specs: ['ANC', 'USB-C', 'MagSafe'], emoji: '🎧', badge: 'Хит' },
    { id: 12, brand: 'Samsung', category: 'Аксессуары', name: 'Galaxy Watch 6', price: 29990, oldPrice: null, specs: ['44 мм', 'AMOLED', 'GPS'], emoji: '⌚', badge: null },
    { id: 13, brand: 'Xiaomi', category: 'Аксессуары', name: 'Mi Band 8 Pro', price: 5990, oldPrice: 6990, specs: ['1.74"', '150+ режимов', 'NFC'], emoji: '⌚', badge: 'new' },
    { id: 14, brand: 'Apple', category: 'Аксессуары', name: 'Apple Watch Series 9', price: 44990, oldPrice: 49990, specs: ['45 мм', 'Always-On', 'S9 SiP'], emoji: '⌚', badge: null }
];

let cart = [];
let currentFilter = 'all';

const catalog = document.getElementById('catalog');
const cartModal = document.getElementById('cartModal');
const cartItemsEl = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const cartTotal = document.getElementById('cartTotal');
const toast = document.getElementById('toast');

function formatPrice(n) {
    return n.toLocaleString('ru-RU') + ' ₽';
}

function renderProducts() {
    const filtered = currentFilter === 'all'
        ? products
        : products.filter(p => p.category === currentFilter);

    catalog.innerHTML = filtered.map(p => `
        <div class="card">
            <div class="card-img">
                ${p.emoji}
                ${p.badge ? `<span class="badge ${p.badge === 'new' ? 'new' : ''}">${p.badge === 'new' ? 'Новинка' : p.badge}</span>` : ''}
            </div>
            <div class="card-body">
                <div class="card-brand">${p.brand}</div>
                <div class="card-title">${p.name}</div>
                <div class="card-specs">
                    ${p.specs.map(s => `<div>• ${s}</div>`).join('')}
                </div>
                <div class="price-row">
                    <div>
                        <span class="price">${formatPrice(p.price)}</span>
                        ${p.oldPrice ? `<span class="old-price">${formatPrice(p.oldPrice)}</span>` : ''}
                    </div>
                    <button class="buy-btn" onclick="addToCart(${p.id})">В корзину</button>
                </div>
            </div>
        </div>
    `).join('');
}

function addToCart(id) {
    const product = products.find(p => p.id === id);
    const existing = cart.find(item => item.id === id);

    if (existing) {
        existing.qty++;
    } else {
        cart.push({ ...product, qty: 1 });
    }

    updateCart();
    showToast(`✅ ${product.name} добавлен в корзину`);
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCart();
}

function updateCart() {
    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    const totalSum = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

    cartCount.textContent = totalQty;
    cartTotal.textContent = formatPrice(totalSum);

    if (cart.length === 0) {
        cartItemsEl.innerHTML = '<div class="empty-cart">🛒 Корзина пуста<br><small>Добавьте товары из каталога</small></div>';
    } else {
        cartItemsEl.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <h4>${item.name} ${item.qty > 1 ? `× ${item.qty}` : ''}</h4>
                    <span>${formatPrice(item.price * item.qty)}</span>
                </div>
                <button class="remove-btn" onclick="removeFromCart(${item.id})">✕</button>
            </div>
        `).join('');
    }
}

function openCart() {
    cartModal.classList.add('active');
    updateCart();
}

function closeCart() {
    cartModal.classList.remove('active');
}

function checkout() {
    if (cart.length === 0) {
        showToast('⚠️ Корзина пуста');
        return;
    }
    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    showToast(`🎉 Заказ на ${formatPrice(total)} оформлен!`);
    cart = [];
    updateCart();
    closeCart();
}

function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(window.toastTimer);
    window.toastTimer = setTimeout(() => toast.classList.remove('show'), 2500);
}

document.getElementById('filters').addEventListener('click', (e) => {
    if (!e.target.classList.contains('filter-btn')) return;
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');
    currentFilter = e.target.dataset.cat;
    renderProducts();
});

renderProducts();
updateCart();