/**
 * mask.js — Partially obscure env values for safe display
 */

/**
 * Mask a value, revealing only the first and last few characters.
 * @param {string} value
 * @param {number} reveal - chars to show on each end
 * @returns {string}
 */
function maskValue(value, reveal = 2) {
  if (typeof value !== 'string') return '';
  if (value.length === 0) return '';
  if (value.length <= reveal * 2 + 2) return '*'.repeat(value.length);
  const start = value.slice(0, reveal);
  const end = value.slice(-reveal);
  const hidden = '*'.repeat(Math.max(4, value.length - reveal * 2));
  return `${start}${hidden}${end}`;
}

/**
 * Determine if a key should be masked based on name patterns.
 * @param {string} key
 * @returns {boolean}
 */
function shouldMask(key) {
  const patterns = [
    /secret/i,
    /password/i,
    /passwd/i,
    /token/i,
    /api[_-]?key/i,
    /private/i,
    /credential/i,
    /auth/i,
    /cert/i,
    /passphrase/i,
  ];
  return patterns.some((p) => p.test(key));
}

/**
 * Apply masking to an env object, returning a new object with masked values.
 * @param {Object} env
 * @param {Object} options
 * @param {number} [options.reveal]
 * @param {string[]} [options.keys] - explicit keys to mask (overrides auto-detect)
 * @returns {Object}
 */
function maskEnv(env, options = {}) {
  const { reveal = 2, keys } = options;
  const result = {};
  for (const [k, v] of Object.entries(env)) {
    const doMask = keys ? keys.includes(k) : shouldMask(k);
    result[k] = doMask ? maskValue(v, reveal) : v;
  }
  return result;
}

/**
 * List keys that will be masked in the given env.
 * @param {Object} env
 * @param {string[]} [keys]
 * @returns {string[]}
 */
function listMaskedKeys(env, keys) {
  return Object.keys(env).filter((k) =>
    keys ? keys.includes(k) : shouldMask(k)
  );
}

module.exports = { maskValue, shouldMask, maskEnv, listMaskedKeys };
