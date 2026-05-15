/**
 * scope.js — Filter and extract env entries by key scope/namespace
 */

/**
 * Extract entries whose keys start with a given scope prefix (e.g. "DB_").
 * Returns a new env object with the prefix optionally stripped.
 */
function scopeEnv(env, prefix, { strip = false } = {}) {
  const result = {};
  for (const [key, value] of Object.entries(env)) {
    if (key.startsWith(prefix)) {
      const newKey = strip ? key.slice(prefix.length) : key;
      result[newKey] = value;
    }
  }
  return result;
}

/**
 * Re-scope entries by adding a prefix to all keys.
 */
function addScope(env, prefix) {
  const result = {};
  for (const [key, value] of Object.entries(env)) {
    result[`${prefix}${key}`] = value;
  }
  return result;
}

/**
 * List all distinct scope prefixes present in env keys.
 * A scope prefix is defined as everything up to and including the first underscore.
 */
function listScopes(env) {
  const scopes = new Set();
  for (const key of Object.keys(env)) {
    const idx = key.indexOf('_');
    if (idx > 0) {
      scopes.add(key.slice(0, idx + 1));
    }
  }
  return Array.from(scopes).sort();
}

/**
 * Remove all entries matching a given scope prefix.
 */
function excludeScope(env, prefix) {
  const result = {};
  for (const [key, value] of Object.entries(env)) {
    if (!key.startsWith(prefix)) {
      result[key] = value;
    }
  }
  return result;
}

/**
 * Summarize scoping operation.
 */
function scopeSummary(original, scoped, prefix) {
  return {
    prefix,
    total: Object.keys(original).length,
    matched: Object.keys(scoped).length,
    excluded: Object.keys(original).length - Object.keys(scoped).length,
  };
}

module.exports = { scopeEnv, addScope, listScopes, excludeScope, scopeSummary };
