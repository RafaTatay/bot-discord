import { existsSync, appendFileSync, writeFileSync, readFileSync } from 'fs';
import { join } from 'path';

const LOGS_DIR = process.env.LOGS_DIR || '/app/logs';
const CSV_FILE = join(LOGS_DIR, 'registrations.csv');
const CSV_HEADERS = 'FECHA,USUARIO_ID,USUARIO_TAG,ACEPTO,CORREO,ROLES\n';

/**
 * Asegura que el archivo CSV exista con los headers
 */
function ensureCSVExists() {
  if (!existsSync(CSV_FILE)) {
    writeFileSync(CSV_FILE, CSV_HEADERS, 'utf8');
    console.log(`📁 Archivo de registros creado: ${CSV_FILE}`);
  }
}

/**
 * Escapa un valor para CSV (maneja comas y comillas)
 * @param {string} value - Valor a escapar
 * @returns {string} Valor escapado
 */
function escapeCSV(value) {
  if (!value) return '';
  
  const stringValue = String(value);
  
  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  
  return stringValue;
}

/**
 * Registra una verificación completada
 * @param {Object} data - Datos del registro
 * @param {string} data.userId - ID del usuario
 * @param {string} data.userTag - Tag del usuario (ej: usuario#1234)
 * @param {boolean} data.accepted - Si aceptó los términos
 * @param {string} data.email - Correo electrónico
 * @param {string[]} data.roles - Array de IDs de roles
 */
export function logRegistration({ userId, userTag, accepted, email, roles }) {
  try {
    ensureCSVExists();
    
    const timestamp = new Date().toISOString();
    const rolesString = roles.join(';');
    
    const row = [
      escapeCSV(timestamp),
      escapeCSV(userId),
      escapeCSV(userTag),
      accepted ? 'SI' : 'NO',
      escapeCSV(email),
      escapeCSV(rolesString),
    ].join(',') + '\n';
    
    appendFileSync(CSV_FILE, row, 'utf8');
    console.log(`📝 Registro guardado: ${userTag} - ${email}`);
  } catch (error) {
    console.error(`❌ Error al guardar registro:`, error.message);
  }
}

/**
 * Lee todos los registros del CSV
 * @returns {Object[]} Array de registros
 */
export function getRegistrations() {
  try {
    if (!existsSync(CSV_FILE)) {
      return [];
    }
    
    const content = readFileSync(CSV_FILE, 'utf8');
    const lines = content.trim().split('\n');
    
    // Saltar el header
    const dataLines = lines.slice(1);
    
    return dataLines.map(line => {
      const [fecha, usuarioId, usuarioTag, acepto, correo, roles] = parseCSVLine(line);
      return {
        fecha,
        usuarioId,
        usuarioTag,
        acepto: acepto === 'SI',
        correo,
        roles: roles ? roles.split(';') : [],
      };
    });
  } catch (error) {
    console.error(`❌ Error al leer registros:`, error.message);
    return [];
  }
}

/**
 * Parsea una línea CSV respetando comillas
 * @param {string} line - Línea CSV
 * @returns {string[]} Array de valores
 */
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current);
  return result;
}

