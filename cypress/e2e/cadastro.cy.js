/// <reference types="cypress" />

describe('Cadastro de Usuários no Owasp Juice Shop', () => {

beforeEach(() =>{
    cy.visit('/');
    cy.get('button[aria-label="Close Welcome Banner"]').click();
    cy.get('a[aria-label="dismiss cookie message"]').click();
    cy.get('button[id="navbarAccount"]').click();
    cy.get('button[id="navbarLoginButton"]').click();
});

// Teste 1: Foca APENAS em cadastrar novo usuário
it('Deve cadastrar um novo usuário com sucesso (Caminho Feliz)', () => {
    cy.get('div[id="newCustomerLink"]').click();
    // Exemplo com Date.now() para criar um e-mail único a cada execução
    const emailAleatorio = `teste_${Date.now()}@teste.com`;
    cy.get('input[id="emailControl"]').type(emailAleatorio);
    cy.get('input[id="passwordControl"]').type('123456');
    cy.get('input[id="repeatPasswordControl"]').type('123456', {force:true});
    cy.get('mat-select[name="securityQuestion"]').click({force: true});
    cy.get('mat-option').contains("Mother's maiden name?").click();
    cy.get('input[id="securityAnswerControl"]').type('teste',{force:true});
    cy.get('button[id="registerButton"]').click();
    cy.contains('Registration completed successfully').should('be.visible');
});

// Teste 2: Valida mensagem de erro para senhas diferentes
it('Deve exibir erro ao inserir senhas que não coincidem', () => {
    cy.get('div[id="newCustomerLink"]').click();
    const emailAleatorio = `teste_${Date.now()}@teste.com`;
    cy.get('input[id="emailControl"]').type(emailAleatorio);
 // Testando as senhas que não coincidem    
    cy.get('input[id="passwordControl"]').type('123456');
    cy.get('input[id="repeatPasswordControl"]').type('654321', {force:true});
    cy.get('input[id="securityAnswerControl"]').click({force:true});
    cy.contains('Passwords do not match').should('be.visible');
});


});