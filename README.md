# E-Commerce

Loja virtual feita com **HTML, CSS e JavaScript puro** no front-end, e um **backend em Node.js + Express + SQLite**, como projeto de estudo/portfólio.

🔗 **Demo (versão front-end estática):** https://joaosoares30.github.io/e-commerce/

> A demo no GitHub Pages roda só o front-end. Para usar o fluxo completo (com backend validando preços e checkout), rode o projeto localmente — veja "Como rodar" abaixo.

## Funcionalidades

- **Catálogo de produtos**, carregado do backend via API (`GET /api/products`)
- **Busca de produtos** por nome (desktop e mobile)
- **Carrinho de compras** funcional, com persistência em `localStorage`:
  - Adicionar produto ao carrinho
  - Alterar quantidade (+/-)
  - Remover item
  - Contador de itens no ícone do carrinho (header)
- **Página de pagamento**, acessada a partir do carrinho:
  - Abas para Cartão, Pix e Boleto
  - Preview animado do cartão (número, nome e validade em tempo real)
  - Cálculo automático de parcelas
  - Checkout que chama o backend (`POST /api/checkout`), que recalcula o total a partir do banco de dados e cria o pedido
  - ⚠️ Simulação de pagamento — não integra com nenhuma bandeira/adquirente real
- **Página de login/cadastro** (layout, sem autenticação real ainda)
- **Menu responsivo** com hambúrguer para mobile
- Links para redes sociais no rodapé

## Arquitetura

O front-end **nunca é a fonte da verdade sobre preços**. Ele só manda `{ id, quantity }` pro backend; quem calcula subtotal e total é sempre o servidor, consultando o banco de dados. Isso evita que alguém manipule o preço pelo DevTools do navegador e feche uma compra com valor errado.

```
Navegador (front-end)
   │  fetch('/api/products')        → lista de produtos
   │  fetch('/api/cart/total')      → recalcula total (nunca confia no preço do cliente)
   │  fetch('/api/checkout')        → valida, recalcula e cria o pedido no banco
   ▼
Backend (Express)
   │
   ▼
SQLite (products, orders, order_items)
```

## Estrutura do projeto

```
ecommerce/
├── index.html                  # Página inicial (catálogo de produtos)
├── carrinho.html                # Página do carrinho de compras
├── pagamento.html                 # Página de pagamento (cartão/pix/boleto)
├── login.html                       # Página de login/cadastro
├── style.css                          # Estilos (layout, responsividade)
├── script.js                            # Lógica do front: produtos, busca, carrinho, pagamento, menu mobile
└── backend/
    ├── server.js                          # Servidor Express (API + serve o front-end estático)
    ├── db.js                                # Conexão SQLite e criação das tabelas
    ├── pricing.js                             # Lógica central: recalcula preço/total a partir do banco
    ├── seed.js                                  # Popula o banco a partir de seed-data.json
    ├── seed-data.json                             # Dados iniciais dos produtos
    └── routes/
        ├── products.js                               # GET /api/products, GET /api/products/:id
        ├── cart.js                                      # POST /api/cart/total
        └── checkout.js                                    # POST /api/checkout
```

## Tecnologias

**Front-end:**
- HTML5, CSS3 (Flexbox, Grid, media queries)
- JavaScript (vanilla, sem bibliotecas)
- [Font Awesome](https://fontawesome.com/) (ícones, via CDN)

**Backend:**
- Node.js + [Express](https://expressjs.com/)
- [better-sqlite3](https://github.com/WiseLibs/better-sqlite3) (banco de dados)
- [helmet](https://helmetjs.github.io/) (cabeçalhos de segurança)
- [express-rate-limit](https://github.com/express-rate-limit/express-rate-limit) (limite de requisições)
- [cors](https://github.com/expressjs/cors)

## Como rodar

### 1. Instalar as dependências do backend

```bash
cd ecommerce/backend
npm install
```

### 2. Popular o banco de dados

```bash
npm run seed
```

Isso cria o arquivo `backend/ecommerce.db` com os produtos iniciais. Pode rodar de novo a qualquer momento para resetar os dados.

### 3. Iniciar o servidor

```bash
npm start
```

O backend sobe em `http://localhost:3001` **e também serve o front-end** (não precisa rodar `python3 -m http.server` nem `npx serve` separado). Acesse `http://localhost:3001` no navegador.

### Variáveis de ambiente (opcional)

Copie `backend/.env.example` para `backend/.env` para customizar a porta ou a origem liberada pelo CORS:

```
PORT=3001
CORS_ORIGIN=*
```

## Segurança implementada no backend

- **Preço e total sempre recalculados no servidor** a partir do banco — o front-end nunca decide o valor final de uma compra
- **Queries parametrizadas** (`better-sqlite3` com prepared statements) — sem risco de SQL Injection
- **Validação de entrada**: IDs e quantidades são checados (tipo, faixa, limite máximo) antes de qualquer consulta
- **`helmet`**: cabeçalhos HTTP de segurança padrão (proteção contra clickjacking, MIME sniffing, etc.)
- **Rate limiting**: limite geral na API e um limite mais restrito no endpoint de checkout, contra abuso/força bruta
- **Limite de tamanho do corpo da requisição** (10kb), contra payloads maliciosos grandes
- **Nenhum dado de cartão é processado ou armazenado** — a página de pagamento é uma simulação; num cenário real, isso teria que passar por um gateway PCI-compliant (Stripe, Mercado Pago, PagSeguro etc.)

## Roadmap / próximos passos

- [ ] Autenticação real no login (hash de senha, sessão/JWT)
- [ ] Filtro por categoria e faixa de preço
- [ ] Página de detalhes do produto
- [ ] Painel para listar pedidos feitos (a tabela `orders` já existe no banco)
- [ ] Integração com um gateway de pagamento real
- [ ] Favoritos e notificações (já existem no menu, mas sem função ainda)

## Autor

Desenvolvido por **João Soares**


Desenvolvido por **João Soares**

- GitHub: [@joaosoares30](https://github.com/joaosoares30)
- LinkedIn: *adicione seu link*
- E-mail: *adicione seu e-mail*
