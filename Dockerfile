FROM node:22-alpine

WORKDIR /app

# Copia os arquivos de configuração da raiz
COPY package*.json ./

# Instala as dependências da raiz
RUN npm install --ignore-scripts

# Copia todo o código do projeto para dentro do container
COPY . .

# Instala as dependências do frontend usando a opção legacy para evitar conflitos de versão do npm
RUN cd frontend && npm install --legacy-peer-deps

# Executa o build completo (frontend + server)
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]