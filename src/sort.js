/**
 * Sort and reorder .env file keys
 */

/**
 * Sort env keys alphabetically
 * @param {Object} env - parsed env object
 * @param {Object} options
 * @param {boolean} options.descending - sort in descending order
 * @returns {Object} sorted env object
 */
function sortKeys(env, { descending = false } = {}) {
  const keys = Object.keys(env).sort();
  if (descending) keys.reverse();
  return Object.fromEntries(keys.map(k => [k, env[k]]));
}

/**
 * Sort env keys by prefix group, then alphabetically within each group
 * @param {Object} env - parsed env object
 * @returns {Object} sorted env object
 */
function sortByPrefix(env) {
  const keys = Object.keys(env);
  const sorted = keys.sort((a, b) => {
    const prefixA = a.includes('_') ? a.split('_')[0] : '';
    const prefixB = b.includes('_') ? b.split('_')[0] : '';
    if (prefixA !== prefixB) return prefixA.localeCompare(prefixB);
    return a.localeCompare(b);
  });
  return Object.fromEntries(sorted.map(k => [k, env[k]]));
}

/**
 * Move specific keys to the top of the env object
 * @param {Object} env - parsed env object
 * @param {string[]} keys - keys to prioritize
 * @returns {Object} reordered env object
 */
function pinKeys(env, keys = []) {
  const pinned = keys.filter(k => k in env);
  const rest = Object.keys(env).filter(k => !keys.includes(k));
  return Object.fromEntries(
    [...pinned, ...rest].map(k => [k, env[k]])
  );
}

/**
 * Sort env keys by a custom order array, unknown keys go to the end
 * @param {Object} env - parsed env object
 * @param {string[]} order - desired key order
 * @returns {Object} reordered env object
 */
function sortByOrder(env, order = []) {
  const known = order.filter(k => k in env);
  const unknown = Object.keys(env)
    .filter(k => !order.includes(k))
    .sort();
  return Object.fromEntries(
    [...known, ...unknown].map(k => [k, env[k]])
  );
}

module.exports = { sortKeys, sortByPrefix, pinKeys, sortByOrder };
