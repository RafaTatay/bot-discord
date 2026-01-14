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
**Al unirte a esta comunidad, aceptas nuestras normas:**

📜 **[Ver Términos y Condiciones completos](https://files.learningheroes.com/hubfs/%F0%9F%9A%80%20Programas/%F0%9F%93%8A%20Trading/Discord/ALUMNADO%20-%20NORMAS%20CONVIVENCIA%20DISCORD.pdf)**

El incumplimiento puede resultar en expulsión del servidor.
`;

