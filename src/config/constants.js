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

1. **RESPETO SIEMPRE**: Trata a todas las personas con respeto. No se toleran insultos o ataques personales ni actitudes agresivas, forma despectiva/menospreciable o con ironía que comprometan la imagen de cualquier miembro/institución. Aquí venimos a aprender juntos.

2. **FOCO EN EDUCACIÓN**: Para mantener un ambiente de aprendizaje sano, no está permitido compartir ni debatir opiniones políticas o religiosas dentro de la comunidad.

3. **CERO SPAM/PROMOCIONES**: Está totalmente prohibido promocionar proyectos, servidores, links de referidos (Airdrops exentos), tokens, servicios o contactar por privado con fines comerciales sin autorización del staff. Incumplir esta norma puede implicar expulsión inmediata.

4. **SOPORTE POR LOS CANALES OFICIALES**: Este servidor no sustituye al soporte oficial. Para dudas técnicas, problemas personales o casos específicos, contacta al equipo de soporte por los canales habilitados.

5. **DO YOUR OWN RESEARCH (DYOR)**: La información compartida en la comunidad es educativa y basada en opiniones personales. No constituye recomendación de inversión, promesa de resultados u obligación. Haz siempre tu propio análisis (DYOR).

6. **EXENCIÓN DE RESPONSABILIDAD**: Learning Heroes, el staff y los miembros de la comunidad no se hacen responsables de decisiones financieras o acciones tomadas a partir de lo compartido aquí, cualquier mención o atribución a ello queda expresamente prohibido.

7. **RESPETO AL PERSONAL**: Los moderadores/staff están para ayudarte y mantener el orden por lo que podrán tomar cualquier acción para garantizar la calidad y objetivo de la comunidad. Sigue sus indicaciones para el buen funcionamiento de la comunidad.

8. **PRIVACIDAD Y SEGURIDAD ANTE TODO**: Está prohibido compartir o solicitar datos personales (como números de teléfonos, emails u otros contactos). Toda interacción debe mantenerse dentro del servidor para proteger a la comunidad.

9. **GRUPOS ALTERNOS Y DATOS PERSONALES**: Está prohibido crear grupos alternos o compartir información personal de cualquier tipo dentro de los canales oficiales. Learning Heroes no se responsabiliza de información externa que no esté tutelada o moderada por la organización.

10. **CUIDAMOS LO QUE CONSTRUIMOS**: Si detectas comportamientos sospechosos, repórtalos al staff. Entre todos mantenemos este espacio seguro, educativo y alineado con los valores de un verdadero HÉROE.

11. **ENTORNO EDUCATIVO**: Cualquier conversación o contenido que no esté relacionado con el ecosistema crypto, blockchain, mercados financieros o trading será eliminado.

12. **DERECHO DE ADMISIÓN**: Los moderadores se reservan el derecho de admisión, con el objetivo de proteger el buen funcionamiento, la seguridad y el espíritu educativo de la comunidad.

El incumplimiento de estas normas puede resultar en la expulsión del servidor.
`;

