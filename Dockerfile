FROM node:22-alpine

WORKDIR /app

# Copia os arquivos de configuração da raiz
COPY package*.json ./

# Instala as dependências da raiz ignorando scripts automáticos problemáticos
RUN npm install --ignore-scripts

# Copia todo o código do projeto para dentro do container
COPY . .

# Instala as dependências específicas do frontend para o Angular CLI funcionar
RUN cd frontend && npm install

# Executa o build completo (frontend + server)
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]