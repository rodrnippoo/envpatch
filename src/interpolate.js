/**
 * Interpolate variable references within .env values.
 * Supports $VAR and ${VAR} syntax.
 */

/**
 * Resolve a single value by expanding variable references.
 * @param {string} value
 * @param {Record<string, string>} env
 * @param {Set<string>} [visited] - tracks keys to detect circular refs
 * @returns {string}
 */
function interpolateValue(value, env, visited = new Set()) {
  return value.replace(/\$\{([^}]+)\}|\$([A-Z_][A-Z0-9_]*)/gi, (match, braced, bare) => {
    const key = braced || bare;
    if (visited.has(key)) {
      throw new Error(`Circular reference detected for variable: ${key}`);
    }
    if (!(key in env)) {
      return match; // leave unresolved references as-is
    }
    const nextVisited = new Set(visited).add(key);
    return interpolateValue(env[key], env, nextVisited);
  });
}

/**
 * Interpolate all values in a parsed env object.
 * @param {Record<string, string>} env
 * @returns {Record<string, string>}
 */
function interpolateEnv(env) {
  const result = {};
  for (const key of Object.keys(env)) {
    try {
      result[key] = interpolateValue(env[key], env, new Set([key]));
    } catch (err) {
      throw new Error(`Error interpolating key "${key}": ${err.message}`);
    }
  }
  return result;
}

/**
 * Check whether a value contains any variable references.
 * @param {string} value
 * @returns {boolean}
 */
function hasReferences(value) {
  return /\$\{[^}]+\}|\$[A-Z_][A-Z0-9_]*/i.test(value);
}

/**
 * List all variable names referenced in a value.
 * @param {string} value
 * @returns {string[]}
 */
function listReferences(value) {
  const refs = [];
  const re = /\$\{([^}]+)\}|\$([A-Z_][A-Z0-9_]*)/gi;
  let m;
  while ((m = re.exec(value)) !== null) {
    refs.push(m[1] || m[2]);
  }
  return refs;
}

module.exports = { interpolateValue, interpolateEnv, hasReferences, listReferences };
