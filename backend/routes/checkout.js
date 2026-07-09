const express = require('express');
const rateLimit = require('express-rate-limit');
const db = require('../db');
const { priceCart } = require('../pricing');

const router = express.Router();

const VALID_METHODS = ['cartao', 'pix', 'boleto'];

// Limita tentativas de checkout por IP - evita abuso/força bruta no endpoint de pagamento
const checkoutLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutos
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Muitas tentativas. Aguarde alguns minutos e tente novamente.' }
});

// POST /api/checkout
// body: { items: [{ id, quantity }], paymentMethod: 'cartao' | 'pix' | 'boleto' }
//
// IMPORTANTE: isto é uma simulação. Não processa pagamento de verdade.
// Nenhum dado de cartão é validado com uma bandeira/adquirente real -
// num sistema de produção isso teria que passar por um gateway
// PCI-compliant (Stripe, Mercado Pago, PagSeguro etc.), nunca ser
// implementado "na mão" guardando número de cartão no seu banco.
router.post('/', checkoutLimiter, (req, res) => {
    const { items, paymentMethod } = req.body;

    if (!VALID_METHODS.includes(paymentMethod)) {
        return res.status(400).json({ error: 'Forma de pagamento inválida.' });
    }

    let priced;
    try {
        priced = priceCart(items);
    } catch (err) {
        return res.status(err.status || 500).json({ error: err.message });
    }

    const createOrder = db.transaction(() => {
        const orderInsert = db
            .prepare('INSERT INTO orders (total, payment_method) VALUES (?, ?)')
            .run(priced.total, paymentMethod);

        const orderId = orderInsert.lastInsertRowid;

        const itemInsert = db.prepare(
            'INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (?, ?, ?, ?)'
        );

        for (const item of priced.items) {
            itemInsert.run(orderId, item.id, item.quantity, item.unitPrice);
        }

        return orderId;
    });

    const orderId = createOrder();

    res.status(201).json({
        orderId,
        status: 'confirmado',
        paymentMethod,
        items: priced.items,
        total: priced.total
    });
});

module.exports = router;
