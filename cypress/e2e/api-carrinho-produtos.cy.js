/// <reference types="cypress" />

// ============================================================
// SUÍTE: Testes de API de Produtos e Carrinho (feitos no Cypress)
// Testa direto as "rotas" da API, sem abrir a tela.
// ============================================================

describe('API - Produtos e Carrinho de Compras', () => {

  // Caixinha que vai guardar { email, senha } do usuário de teste
  let usuario

  // Roda UMA VEZ antes de todos: cria o usuário pela API.
  // ANTES: o cadastro estava escrito aqui por inteiro (código repetido).
  // AGORA: reaproveita o comando do commands.js (DRY).
  before(() => {
    cy.criarUsuarioViaApi().then((dados) => {
      usuario = dados
    })
  })

  it('Deve listar produtos, autenticar e adicionar um item ao carrinho (Caminho Feliz)', () => {
    // Caixinha para o id do produto escolhido
    let productId

    // PASSO 1 - GET Produtos: busca a lista para pegar um produto válido
    cy.request('GET', '/rest/products/search?q=').then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body.data).to.be.an('array').and.not.be.empty

      // Guarda o id do primeiro produto da lista
      productId = response.body.data[0].id
      expect(productId, 'id do produto').to.exist
    })

    // PASSO 2 - Login pela API: recebe o token e o número do carrinho "na mão"
    cy.apiLogin(usuario.email, usuario.senha).then(({ token, basketId }) => {
      expect(basketId, 'BasketId retornado no login').to.exist

      // PASSO 3 - POST Carrinho: adiciona o produto ao carrinho (precisa do token)
      cy.request({
        method: 'POST',
        url: '/api/BasketItems/',
        headers: { Authorization: `Bearer ${token}` },
        body: { ProductId: productId, BasketId: basketId, quantity: 1 }
      }).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.status).to.eq('success')
        expect(response.body.data).to.include({ ProductId: productId, BasketId: basketId })
      })

      // PASSO 4 - GET Carrinho: confere se o produto realmente está lá
      cy.request({
        method: 'GET',
        url: `/rest/basket/${basketId}`,
        headers: { Authorization: `Bearer ${token}` }
      }).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.data).to.have.property('Products').that.is.an('array')

        // Separa só os ids dos produtos do carrinho e procura o nosso
        const idsNoCarrinho = response.body.data.Products.map((item) => item.id)
        expect(idsNoCarrinho).to.include(productId)
      })
    })
  })

  it('Deve recusar inclusão no carrinho sem token JWT (Caminho Negativo / Segurança)', () => {
    // Tenta adicionar ao carrinho SEM a pulseira (sem o cabeçalho Authorization)
    cy.request({
      method: 'POST',
      url: '/api/BasketItems/',
      failOnStatusCode: false, // não para o teste no erro, porque o erro é o ESPERADO
      body: { ProductId: 1, BasketId: 1, quantity: 1 }
    }).then((response) => {
      // A API precisa barrar: 401 (sem autorização) ou 403 (proibido)
      expect(response.status).to.be.oneOf([401, 403])
    })
  })

})