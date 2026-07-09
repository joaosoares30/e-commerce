// Popula a tabela `products` a partir do backend/seed-data.json
// Rode com: node seed.js

const fs = require('fs');
const path = require('path');
const db = require('./db');

const seedPath = path.join(__dirname, 'seed-data.json');
const products = JSON.parse(fs.readFileSync(seedPath, 'utf8'));

const insert = db.prepare(`
    INSERT INTO products (id, title, price, discount, image)
    VALUES (@id, @title, @price, @discount, @image)
    ON CONFLICT(id) DO UPDATE SET
        title = excluded.title,
        price = excluded.price,
        discount = excluded.discount,
        image = excluded.image
`);

const insertMany = db.transaction((items) => {
    for (const item of items) insert.run(item);
});

insertMany(products);

console.log(`${products.length} produtos inseridos/atualizados no banco.`);
