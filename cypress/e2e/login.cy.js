/// <reference types="cypress" />

// ============================================================
// SUÍTE: Autenticação de Usuário pela TELA (E2E)
// Simula um usuário real fazendo login no OWASP Juice Shop.
// O usuário é criado pela API antes dos testes, então não há
// senha de conta real escrita no código.
// ============================================================

describe('Autenticação de Usuário no OWASP Juice Shop', () => {

  // "Caixinha" que vai guardar o e-mail e a senha do usuário criado.
  // Usamos "let" (e não "const") porque ela começa vazia e é preenchida depois.
  let usuario

  // Roda UMA VEZ, antes de todos os testes: cria o usuário pela API
  before(() => {
    cy.criarUsuarioViaApi().then((dados) => {
      usuario = dados // guarda { email, senha } na caixinha
    })
  })

  // Roda ANTES DE CADA teste: leva até a tela de login
  beforeEach(() => {
    cy.abrirTelaDeLogin()
  })

  // TESTE 1 (Caminho Feliz): login com dados corretos
  it('Deve realizar login com sucesso (Caminho Feliz)', () => {
    // Preenche com o e-mail e a senha do usuário criado
    cy.get('input[id="email"]').type(usuario.email)
    cy.get('input[id="password"]').type(usuario.senha)
    cy.get('button[id="loginButton"]').click()

    // VALIDAÇÃO 1: saiu da tela de login
    cy.url().should('not.include', '/login')

    // VALIDAÇÃO 2 (mais forte): o navegador guardou o token de acesso
    cy.window().its('localStorage.token').should('be.a', 'string').and('not.be.empty')
  })

  // TESTE 2 (Caminho Negativo): e-mail certo, senha errada
  it('Deve exibir mensagem de erro ao inserir credenciais inválidas (Caminho Negativo)', () => {
    cy.get('input[id="email"]').type(usuario.email)
    cy.get('input[id="password"]').type('SenhaErrada123!')
    cy.get('button[id="loginButton"]').click()

    // VALIDAÇÃO 1: o usuário PERMANECEU na tela de login
    cy.url().should('include', '/login')

    // VALIDAÇÃO 2: a mensagem de erro apareceu na tela
    cy.contains('Invalid email or password.').should('be.visible')
  })

})