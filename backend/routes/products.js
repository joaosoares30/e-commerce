const express = require('express');
const db = require('../db');

const router = express.Router();

// GET /api/products - lista todos os produtos
router.get('/', (req, res) => {
    const products = db.prepare('SELECT * FROM products ORDER BY id').all();
    res.json(products);
});

// GET /api/products/:id - detalhe de um produto
router.get('/:id', (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ error: 'ID inválido' });
    }

    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(id);

    if (!product) {
        return res.status(404).json({ error: 'Produto não encontrado' });
    }

    res.json(product);
});

module.exports = router;
