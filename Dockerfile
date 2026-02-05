# Usamos una imagen ligera de Node
FROM node:18-alpine

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiamos primero los archivos de dependencias para aprovechar el caché
COPY package*.json ./

# Instalamos dependencias
RUN npm install

# Copiamos el resto del código fuente
COPY . .

# Compilamos TypeScript a JavaScript (creará la carpeta /dist)
RUN npm run build

# Exponemos el puerto que usa la app
EXPOSE 3000

# Comando para iniciar la app compilada
CMD ["npm", "start"]