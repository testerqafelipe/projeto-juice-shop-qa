/// <reference types="cypress" />

describe('API - Produtos e Carrinho de Compras', () => {
  const senha = 'SenhaSegura123!'
  const email = `qa_cart_${Date.now()}@email.com`

  // Configuração inicial: cria um novo usuário para garantir que o teste tenha um ambiente limpo
  before(() => {
    // Requisição POST para criar um novo usuário via API
    cy.request({
      method: 'POST',
      url: '/api/Users',
      body: {
        email,
        password: senha,
        passwordRepeat: senha,
        securityQuestion: {
          id: 1,
          question: "Your eldest sibling's middle name?",
          createdAt: '2026-01-01T00:00:00.000Z',
          updatedAt: '2026-01-01T00:00:00.000Z'
        },
        securityAnswer: 'resposta'
      }
    }).then((response) => {
      // Valida se o usuário foi criado com sucesso (Status 201)
      expect(response.status).to.eq(201)
    })
  })

  it('Deve listar produtos, autenticar e adicionar um item ao carrinho (Caminho Feliz)', () => {
    // GET Produtos: Busca a lista de produtos disponíveis para obter um ID válido
    cy.request({
      method: 'GET',
      url: '/rest/products/search?q='
    }).then((response) => {
      // Valida o retorno da lista de produtos
      expect(response.status).to.eq(200)
      expect(response.body.data).to.be.an('array').and.not.be.empty

      // Armazena o ID do primeiro produto encontrado para usar na inclusão ao carrinho
      const produto = response.body.data[0]
      expect(produto).to.have.property('id')
      Cypress.env('productId', produto.id)
    })

    // Login: Autentica o usuário recém-criado para obter o token de acesso e o ID do carrinho (BasketId)
    cy.apiLogin(email, senha).then((token) => {
      const productId = Cypress.env('productId')
      const basketId = Cypress.env('basketId')

      // Garante que o BasketId foi retornado corretamente no login
      expect(basketId, 'BasketId retornado no login').to.exist

      // POST Carrinho: Adiciona o produto selecionado ao carrinho do usuário
      cy.request({
        method: 'POST',
        url: '/api/BasketItems/',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: {
          ProductId: productId,
          BasketId: basketId,
          quantity: 1
        }
      }).then((response) => {
        // Valida se o item foi adicionado com sucesso
        expect(response.status).to.eq(200)
        expect(response.body.status).to.eq('success')
        expect(response.body.data).to.include({
          ProductId: productId,
          BasketId: basketId
        })
      })

      // Validação: Consulta o carrinho para confirmar se o produto realmente consta na lista
      cy.request({
        method: 'GET',
        url: `/rest/basket/${basketId}`,
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.data).to.have.property('Products').that.is.an('array')

        // Verifica se o ID do produto está presente na lista de produtos do carrinho
        const idsNoCarrinho = response.body.data.Products.map((item) => item.id)
        expect(idsNoCarrinho).to.include(productId)
      })
    })
  })

  it('Deve recusar inclusão no carrinho sem token JWT (Caminho Negativo / Segurança)', () => {
    // Teste Negativo: Tenta adicionar um item ao carrinho sem fornecer o cabeçalho de autorização (token)
    cy.request({
      method: 'POST',
      url: '/api/BasketItems/',
      failOnStatusCode: false, // Permite que o teste continue mesmo com erro HTTP esperado
      body: {
        ProductId: 1,
        BasketId: 1,
        quantity: 1
      }
    }).then((response) => {
      // Valida se a API barrou o acesso não autorizado (401 ou 403)
      expect(response.status).to.be.oneOf([401, 403])
    })
  })
})
