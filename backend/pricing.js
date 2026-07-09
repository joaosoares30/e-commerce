const db = require('./db');

const MAX_QUANTITY_PER_ITEM = 50; // limite sanity-check, evita abuso/overflow

/**
 * Recebe uma lista de itens vinda do cliente (ex: [{ id: 1, quantity: 2 }])
 * e recalcula o preço e o total INTEIRAMENTE a partir do banco de dados.
 * Qualquer campo de preço que o cliente tenha mandado é ignorado.
 *
 * Lança um erro com `.status` e `.message` amigáveis se algo for inválido.
 */
function priceCart(rawItems) {
    if (!Array.isArray(rawItems) || rawItems.length === 0) {
        const err = new Error('O carrinho está vazio ou é inválido.');
        err.status = 400;
        throw err;
    }

    const getProduct = db.prepare('SELECT * FROM products WHERE id = ?');
    const items = [];
    let total = 0;

    for (const rawItem of rawItems) {
        const id = Number(rawItem?.id);
        const quantity = Number(rawItem?.quantity);

        if (!Number.isInteger(id) || id <= 0) {
            const err = new Error(`ID de produto inválido: ${rawItem?.id}`);
            err.status = 400;
            throw err;
        }

        if (!Number.isInteger(quantity) || quantity <= 0 || quantity > MAX_QUANTITY_PER_ITEM) {
            const err = new Error(`Quantidade inválida para o produto ${id}.`);
            err.status = 400;
            throw err;
        }

        const product = getProduct.get(id);

        if (!product) {
            const err = new Error(`Produto ${id} não existe.`);
            err.status = 404;
            throw err;
        }

        const subtotal = Math.round(product.price * quantity * 100) / 100;
        total += subtotal;

        items.push({
            id: product.id,
            title: product.title,
            unitPrice: product.price,
            quantity,
            subtotal
        });
    }

    total = Math.round(total * 100) / 100;

    return { items, total };
}

module.exports = { priceCart };
