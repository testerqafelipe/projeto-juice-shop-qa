FROM node:22-alpine

WORKDIR /app

# Copia todos os arquivos do projeto de uma vez para que a pasta frontend e os packages existam
COPY . .

# Instala as dependências da raiz (permitindo que o postinstall execute corretamente com a pasta frontend presente)
RUN npm install --legacy-peer-deps

EXPOSE 3000

CMD ["npm", "start"]