/**
 * Flatten nested env objects or expand dotted keys into nested structures.
 */

/**
 * Expand a flat env map with dotted keys into a nested object.
 * e.g. { 'DB.HOST': 'localhost' } => { DB: { HOST: 'localhost' } }
 * @param {Record<string, string>} env
 * @returns {Record<string, any>}
 */
function expandDotted(env) {
  const result = {};
  for (const [key, value] of Object.entries(env)) {
    const parts = key.split('.');
    let cursor = result;
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (cursor[part] == null || typeof cursor[part] !== 'object') {
        cursor[part] = {};
      }
      cursor = cursor[part];
    }
    cursor[parts[parts.length - 1]] = value;
  }
  return result;
}

/**
 * Flatten a nested object into a flat env map with dotted keys.
 * e.g. { DB: { HOST: 'localhost' } } => { 'DB.HOST': 'localhost' }
 * @param {Record<string, any>} obj
 * @param {string} [prefix]
 * @returns {Record<string, string>}
 */
function flattenDotted(obj, prefix = '') {
  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      Object.assign(result, flattenDotted(value, fullKey));
    } else {
      result[fullKey] = String(value);
    }
  }
  return result;
}

/**
 * List all dotted keys present in an env map.
 * @param {Record<string, string>} env
 * @returns {string[]}
 */
function listDottedKeys(env) {
  return Object.keys(env).filter(k => k.includes('.'));
}

/**
 * Check whether an env map contains any dotted keys.
 * @param {Record<string, string>} env
 * @returns {boolean}
 */
function hasDottedKeys(env) {
  return listDottedKeys(env).length > 0;
}

module.exports = { expandDotted, flattenDotted, listDottedKeys, hasDottedKeys };
