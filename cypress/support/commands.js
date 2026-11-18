/// <reference types="cypress" />
// A linha acima faz o VS Code "entender" o Cypress e sugerir comandos enquanto você digita.

// ============================================================
// CUSTOM COMMANDS (comandos personalizados)
// São "atalhos" criados por nós para reaproveitar passos
// que se repetem em vários testes. Escreve uma vez, usa em todos.
// ============================================================


// ------------------------------------------------------------
// COMANDO: cy.abrirTelaDeLogin()
// Usado nos testes de TELA (E2E): login.cy.js e cadastro.cy.js
// Faz o caminho que um usuário real faria até a tela de login.
// ------------------------------------------------------------
Cypress.Commands.add('abrirTelaDeLogin', () => {
  // Abre a página inicial da loja (o endereço base fica no cypress.config)
  cy.visit('/')

  // Fecha o banner de boas-vindas que aparece na primeira visita
  cy.get('button[aria-label="Close Welcome Banner"]').click()

  // Fecha o aviso de cookies no rodapé
  cy.get('a[aria-label="dismiss cookie message"]').click()

  // Clica no menu "Account" (conta) no topo da página
  cy.get('button[id="navbarAccount"]').click()

  // Clica na opção "Login" dentro do menu
  cy.get('button[id="navbarLoginButton"]').click()
})


// ------------------------------------------------------------
// COMANDO: cy.apiLogin(email, password)
// Usado nos testes de API: api-carrinho-produtos.cy.js
// Faz login direto pela API (sem abrir a tela) e DEVOLVE o token e o número do carrinho.
// ------------------------------------------------------------
Cypress.Commands.add('apiLogin', (email, password) => {
  // Envia e-mail e senha para a rota de login da API
  return cy.request({
    method: 'POST',
    url: '/rest/user/login',
    body: { email, password }
  }).then((response) => {
    // Confere se o login foi aceito (200 = OK)
    expect(response.status).to.eq(200)
    expect(response.body).to.have.property('authentication')

    // Separa o token (pulseira) e o bid (número do carrinho) da resposta
    const { token, bid } = response.body.authentication

    // Garante que o token veio preenchido
    expect(token, 'JWT retornado no login').to.be.a('string').and.not.be.empty

    // ANTES: pendurava no "mural público" com Cypress.env() (inseguro).
    // AGORA: entrega direto para quem pediu, como passar algo de mão em mão.
    return cy.wrap({ token, basketId: bid })
  })
})


// ------------------------------------------------------------
// COMANDO: cy.criarUsuarioViaApi()
// Cria um usuário NOVO direto pela API (sem abrir a tela),
// para os testes de tela não dependerem de contas fixas.
// Devolve { email, senha } para o teste usar no login.
// ------------------------------------------------------------
Cypress.Commands.add('criarUsuarioViaApi', () => {
  // E-mail único a cada execução (Date.now() = número que muda a cada milissegundo)
  const email = `qa_e2e_${Date.now()}@email.com`

  // Senha de TESTE (não é de nenhuma conta real)
  const senha = 'SenhaSegura123!'

  // Envia o cadastro para a API, com os mesmos campos que a tela enviaria
  return cy.request({
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
    // Confere se o usuário foi criado (201 = Created)
    expect(response.status).to.eq(201)

    // Devolve o e-mail e a senha para o teste que chamou o comando
    return cy.wrap({ email, senha })
  })
})