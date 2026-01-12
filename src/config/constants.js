import { config } from 'dotenv';
config();

export const COLORS = {
  PRIMARY: 0x5865f2,
  SUCCESS: 0x57f287,
  ERROR: 0xed4245,
  WARNING: 0xfee75c,
};

// ID del rol "No Verificado" que se quita después de completar el registro
export const UNVERIFIED_ROLE_ID = process.env.UNVERIFIED_ROLE_ID || '1460051137460699358';

export const BUTTON_IDS = {
  ACCEPT_TERMS: 'accept_terms_button',
  RETRY_VALIDATION: 'retry_validation_button',
};

export const MODAL_IDS = {
  EMAIL_REGISTRATION: 'email_registration_modal',
};

export const INPUT_IDS = {
  EMAIL: 'email_input',
};

// Correo de soporte para errores de validación
export const SUPPORT_EMAIL = 'soporte@learningheroes.com';

export const TERMS_OF_CONDUCT = `
**Al unirte a esta comunidad, aceptas:**

1. **Uso responsable**: Utilizar este espacio de forma profesional y constructiva.
2. **Respeto mutuo**: Tratar a todos los miembros con respeto y cortesía.
3. **Confidencialidad**: No compartir contenido exclusivo fuera de la comunidad.
4. **Sin spam**: No enviar mensajes repetitivos o publicidad no autorizada.
5. **Contenido apropiado**: No compartir contenido ofensivo, ilegal o inapropiado.
6. **Protección de datos**: Tu email será verificado con nuestro sistema para confirmar tu acceso.

El incumplimiento de estas normas puede resultar en la expulsión del servidor.
`;

