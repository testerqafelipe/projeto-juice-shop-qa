FROM node:18-alpine

WORKDIR /app

# Copia todos os arquivos do projeto de uma vez para garantir que pastas como frontend existam
COPY . .

# Instala as dependências da raiz
RUN npm install --legacy-peer-deps

# Entra na pasta frontend, limpa o cache e instala as dependências
WORKDIR /app/frontend
RUN npm cache clean --force
RUN npm install --legacy-peer-deps

# Volta para a raiz e faz o build completo
WORKDIR /app
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]