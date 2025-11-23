# Usamos una imagen de Node.js ligera
FROM node:20-alpine

# Directorio de trabajo dentro de la nube
WORKDIR /app

# 1. Copiamos los archivos de configuración primero (para aprovechar el caché)
COPY package*.json ./

# 2. Instalamos las dependencias
RUN npm install

# 3. Copiamos todo el código fuente de tu Angular
COPY . .

# 4. Construimos la aplicación (Esto generará la carpeta dist/HelpDesk)
RUN npm run build

# 5. Configuración del puerto para Cloud Run
ENV PORT=8080
EXPOSE 8080

# 6. EL COMANDO DE ARRANQUE (Aquí está la clave según tu foto)
# Le decimos a Node que ejecute el archivo server.mjs que se generó
CMD ["node", "dist/HelpDesk/server/server.mjs"]
