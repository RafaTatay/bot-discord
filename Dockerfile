# Imagen base de Node.js Alpine (más ligera)
FROM node:20-alpine

# Crear directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias primero (para aprovechar cache de Docker)
COPY package*.json ./

# Instalar solo dependencias de producción
RUN npm ci --only=production

# Copiar el resto del código
COPY src ./src

# Usuario no-root por seguridad
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001
USER nodejs

# Comando para ejecutar el bot
CMD ["node", "src/index.js"]

