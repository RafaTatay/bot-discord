# Discord Registration Bot

Bot de Discord para registro de usuarios con validación de email.

## Características

- 👋 Envía mensaje de bienvenida automático cuando un usuario entra al servidor
- 📋 Muestra términos de conducta que el usuario debe aceptar
- 📧 Solicita correo electrónico mediante un modal
- ✅ Valida el formato del correo electrónico
- 🔄 Preparado para integración con HubSpot (pendiente de implementar)

## Requisitos

- Node.js 18.0.0 o superior
- Una aplicación de Discord con un bot configurado

## Configuración

### 1. Crear aplicación en Discord

1. Ve a [Discord Developer Portal](https://discord.com/developers/applications)
2. Crea una nueva aplicación
3. Ve a la sección "Bot" y crea un bot
4. Copia el token del bot
5. Activa los siguientes **Privileged Gateway Intents**:
   - SERVER MEMBERS INTENT
   - MESSAGE CONTENT INTENT

### 2. Invitar el bot al servidor

Genera la URL de invitación con los siguientes permisos:

- `View Channels`
- `Send Messages`
- `Manage Roles` (si deseas asignar roles automáticamente)

Scopes necesarios:

- `bot`
- `applications.commands`

### 3. Configurar variables de entorno

```bash
cp .env.example .env
```

Edita el archivo `.env` con tus credenciales:

```env
DISCORD_TOKEN=tu_token_aqui
HUBSPOT_API_KEY=tu_api_key_aqui
```

### 4. Instalar dependencias

```bash
npm install
```

### 5. Ejecutar el bot

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
│   ├── index.js              # Entrada principal del bot
│   ├── config/
│   │   └── constants.js      # Constantes y configuración
│   ├── events/
│   │   └── guildMemberAdd.js # Evento de nuevo miembro
│   └── handlers/
│       └── registration.js   # Lógica de registro
├── .env.example              # Ejemplo de variables de entorno
├── package.json
└── README.md
```

## Flujo del Bot

1. Usuario entra al servidor
2. Bot envía DM con términos de conducta y botón de aceptar
3. Usuario hace clic en "Aceptar y Registrarme"
4. Se abre modal solicitando correo electrónico
5. Usuario ingresa correo y envía
6. Bot valida formato del correo
7. (Pendiente) Validación con HubSpot
8. Confirmación de registro exitoso

## TODO

- [ ] Implementar validación con HubSpot API
- [ ] Asignar rol verificado automáticamente
- [ ] Agregar logging persistente
- [ ] Manejar casos donde el usuario tiene DMs desactivados

## Licencia

ISC
