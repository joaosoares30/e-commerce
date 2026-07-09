# E-Commerce (versão front-end, sem backend)

Loja virtual front-end feita com **HTML, CSS e JavaScript puro** (sem frameworks, sem backend), como projeto de estudo/portfólio.

🔗 **Demo:** https://joaosoares30.github.io/e-commerce/

> Esta é a versão **anterior à adição do backend**. Os produtos ficam num arquivo `products.js` estático, e o carrinho/pagamento são calculados inteiramente no navegador (sem validação de servidor).

## Funcionalidades

- **Catálogo de produtos** renderizado dinamicamente via JavaScript (grid responsivo)
- **Busca de produtos** por nome (desktop e mobile)
- **Carrinho de compras** funcional, com persistência em `localStorage`:
  - Adicionar produto ao carrinho
  - Alterar quantidade (+/-)
  - Remover item
  - Cálculo automático de subtotal e total
  - Contador de itens no ícone do carrinho (header)
- **Página de pagamento**, acessada a partir do carrinho:
  - Abas para Cartão, Pix e Boleto
  - Preview animado do cartão (número, nome e validade em tempo real)
  - Cálculo automático de parcelas
  - Resumo do pedido com itens, subtotal, frete e total
  - Simulação de confirmação (limpa o carrinho e redireciona pra loja)
  - ⚠️ Ambiente 100% simulado — nenhum dado de pagamento é enviado ou armazenado de verdade
- **Página de login/cadastro** (layout, sem autenticação real ainda)
- **Menu responsivo** com hambúrguer para mobile
- Links para redes sociais no rodapé

## Estrutura do projeto

```
ecommerce/
├── index.html          # Página inicial (catálogo de produtos)
├── carrinho.html         # Página do carrinho de compras
├── pagamento.html          # Página de pagamento (cartão/pix/boleto)
├── login.html                 # Página de login/cadastro
├── style.css                     # Estilos (layout, responsividade)
├── script.js                        # Lógica: produtos, busca, carrinho, pagamento, menu mobile
├── products.js                         # Dados dos produtos (variável JS global)
└── img/                                    # Logo e banner
```

## Tecnologias

- HTML5
- CSS3 (Flexbox, Grid, media queries)
- JavaScript (vanilla, sem bibliotecas)
- [Font Awesome](https://fontawesome.com/) (ícones, via CDN)

## Como rodar

Não tem build nem dependências e **não precisa de servidor** — os produtos são carregados via `<script src="products.js">`, uma variável JavaScript comum, não `fetch()`. É só abrir o `index.html` no navegador (duplo clique funciona).

Se preferir, também pode servir com qualquer servidor estático:

```bash
cd ecommerce
python3 -m http.server 8000
# ou
npx serve .
```

## ⚠️ Sobre segurança nesta versão

Como não existe backend, **qualquer preço, quantidade ou total pode ser manipulado pelo navegador** (DevTools). Não há validação nenhuma do lado do servidor porque não existe servidor. Isso é aceitável para portfólio/estudo de front-end, mas não deveria ser usado como uma loja real. A versão com backend (Node.js + Express + SQLite), que corrige exatamente esse problema, foi desenvolvida depois — fala comigo se quiser ela em vez desta.

## Roadmap / próximos passos

- [ ] Backend real validando preços e criando pedidos (já existe numa versão posterior deste projeto)
- [ ] Autenticação real no login
- [ ] Filtro por categoria e faixa de preço
- [ ] Página de detalhes do produto
- [ ] Favoritos e notificações (já existem no menu, mas sem função ainda)

## Autor

Desenvolvido por **João Soares**

- GitHub: [@joaosoares30](https://github.com/joaosoares30)
- LinkedIn: *adicione seu link*
- E-mail: *adicione seu e-mail*
