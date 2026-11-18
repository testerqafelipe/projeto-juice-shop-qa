/// <reference types="cypress" />

// ============================================================
// SUÍTE: Cadastro de Usuários pela TELA (E2E)
// Simula um cliente novo criando conta no OWASP Juice Shop.
// Sem {force: true}: o Cypress age como um usuário real e só
// interage com campos visíveis e disponíveis.
// ============================================================

describe('Cadastro de Usuários no OWASP Juice Shop', () => {

  // Roda ANTES DE CADA teste: leva até a tela de cadastro
  beforeEach(() => {
    // Vai até a tela de login (comando criado no commands.js)
    cy.abrirTelaDeLogin()

    // "Escuta" a chamada que carrega as perguntas de segurança.
    // Assim esperamos o formulário estar pronto, em vez de usar um tempo fixo.
    cy.intercept('GET', '**/api/SecurityQuestions*').as('perguntas')

    // Clica em "Not yet a customer?" para abrir o formulário de cadastro
    cy.get('div[id="newCustomerLink"]').click()

    // Espera as perguntas de segurança chegarem
    cy.wait('@perguntas')
  })

  // TESTE 1 (Caminho Feliz): cadastro completo com sucesso
  it('Deve cadastrar um novo usuário com sucesso (Caminho Feliz)', () => {
    // E-mail único a cada execução, para nunca repetir
    const emailAleatorio = `teste_${Date.now()}@teste.com`

    // Preenche e-mail, senha e repetição da senha
    cy.get('input[id="emailControl"]').type(emailAleatorio)
    cy.get('input[id="passwordControl"]').type('SenhaSegura123!')
        // O rótulo "Repeat Password" fica POR CIMA do campo até ele ser clicado.
    // Clicamos na "caixa" do campo primeiro (como um usuário faria), o rótulo sobe,
    // e aí digitamos. Assim evitamos o {force: true}.
    cy.get('input[id="repeatPasswordControl"]').parents('mat-form-field').click()
    cy.get('input[id="repeatPasswordControl"]').type('SenhaSegura123!')

    // Abre a lista de perguntas de segurança e escolhe uma
        // Mesmo "post-it": clica na caixa do campo, que abre a lista de perguntas
    cy.get('mat-select[name="securityQuestion"]').parents('mat-form-field').click()
    cy.get('[role="listbox"]').should('be.visible')
    cy.contains('mat-option', "Mother's maiden name?").click()

    // Preenche a resposta e clica em "Register"
        // Mesmo cuidado no campo "Answer": clica na caixa antes de digitar
    cy.get('input[id="securityAnswerControl"]').parents('mat-form-field').click()
    cy.get('input[id="securityAnswerControl"]').type('teste')
    cy.get('button[id="registerButton"]').click()

    // VALIDAÇÃO: a mensagem de sucesso apareceu
    cy.contains('Registration completed successfully').should('be.visible')
  })

  // TESTE 2 (Caminho Negativo): senhas diferentes
  it('Deve exibir erro ao inserir senhas que não coincidem', () => {
    const emailAleatorio = `teste_${Date.now()}@teste.com`

    cy.get('input[id="emailControl"]').type(emailAleatorio)
    cy.get('input[id="passwordControl"]').type('SenhaSegura123!')

    // Digita uma senha DIFERENTE e "sai" do campo (.blur = tirar o foco),
    // como o usuário faz ao clicar fora. É isso que dispara a validação.
        // Mesmo cuidado: clica na caixa do campo antes de digitar
    cy.get('input[id="repeatPasswordControl"]').parents('mat-form-field').click()
    cy.get('input[id="repeatPasswordControl"]').type('OutraSenha456!').blur()

    // VALIDAÇÃO 1: a mensagem de erro aparece
    cy.contains('Passwords do not match').should('be.visible')

    // VALIDAÇÃO 2: o botão "Register" fica BLOQUEADO (não deixa cadastrar)
    cy.get('button[id="registerButton"]').should('be.disabled')
  })

})