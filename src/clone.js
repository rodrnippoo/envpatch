/**
 * Clone an env object, optionally filtering or transforming keys.
 */

/**
 * Deep clone an env record.
 * @param {Record<string, string>} env
 * @returns {Record<string, string>}
 */
function cloneEnv(env) {
  if (!env || typeof env !== 'object') throw new TypeError('env must be an object');
  return Object.assign({}, env);
}

/**
 * Clone only the specified keys from an env record.
 * @param {Record<string, string>} env
 * @param {string[]} keys
 * @returns {Record<string, string>}
 */
function cloneKeys(env, keys) {
  if (!Array.isArray(keys)) throw new TypeError('keys must be an array');
  return keys.reduce((acc, key) => {
    if (Object.prototype.hasOwnProperty.call(env, key)) {
      acc[key] = env[key];
    }
    return acc;
  }, {});
}

/**
 * Clone env excluding specified keys.
 * @param {Record<string, string>} env
 * @param {string[]} excludeKeys
 * @returns {Record<string, string>}
 */
function cloneExcluding(env, excludeKeys) {
  if (!Array.isArray(excludeKeys)) throw new TypeError('excludeKeys must be an array');
  const excluded = new Set(excludeKeys);
  return Object.keys(env).reduce((acc, key) => {
    if (!excluded.has(key)) {
      acc[key] = env[key];
    }
    return acc;
  }, {});
}

/**
 * Clone env with a key prefix filter.
 * @param {Record<string, string>} env
 * @param {string} prefix
 * @returns {Record<string, string>}
 */
function cloneByPrefix(env, prefix) {
  if (typeof prefix !== 'string') throw new TypeError('prefix must be a string');
  return Object.keys(env).reduce((acc, key) => {
    if (key.startsWith(prefix)) {
      acc[key] = env[key];
    }
    return acc;
  }, {});
}

module.exports = { cloneEnv, cloneKeys, cloneExcluding, cloneByPrefix };
