# Discord Registration Bot

Bot de Discord para registro y validación de usuarios con HubSpot.

## Características

- 🔒 Detecta usuarios con rol "No Verificado" al entrar al servidor
- 👋 Envía mensaje de bienvenida automático con términos de conducta
- 📧 Solicita correo electrónico mediante un modal
- ✅ Valida el email contra HubSpot (a través de la API de HeroLabs)
- 🎭 Quita el rol "No Verificado" tras validación exitosa
- 🔄 Botón de reintentar si la validación falla

## Requisitos

- Node.js 18.0.0 o superior
- Una aplicación de Discord con un bot configurado
- Cuenta en la API de HeroLabs para validación con HubSpot

## Configuración

### 1. Crear aplicación en Discord

1. Ve a [Discord Developer Portal](https://discord.com/developers/applications)
2. Crea una nueva aplicación
3. Ve a la sección "Bot" y crea un bot
4. Copia el token del bot
5. Activa los siguientes **Privileged Gateway Intents**:
   - ✅ SERVER MEMBERS INTENT (obligatorio)
   - ✅ MESSAGE CONTENT INTENT

### 2. Invitar el bot al servidor

Genera la URL de invitación con los siguientes permisos:

- `View Channels`
- `Send Messages`
- `Manage Roles`

Scopes necesarios:

- `bot`
- `applications.commands`

### 3. Crear rol "No Verificado"

1. En tu servidor de Discord, crea un rol llamado "No Verificado"
2. Copia el ID del rol (clic derecho → "Copiar ID del rol")
3. Configura los canales para que este rol NO pueda verlos
4. Asigna este rol a los usuarios que necesiten validación

### 4. Configurar variables de entorno

```bash
cp .env.example .env
```

Edita el archivo `.env` con tus credenciales:

```env
DISCORD_TOKEN=tu_token_del_bot
UNVERIFIED_ROLE_ID=id_del_rol_no_verificado
API_EMAIL=tu_email_api
API_PASSWORD=tu_password_api
```

### 5. Instalar dependencias

```bash
npm install
```

### 6. Ejecutar el bot

```bash
# Producción
npm start

# Desarrollo (con hot reload)
npm run dev
```

## Estructura del Proyecto

```
bot-discord/
├── src/
│   ├── index.js                # Entrada principal del bot
│   ├── config/
│   │   └── constants.js        # Constantes y configuración
│   ├── events/
│   │   └── guildMemberAdd.js   # Evento de nuevo miembro
│   ├── handlers/
│   │   └── registration.js     # Lógica de registro y validación
│   └── services/
│       └── hubspotValidator.js # Validación con HubSpot via API
├── .env.example                # Ejemplo de variables de entorno
├── .gitignore
├── package.json
└── README.md
```

## Flujo del Bot

```
Usuario entra al servidor
         ↓
   ¿Tiene rol "No Verificado"?
         ↓
    ┌────┴────┐
    SÍ        NO
    ↓         ↓
  DM con    (nada)
  términos
    ↓
  Modal de email
    ↓
  Validación HubSpot
    ↓
    ┌────┴────┐
  VÁLIDO    ERROR
    ↓         ↓
  Quita    Botón de
  rol      reintentar
    ↓
  Acceso completo
```

## Despliegue

### 🐳 Docker (Recomendado)

La forma más fácil de desplegar:

```bash
# 1. Configura tu .env
cp .env.example .env
nano .env  # edita con tus credenciales

# 2. Construye y ejecuta con Docker Compose
docker compose up -d

# Ver logs
docker compose logs -f

# Detener
docker compose down
```

O sin Docker Compose:

```bash
# Construir imagen
docker build -t discord-bot .

# Ejecutar
docker run -d --name discord-bot --env-file .env discord-bot
```

### AWS Lightsail ($3.50/mes)

1. Crea una instancia en [Lightsail](https://lightsail.aws.amazon.com)
2. Selecciona blueprint: Node.js o Docker
3. Plan: $3.50/mes (512 MB RAM)
4. Clona el repositorio y ejecuta con Docker

### Railway (Fácil - $5 crédito gratis/mes)

1. Ve a [railway.app](https://railway.app)
2. Conecta tu repositorio de GitHub
3. Añade las variables de entorno
4. Deploy automático con cada push (detecta Dockerfile)

### PM2 (sin Docker)

```bash
npm install -g pm2
pm2 start src/index.js --name "discord-bot"
pm2 startup
pm2 save
```

## Licencia

ISC
