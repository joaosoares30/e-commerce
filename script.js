// Os produtos agora vêm do backend (GET /api/products), que lê do banco
// de dados. O front-end nunca mais é a fonte da verdade sobre preços.

let products = [];

async function loadProducts() {
    const response = await fetch('/api/products');
    if (!response.ok) throw new Error('Não foi possível carregar os produtos.');
    products = await response.json();
}

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

    form.addEventListener('submit', async (e) => {
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

        try {
            // O servidor recebe só {id, quantity} - nunca o preço.
            // O total de verdade é recalculado no backend a partir do banco.
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: getCart(),
                    paymentMethod: activeMethod
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Não foi possível concluir o pagamento.');
            }

            saveCart([]); // limpa o carrinho só depois da confirmação do servidor
            document.getElementById('paymentLayout').hidden = true;
            document.querySelector('.checkout-steps').hidden = true;

            const successEl = document.getElementById('paymentSuccess');
            successEl.querySelector('p').textContent =
                `Pedido #${data.orderId} confirmado - total de ${data.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}. Você será redirecionado para a loja em instantes.`;
            successEl.hidden = false;

            setTimeout(() => {
                window.location.href = 'index.html';
            }, 4000);
        } catch (err) {
            alert(err.message);
            btn.disabled = false;
            btn.innerHTML = '<i class="fa-solid fa-lock"></i> Confirmar pagamento';
        }
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

document.addEventListener('DOMContentLoaded', async () => {
    let productsLoaded = true;

    try {
        await loadProducts();
    } catch (err) {
        console.error(err);
        productsLoaded = false;
    }

    const grid = document.getElementById('products-grid');
    if (grid) {
        if (!productsLoaded) {
            grid.innerHTML = '<p class="cart-empty">Não foi possível conectar ao servidor. Verifique se o backend está rodando (node server.js).</p>';
        } else {
            renderProducts();
        }

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
        if (!productsLoaded) {
            cartList.innerHTML = '<p class="cart-empty">Não foi possível conectar ao servidor. Verifique se o backend está rodando (node server.js).</p>';
        } else {
            renderCartPage();
        }

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
    if (productsLoaded) renderPaymentSummary();
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