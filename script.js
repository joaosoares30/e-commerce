const products = [
    {
        id: 1,
        title: "Smartphone Samsung Galaxy A54",
        price: 1899.99,
        discount: 15,
        image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&h=400&fit=crop"
    },
    {
        id: 2,
        title: "Notebook Lenovo IdeaPad",
        price: 2999.90,
        discount: 20,
        image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&h=400&fit=crop"
    },
    {
        id: 3,
        title: "Smart TV LG 50 4K",
        price: 2299.00,
        discount: 10,
        image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop"
    },
    {
        id: 4,
        title: "Fone de Ouvido Bluetooth Sony WH-1000XM4",
        price: 1499.00,
        discount: 12,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop"
    },
    {
        id: 5,
        title: "Console PlayStation 5 Slim",
        price: 3799.90,
        discount: 8,
        image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400&h=400&fit=crop"
    },
    {
        id: 6,
        title: "Teclado Mecânico Gamer Razer BlackWidow",
        price: 549.90,
        discount: 15,
        image: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=400&h=400&fit=crop"
    },
    {
        id: 7,
        title: "Mouse Gamer Logitech G502 Hero",
        price: 299.00,
        discount: 20,
        image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=400&h=400&fit=crop"
    },
    {
        id: 8,
        title: "Monitor Gamer Asus 24\" IPS 144Hz",
        price: 1099.00,
        discount: 10,
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRoNSWnJy2oCdOgqeJcQHolf-Wi02kUI8Xtg&s"
    },
    {
        id: 9,
        title: "Smartwatch Apple Watch Series 9",
        price: 3299.00,
        discount: 5,
        image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=400&h=400&fit=crop"
    },
    {
        id: 10,
        title: "Caixa de Som JBL Flip 6 Bluetooth",
        price: 649.90,
        discount: 15,
        image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop"
    },
    {
        id: 11,
        title: "Roteador TP-Link Archer Wi-Fi 6",
        price: 429.00,
        discount: 10,
        image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop"
    },
    {
        id: 12,
        title: "Microfone Condensador HyperX QuadCast",
        price: 799.00,
        discount: 12,
        image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=400&h=400&fit=crop"
    },
    {
        id: 13,
        title: "Kindle 11ª Geração Amazon",
        price: 499.00,
        discount: 10,
        image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=400&fit=crop"
    },
    {
        id: 14,
        title: "Caixa de Som Echo Dot 5ª Geração Alexa",
        price: 399.00,
        discount: 15,
        image: "https://images.unsplash.com/photo-1543512214-318c7553f230?w=400&h=400&fit=crop"
    },
    {
        id: 15,
        title: "Placa de Vídeo RTX 4060 Ti MSI",
        price: 2699.00,
        discount: 10,
        image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400&h=400&fit=crop"
    }
];

function createProductCard(product) {
    const precoFormatado = product.price.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });

    return `
        <div class="product-card">
            <img src="${product.image}" alt="${product.title}" class="product-image">
            <h3 class="product-title">${product.title}</h3>
            <div class="product-price">${precoFormatado}</div>
            <div class="product-discount"> ${product.discount}% OFF</div>
            <button class="btn-add-cart" data-id="${product.id}">Adicionar ao carrinho</button>
        </div>
    `;
}

/* ---------- Carrinho (localStorage) ---------- */

const CART_KEY = 'ecommerce-cart';

function getCart() {
    try {
        return JSON.parse(localStorage.getItem(CART_KEY)) || [];
    } catch {
        return [];
    }
}

function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCartCount();
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const cart = getCart();
    const item = cart.find(i => i.id === productId);

    if (item) {
        item.quantity += 1;
    } else {
        cart.push({ id: product.id, quantity: 1 });
    }

    saveCart(cart);
}

function removeFromCart(productId) {
    const cart = getCart().filter(i => i.id !== productId);
    saveCart(cart);
    renderCartPage();
}

function updateCartQuantity(productId, quantity) {
    const cart = getCart();
    const item = cart.find(i => i.id === productId);
    if (!item) return;

    if (quantity <= 0) {
        removeFromCart(productId);
        return;
    }

    item.quantity = quantity;
    saveCart(cart);
    renderCartPage();
}

function updateCartCount() {
    const total = getCart().reduce((sum, i) => sum + i.quantity, 0);
    const desktopBadge = document.getElementById('cartCount');
    const mobileBadge = document.getElementById('cartCountMobile');
    if (desktopBadge) desktopBadge.textContent = total;
    if (mobileBadge) mobileBadge.textContent = total;
}

function renderCartPage() {
    const cartList = document.getElementById('cart-list');
    const totalValueEl = document.getElementById('cart-total-value');
    if (!cartList || !totalValueEl) return; // não estamos na página do carrinho

    const cart = getCart();

    if (cart.length === 0) {
        cartList.innerHTML = '<p class="cart-empty">Seu carrinho está vazio. <a href="index.html">Ver produtos</a></p>';
        totalValueEl.textContent = (0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        return;
    }

    let total = 0;

    cartList.innerHTML = cart.map(item => {
        const product = products.find(p => p.id === item.id);
        if (!product) return '';

        const subtotal = product.price * item.quantity;
        total += subtotal;

        return `
            <div class="cart-item">
                <img src="${product.image}" alt="${product.title}" class="cart-item-image">
                <div class="cart-item-info">
                    <h3 class="cart-item-title">${product.title}</h3>
                    <div class="cart-item-price">${product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
                </div>
                <div class="cart-item-qty">
                    <button class="qty-btn" data-action="decrease" data-id="${product.id}">-</button>
                    <span>${item.quantity}</span>
                    <button class="qty-btn" data-action="increase" data-id="${product.id}">+</button>
                </div>
                <div class="cart-item-subtotal">${subtotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
                <button class="cart-item-remove" data-id="${product.id}" aria-label="Remover item">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        `;
    }).join('');

    totalValueEl.textContent = total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

/* ---------- Página de pagamento ---------- */

function renderPaymentSummary() {
    const summaryItemsEl = document.getElementById('summaryItems');
    if (!summaryItemsEl) return; // não estamos na página de pagamento

    const cart = getCart();

    if (cart.length === 0) {
        window.location.href = 'carrinho.html';
        return;
    }

    let total = 0;

    summaryItemsEl.innerHTML = cart.map(item => {
        const product = products.find(p => p.id === item.id);
        if (!product) return '';

        const subtotal = product.price * item.quantity;
        total += subtotal;

        return `
            <div class="summary-item">
                <img src="${product.image}" alt="${product.title}">
                <div class="summary-item-info">
                    ${product.title}
                    <div class="summary-item-qty">Qtd: ${item.quantity}</div>
                </div>
                <div class="summary-item-price">${subtotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
            </div>
        `;
    }).join('');

    const totalFormatted = total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    document.getElementById('summarySubtotal').textContent = totalFormatted;
    document.getElementById('summaryTotal').textContent = totalFormatted;

    fillInstallments(total);
}

function fillInstallments(total) {
    const select = document.getElementById('cardInstallments');
    if (!select) return;

    let options = '';
    for (let i = 1; i <= 12; i++) {
        const value = total / i;
        const label = i === 1
            ? `À vista - ${value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`
            : `${i}x de ${value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} sem juros`;
        options += `<option value="${i}">${label}</option>`;
    }
    select.innerHTML = options;
}

function setupPaymentTabs() {
    const tabs = document.querySelectorAll('.tab-btn');
    if (!tabs.length) return;

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            document.querySelectorAll('.payment-method-panel').forEach(panel => panel.hidden = true);
            document.getElementById(`panel-${tab.dataset.method}`).hidden = false;
        });
    });
}

function setupCardPreview() {
    const numberInput = document.getElementById('cardNumber');
    if (!numberInput) return; // não estamos na página de pagamento

    const nameInput = document.getElementById('cardName');
    const expiryInput = document.getElementById('cardExpiry');

    numberInput.addEventListener('input', () => {
        let digits = numberInput.value.replace(/\D/g, '').slice(0, 16);
        numberInput.value = digits.replace(/(.{4})/g, '$1 ').trim();

        const preview = digits.padEnd(16, '•').replace(/(.{4})/g, '$1 ').trim();
        document.getElementById('cardPreviewNumber').textContent = preview;
    });

    nameInput.addEventListener('input', () => {
        document.getElementById('cardPreviewName').textContent = nameInput.value.toUpperCase() || 'NOME COMPLETO';
    });

    expiryInput.addEventListener('input', () => {
        let digits = expiryInput.value.replace(/\D/g, '').slice(0, 4);
        if (digits.length > 2) digits = digits.slice(0, 2) + '/' + digits.slice(2);
        expiryInput.value = digits;
        document.getElementById('cardPreviewExpiry').textContent = digits || 'MM/AA';
    });
}

function setupPaymentForm() {
    const form = document.getElementById('paymentForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const activeMethod = document.querySelector('.tab-btn.active').dataset.method;

        if (activeMethod === 'cartao') {
            const number = document.getElementById('cardNumber').value.replace(/\D/g, '');
            const name = document.getElementById('cardName').value.trim();
            const expiry = document.getElementById('cardExpiry').value.trim();
            const cvv = document.getElementById('cardCvv').value.trim();

            if (number.length < 16 || !name || expiry.length < 5 || cvv.length < 3) {
                alert('Preencha todos os campos do cartão corretamente.');
                return;
            }
        }

        const btn = document.getElementById('btnPay');
        btn.disabled = true;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processando...';

        // Simulação de processamento de pagamento
        setTimeout(() => {
            saveCart([]); // limpa o carrinho
            document.getElementById('paymentLayout').hidden = true;
            document.querySelector('.checkout-steps').hidden = true;
            document.getElementById('paymentSuccess').hidden = false;

            setTimeout(() => {
                window.location.href = 'index.html';
            }, 4000);
        }, 1500);
    });
}

function searchProducts(){
    const searchinput = document.getElementById('searchInput').value.toLowerCase()

    const filteredProdcts = products.filter( product => product.title.toLowerCase().includes(searchinput)
    )
    
    renderProducts(filteredProdcts)
}

function renderProducts(list = products) {
    const grid = document.getElementById('products-grid');
    grid.innerHTML = list.map(createProductCard).join('');
}

document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('products-grid');
    if (grid) {
        renderProducts();

        // Delegação de eventos: captura clique no botão "Adicionar ao carrinho"
        grid.addEventListener('click', (e) => {
            const btn = e.target.closest('.btn-add-cart');
            if (!btn) return;
            addToCart(Number(btn.dataset.id));
            btn.textContent = 'Adicionado ✓';
            setTimeout(() => { btn.textContent = 'Adicionar ao carrinho'; }, 1200);
        });
    }

    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');
    if (searchBtn) searchBtn.addEventListener('click', searchProducts);
    if (searchInput) {
        searchInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') searchProducts();
        });
    }

    // Página do carrinho: renderiza itens e escuta cliques de +/-/remover
    const cartList = document.getElementById('cart-list');
    if (cartList) {
        renderCartPage();

        cartList.addEventListener('click', (e) => {
            const removeBtn = e.target.closest('.cart-item-remove');
            if (removeBtn) {
                removeFromCart(Number(removeBtn.dataset.id));
                return;
            }

            const qtyBtn = e.target.closest('.qty-btn');
            if (qtyBtn) {
                const id = Number(qtyBtn.dataset.id);
                const cart = getCart();
                const item = cart.find(i => i.id === id);
                if (!item) return;
                const delta = qtyBtn.dataset.action === 'increase' ? 1 : -1;
                updateCartQuantity(id, item.quantity + delta);
            }
        });

        const checkoutBtn = document.getElementById('checkoutBtn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                if (getCart().length === 0) {
                    alert('Seu carrinho está vazio.');
                    return;
                }
                window.location.href = 'pagamento.html';
            });
        }
    }

    // Página de pagamento
    renderPaymentSummary();
    setupPaymentTabs();
    setupCardPreview();
    setupPaymentForm();

    updateCartCount();
});

const hamburgerBtn = document.getElementById('hamburgerBtn');
const mobileMenu = document.getElementById('mobileMenu');

if (hamburgerBtn && mobileMenu) {
    hamburgerBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        mobileMenu.classList.toggle('open');
        const icon = hamburgerBtn.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-xmark');
    });

    document.addEventListener('click', (e) => {
        if (!mobileMenu.contains(e.target) && !hamburgerBtn.contains(e.target)) {
            mobileMenu.classList.remove('open');
            const icon = hamburgerBtn.querySelector('i');
            icon.classList.add('fa-bars');
            icon.classList.remove('fa-xmark');
        }
    });
}

// Busca mobile sincroniza com a principal
const searchBtnMobile = document.getElementById('searchBtnMobile');
const searchInputMobile = document.getElementById('searchInputMobile');

if (searchBtnMobile && searchInputMobile) {
    searchBtnMobile.addEventListener('click', () => {
        document.getElementById('searchInput').value = searchInputMobile.value;
        searchProducts();
    });
    searchInputMobile.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            document.getElementById('searchInput').value = searchInputMobile.value;
            searchProducts();
        }
    });
}