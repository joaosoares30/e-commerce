# E-Commerce

Loja virtual front-end feita com **HTML, CSS e JavaScript puro** (sem frameworks), como projeto de estudo/portfólio.

🔗 **Demo:** https://joaosoares30.github.io/e-commerce/

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
├── index.html         # Página inicial (catálogo de produtos)
├── carrinho.html       # Página do carrinho de compras
├── pagamento.html        # Página de pagamento (cartão/pix/boleto)
├── login.html               # Página de login/cadastro
├── style.css                  # Estilos (layout, responsividade)
├── script.js                    # Lógica: produtos, busca, carrinho, pagamento, menu mobile
└── img/                            # Logo e banner
```

## Tecnologias

- HTML5
- CSS3 (Flexbox, Grid, media queries)
- JavaScript (vanilla, sem bibliotecas)
- [Font Awesome](https://fontawesome.com/) (ícones, via CDN)

## Como rodar

Não tem build nem dependências — é só abrir o `index.html` no navegador, ou servir a pasta com qualquer servidor estático:

```bash
# Python
python3 -m http.server 8000

# Node (com o pacote serve)
npx serve .
```

Depois acesse `http://localhost:8000`.

## Roadmap / próximos passos

- [ ] Autenticação real no login (hoje é só front-end estático)
- [ ] Filtro por categoria e faixa de preço
- [ ] Página de detalhes do produto
- [ ] Integração real de pagamento (backend + gateway como Stripe, Mercado Pago ou PagSeguro — a página atual é só uma simulação de front-end)
- [ ] Favoritos e notificações (já existem no menu, mas sem função ainda)

## Autor

Desenvolvido por **João Soares**
