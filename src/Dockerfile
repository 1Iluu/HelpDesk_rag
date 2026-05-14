FROM node:18-alpine
WORKDIR /app

# 1. Copiamos tu carpeta dist
COPY dist ./dist

# 2. Instalamos serve
RUN npm install -g serve

# 3. EL TRUCO DE MAGIA: Renombramos ese archivo .csr a index.html normal
RUN mv dist/HelpDesk/browser/index.csr.html dist/HelpDesk/browser/index.html

# 4. Levantamos el servidor en modo SPA
CMD ["serve", "-s", "dist/HelpDesk/browser", "-l", "80"]