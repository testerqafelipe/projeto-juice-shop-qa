FROM node:22-alpine

WORKDIR /app

# Copia os arquivos de configuração da raiz
COPY package*.json ./

# Instala as dependências da raiz ignorando scripts problemáticos
RUN npm install --legacy-peer-deps

# Copia todo o resto do projeto
COPY . .

# Entra na pasta frontend e instala as dependências de lá
WORKDIR /app/frontend
RUN npm install --legacy-peer-deps

# Volta para a raiz e faz o build
WORKDIR /app
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]