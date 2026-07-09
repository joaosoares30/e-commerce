const express = require('express');
const { priceCart } = require('../pricing');

const router = express.Router();

// POST /api/cart/total
// body: { items: [{ id, quantity }] }
// Recalcula o total no servidor - ignora qualquer preço enviado pelo cliente.
router.post('/total', (req, res) => {
    try {
        const result = priceCart(req.body.items);
        res.json(result);
    } catch (err) {
        res.status(err.status || 500).json({ error: err.message });
    }
});

module.exports = router;
