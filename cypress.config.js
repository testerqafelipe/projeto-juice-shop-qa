// Importa a função de configuração padrão do Cypress
const { defineConfig } = require("cypress");

// Exporta as configurações globais do projeto
module.exports = defineConfig({
  e2e: {
    // Define a URL base padrão apontando para o seu Staging no Render
    baseUrl: 'https://juice-shop-staging-tqfy.onrender.com', // <-- Cole aqui a sua URL exata do Render
    
    // Caminho do arquivo de suporte global do Cypress
    supportFile: 'cypress/support/e2e.js',

    // Função reservada para eventos do Node.js
    setupNodeEvents(on, config) {
      // Eventos personalizados (vazio por enquanto)
    },
  },
});