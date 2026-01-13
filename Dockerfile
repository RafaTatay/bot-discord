# Imagen base de Node.js Alpine (más ligera)
FROM node:20-alpine

# Crear directorio de trabajo
WORKDIR /app

# Crear usuario no-root primero
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copiar archivos de dependencias primero (para aprovechar cache de Docker)
COPY --chown=nodejs:nodejs package*.json ./

# Instalar solo dependencias de producción
RUN npm ci --only=production

# Copiar el resto del código con permisos correctos
COPY --chown=nodejs:nodejs src ./src

# Cambiar a usuario no-root por seguridad
USER nodejs

# Comando para ejecutar el bot
CMD ["node", "src/index.js"]

