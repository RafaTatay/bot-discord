/**
 * Almacén en memoria para guardar los roles pendientes de usuarios
 * que están en proceso de verificación.
 * 
 * Estructura: Map<string, Set<string>>
 * - Key: `${guildId}-${userId}` (identificador único)
 * - Value: Set de IDs de roles a restaurar
 */

const pendingRolesMap = new Map();

/**
 * Genera la clave única para identificar un usuario en un servidor
 * @param {string} guildId - ID del servidor
 * @param {string} userId - ID del usuario
 * @returns {string} Clave única
 */
function generateKey(guildId, userId) {
  return `${guildId}-${userId}`;
}

/**
 * Guarda los roles de un usuario para restaurarlos después
 * @param {string} guildId - ID del servidor
 * @param {string} userId - ID del usuario
 * @param {string[]} roleIds - Array de IDs de roles a guardar
 */
export function saveRoles(guildId, userId, roleIds) {
  const key = generateKey(guildId, userId);
  pendingRolesMap.set(key, new Set(roleIds));
  console.log(`💾 Roles guardados para ${key}: [${roleIds.join(', ')}]`);
}

/**
 * Obtiene los roles guardados de un usuario
 * @param {string} guildId - ID del servidor
 * @param {string} userId - ID del usuario
 * @returns {string[]} Array de IDs de roles guardados
 */
export function getRoles(guildId, userId) {
  const key = generateKey(guildId, userId);
  const roles = pendingRolesMap.get(key);
  
  return roles ? Array.from(roles) : [];
}

/**
 * Elimina los roles guardados de un usuario (después de restaurarlos)
 * @param {string} guildId - ID del servidor
 * @param {string} userId - ID del usuario
 */
export function clearRoles(guildId, userId) {
  const key = generateKey(guildId, userId);
  pendingRolesMap.delete(key);
  console.log(`🗑️ Roles pendientes eliminados para ${key}`);
}

/**
 * Verifica si un usuario tiene roles pendientes guardados
 * @param {string} guildId - ID del servidor
 * @param {string} userId - ID del usuario
 * @returns {boolean} True si tiene roles guardados
 */
export function hasRoles(guildId, userId) {
  const key = generateKey(guildId, userId);
  return pendingRolesMap.has(key);
}

