/**
 * deprecate.js — Mark and detect deprecated keys in .env files
 */

/**
 * Mark keys as deprecated by adding a metadata map.
 * @param {Object} env - parsed env object
 * @param {string[]} keys - keys to mark deprecated
 * @returns {{ env: Object, deprecated: string[] }}
 */
function markDeprecated(env, keys) {
  const deprecated = keys.filter(k => k in env);
  return { env, deprecated };
}

/**
 * Check which deprecated keys are still present in env.
 * @param {Object} env
 * @param {string[]} deprecatedKeys
 * @returns {string[]}
 */
function findDeprecated(env, deprecatedKeys) {
  return deprecatedKeys.filter(k => k in env);
}

/**
 * Remove deprecated keys from env.
 * @param {Object} env
 * @param {string[]} deprecatedKeys
 * @returns {Object}
 */
function stripDeprecated(env, deprecatedKeys) {
  const result = { ...env };
  for (const key of deprecatedKeys) {
    delete result[key];
  }
  return result;
}

/**
 * Suggest replacements for deprecated keys.
 * @param {Object} env
 * @param {Object} replacements - map of { oldKey: newKey }
 * @returns {{ env: Object, applied: Array<{ from: string, to: string }> }}
 */
function applyReplacements(env, replacements) {
  const result = { ...env };
  const applied = [];
  for (const [oldKey, newKey] of Object.entries(replacements)) {
    if (oldKey in result) {
      if (!(newKey in result)) {
        result[newKey] = result[oldKey];
      }
      delete result[oldKey];
      applied.push({ from: oldKey, to: newKey });
    }
  }
  return { env: result, applied };
}

/**
 * Summarize deprecation findings.
 * @param {string[]} found
 * @param {Array<{ from: string, to: string }>} replaced
 * @returns {Object}
 */
function deprecateSummary(found, replaced = []) {
  return {
    total: found.length,
    found,
    replaced,
    clean: found.length === 0,
  };
}

module.exports = {
  markDeprecated,
  findDeprecated,
  stripDeprecated,
  applyReplacements,
  deprecateSummary,
};
