require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');

const productsRouter = require('./routes/products');
const cartRouter = require('./routes/cart');
const checkoutRouter = require('./routes/checkout');

const app = express();
const PORT = process.env.PORT || 3001;

// Cabeçalhos de segurança básicos (evita clickjacking, sniffing de MIME, etc.)
app.use(helmet());

// Em dev, libera o front-end local. Em produção, restrinja para o domínio real.
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*'
}));

// Limita o tamanho do corpo da requisição - evita payloads gigantes (DoS simples)
app.use(express.json({ limit: '10kb' }));

// Rate limit geral em toda a API - evita abuso/flood
app.use('/api', rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false
}));

app.use('/api/products', productsRouter);
app.use('/api/cart', cartRouter);
app.use('/api/checkout', checkoutRouter);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Serve o front-end estático (index.html, style.css, script.js, etc.)
// a partir da pasta pai. Isso faz o front e o backend rodarem juntos,
// no mesmo servidor - sem precisar do python3 -m http.server separado.
const frontendPath = path.join(__dirname, '..');
app.use(express.static(frontendPath));

// Handler de erro genérico - nunca vaza stack trace pro cliente
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'Erro interno do servidor.' });
});

app.listen(PORT, () => {
    console.log(`Backend rodando em http://localhost:${PORT}`);
});
