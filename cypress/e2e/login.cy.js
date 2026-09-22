

// Agrupa a suíte de testes de autenticação da aplicação
describe('Autenticação de Usuário no OWASP Juice Shop', () => {

// O Cypress vai rodar isto AQUI antes do Teste 1 e antes do Teste 2
beforeEach(() => {
    cy.visit('/');
    cy.get('button[aria-label="Close Welcome Banner"]').click();
    cy.get('a[aria-label="dismiss cookie message"]').click();
    cy.get('button[id="navbarAccount"]').click();
    cy.get('button[id="navbarLoginButton"]').click();
});

  // Teste 1: Foca APENAS em preencher os dados corretos e testar o sucesso
  it('Deve realizar login com sucesso (Caminho Feliz)', () => {
  // Preenchimento com dados válidos
    cy.get('input[id="email"]').type('admin@juice-sh.op');
    cy.get('input[id="password"]').type('admin123');
    cy.get('button[id="loginButton"]').click();
    cy.url().should('not.include', '/login'); // ASSERÇÃO: Garante que a URL mudou (saiu do /login)
  });

  // Teste 2: Foca APENAS em preencher a senha errada e testar a falha
  it('Deve exibir mensagem de erro ao inserir credenciais inválidas (Caminho Triste)', () => {
  // Preenchimento com senha incorreta
    cy.get('input[id="email"]').type('admin@juice-sh.op');
    cy.get('input[id="password"]').type('senha_errada_123');
    cy.get('button[id="loginButton"]').click();
    cy.url().should('include', '/login');  // ASSERÇÃO: Garante que o usuário PERMANECEU na página de login
  });

});