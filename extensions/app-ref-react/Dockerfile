# Usar a imagem oficial do node
#FROM node:alpine
#WORKDIR /usr/share/nginx/html
#USER root
#ENV NPM_CONFIG_PREFIX=/tmp/.npm HOME=/tmp CI=false
#RUN npm install

# Usar a imagem oficial do Nginx
FROM nginx:alpine

# Remover o arquivo de configuração padrão do Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copiar os arquivos da aplicação para o diretório padrão do Nginx
COPY index.html /usr/share/nginx/html/
COPY assets/ /usr/share/nginx/html/assets/

# (Opcional) Copiar um arquivo de configuração customizado do Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expor a porta 80
EXPOSE 80

# Comando padrão para rodar o Nginx
CMD ["nginx", "-g", "daemon off;"]