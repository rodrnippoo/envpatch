/**
 * coerce.js — Type coercion for .env values
 * Converts string env values to typed JS values and back.
 */

const BOOL_TRUE = /^(true|yes|1|on)$/i;
const BOOL_FALSE = /^(false|no|0|off)$/i;
const INT_RE = /^-?\d+$/;
const FLOAT_RE = /^-?\d+\.\d+$/;

/**
 * Coerce a string value to a typed JS value.
 * @param {string} value
 * @param {'boolean'|'number'|'integer'|'string'|'auto'} type
 * @returns {boolean|number|string}
 */
function coerceValue(value, type = 'auto') {
  if (type === 'boolean' || (type === 'auto' && (BOOL_TRUE.test(value) || BOOL_FALSE.test(value)))) {
    return BOOL_TRUE.test(value);
  }
  if (type === 'integer' || (type === 'auto' && INT_RE.test(value))) {
    const n = parseInt(value, 10);
    if (!isNaN(n)) return n;
  }
  if (type === 'number' || (type === 'auto' && FLOAT_RE.test(value))) {
    const n = parseFloat(value);
    if (!isNaN(n)) return n;
  }
  return value;
}

/**
 * Serialize a typed JS value back to a string for .env.
 * @param {any} value
 * @returns {string}
 */
function serializeValue(value) {
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  if (typeof value === 'number') return String(value);
  return String(value);
}

/**
 * Coerce all values in a parsed env object.
 * @param {Record<string, string>} env
 * @param {'auto'|'boolean'|'number'|'integer'|'string'} type
 * @returns {Record<string, any>}
 */
function coerceEnv(env, type = 'auto') {
  const result = {};
  for (const [key, value] of Object.entries(env)) {
    result[key] = coerceValue(value, type);
  }
  return result;
}

/**
 * Summary of what was coerced.
 * @param {Record<string, string>} original
 * @param {Record<string, any>} coerced
 * @returns {{ key: string, from: string, to: any, type: string }[]}
 */
function coerceSummary(original, coerced) {
  return Object.entries(coerced)
    .filter(([key, val]) => typeof val !== 'string')
    .map(([key, val]) => ({
      key,
      from: original[key],
      to: val,
      type: typeof val,
    }));
}

module.exports = { coerceValue, serializeValue, coerceEnv, coerceSummary };
