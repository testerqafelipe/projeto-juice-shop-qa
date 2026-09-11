FROM node:18-alpine

WORKDIR /app

# Instala dependências globais necessárias para build do Angular se precisar
RUN npm install -g npm@latest

# Copia os arquivos de configuração da raiz
COPY package*.json ./

# Instala as dependências da raiz de forma limpa
RUN npm ci --legacy-peer-deps || npm install --legacy-peer-deps

# Copia todo o código do projeto para dentro do container
COPY . .

# Entra na pasta frontend e limpa o cache do npm antes de instalar para evitar o erro 'edgesOut'
WORKDIR /app/frontend
RUN npm cache clean --force
RUN npm install --legacy-peer-deps

# Volta para a raiz e roda o build completo
WORKDIR /app
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]