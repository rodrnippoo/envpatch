/**
 * inherit.js — Merge env files with inheritance chain support
 * Allows a .env to extend another, with child values taking priority.
 */

/**
 * Resolve an inheritance chain from a list of parsed envs.
 * First env in array is the base (lowest priority), last is the child (highest).
 * @param {Array<Object>} envs - ordered list of parsed env objects
 * @returns {Object} merged result
 */
function resolveChain(envs) {
  if (!Array.isArray(envs) || envs.length === 0) return {};
  return envs.reduce((acc, env) => Object.assign({}, acc, env), {});
}

/**
 * Inherit keys from a base env that are missing in the child.
 * @param {Object} base
 * @param {Object} child
 * @returns {Object}
 */
function inheritMissing(base, child) {
  const result = Object.assign({}, child);
  for (const key of Object.keys(base)) {
    if (!(key in result)) {
      result[key] = base[key];
    }
  }
  return result;
}

/**
 * Determine which keys were inherited (present in base but not in child).
 * @param {Object} base
 * @param {Object} child
 * @returns {string[]}
 */
function inheritedKeys(base, child) {
  return Object.keys(base).filter(key => !(key in child));
}

/**
 * Summarize the result of an inheritance merge.
 * @param {Object} base
 * @param {Object} child
 * @returns {Object}
 */
function inheritSummary(base, child) {
  const inherited = inheritedKeys(base, child);
  const overridden = Object.keys(child).filter(key => key in base);
  const added = Object.keys(child).filter(key => !(key in base));
  return {
    inherited,
    overridden,
    added,
    total: Object.keys(inheritMissing(base, child)).length,
  };
}

module.exports = { resolveChain, inheritMissing, inheritedKeys, inheritSummary };
