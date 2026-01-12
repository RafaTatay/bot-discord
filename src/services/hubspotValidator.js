const USER_BASE_URL = 'https://api.herolabs.learningheroes.com/users';
const INTEGRATION_MANAGER_BASE_URL = 'https://api.herolabs.learningheroes.com/integrations';
const X_USER_ID = '550e8400-e29b-41d4-a716-446655440000';

let cachedToken = null;
let tokenExpiry = null;

async function login() {
  const email = process.env.API_EMAIL;
  const password = process.env.API_PASSWORD;

  if (!email || !password) {
    throw new Error('API_EMAIL o API_PASSWORD no están configurados en .env');
  }

  const response = await fetch(`${USER_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error(`Error en login: ${response.status}`);
  }

  const data = await response.json();
  cachedToken = data.access_token;
  
  // Token expira en 30 días según el JWT, pero refrescamos cada 24h por seguridad
  tokenExpiry = Date.now() + 24 * 60 * 60 * 1000;
  
  console.log('🔑 Token de API obtenido correctamente');
  return cachedToken;
}

async function getToken() {
  if (cachedToken && tokenExpiry && Date.now() < tokenExpiry) {
    return cachedToken;
  }
  return await login();
}

export async function validateContactInHubSpot(email) {
  try {
    const token = await getToken();

    const response = await fetch(
      `${INTEGRATION_MANAGER_BASE_URL}/hubspot/contacts/${encodeURIComponent(email)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
          'x-user-id': X_USER_ID,
        },
      }
    );

    if (response.status === 404) {
      console.log(`❌ Contacto no encontrado en HubSpot: ${email}`);
      return { isValid: false, reason: 'not_found' };
    }

    if (!response.ok) {
      console.error(`❌ Error consultando HubSpot: ${response.status}`);
      return { isValid: false, reason: 'api_error' };
    }

    const data = await response.json();

    // Comprobar que el email en propiedades coincide (case-insensitive)
    const contactEmail = (data && data.properties && data.properties.email)
      ? data.properties.email.toLowerCase()
      : null;
    const receivedEmail = (email || '').toLowerCase();

    if (!contactEmail || contactEmail !== receivedEmail) {
      console.log(`❌ El email retornado (${contactEmail}) no coincide con el consultado (${receivedEmail})`);
      return { isValid: false, reason: 'email_mismatch' };
    }

    console.log(`✅ Contacto válido en HubSpot: ${email}`);
    return { 
      isValid: true,
      contact: data,
    };

  } catch (error) {
    console.error(`❌ Error validando contacto: ${error.message}`);
    return { isValid: false, reason: 'error', message: error.message };
  }
}

