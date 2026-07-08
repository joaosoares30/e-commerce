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
            <div class="product-discount">${product.discount}% OFF</div>
        </div>
    `;
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
    renderProducts();

    document.getElementById('searchBtn').addEventListener('click', searchProducts)

        document.getElementById('searchInput').addEventListener('keyup', (e) => {
        if (e.key === 'Enter') searchProducts();
    });
});
