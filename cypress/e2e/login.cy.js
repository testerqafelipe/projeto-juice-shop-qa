// Agrupa a suíte de testes de autenticação da aplicação
describe('Autenticação de Usuário no OWASP Juice Shop', () => {

  // Caso de teste para validar o acesso à aplicação em Staging
  it('Deve acessar a página inicial em Staging com sucesso', () => {
    
    // Navega para a rota raiz combinando automaticamente com a baseUrl configurada
    cy.visit('/');
    cy.get('button[aria-label="Close Welcome Banner"]').click();
    cy.get('a[aria-label="dismiss cookie message"]').click();
    cy.get('button[id="navbarAccount"]').click();
    cy.get('button[id="navbarLoginButton"]').click();
  });

});