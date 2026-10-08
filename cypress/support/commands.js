/// <reference types="cypress" />

Cypress.Commands.add('apiLogin', (email, password) => {
  return cy.request({
    method: 'POST',
    url: '/rest/user/login',
    body: {
      email,
      password
    }
  }).then((response) => {
    expect(response.status).to.eq(200)
    expect(response.body).to.have.property('authentication')

    const { token, bid } = response.body.authentication

    expect(token, 'JWT retornado no login').to.be.a('string').and.not.be.empty

    Cypress.env('authToken', token)
    Cypress.env('basketId', bid)

    return cy.wrap(token)
  })
})
