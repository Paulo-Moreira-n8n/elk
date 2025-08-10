# Usar uma imagem base do node-js
FROM node:alpine

# Definir o diretório de trabalho no conteiner
WORKDIR /app

# Copiar package.json e package-lock.json
COPY package*.json ./

# Instalar as dependencias
RUN npm install

# Copiar o código da aplicação
COPY . .

# Porta http exposta
EXPOSE 8081

# Comando para executar a aplicação
CMD ["npm", "start"]

