/**
 * transform.js — Apply key/value transformations to env objects
 */

/**
 * Apply a function to all values in an env object
 * @param {Record<string,string>} env
 * @param {(value: string, key: string) => string} fn
 * @returns {Record<string,string>}
 */
function mapValues(env, fn) {
  const result = {};
  for (const [key, value] of Object.entries(env)) {
    result[key] = fn(value, key);
  }
  return result;
}

/**
 * Apply a function to all keys in an env object
 * @param {Record<string,string>} env
 * @param {(key: string) => string} fn
 * @returns {Record<string,string>}
 */
function mapKeys(env, fn) {
  const result = {};
  for (const [key, value] of Object.entries(env)) {
    result[fn(key)] = value;
  }
  return result;
}

/**
 * Filter env entries by predicate
 * @param {Record<string,string>} env
 * @param {(value: string, key: string) => boolean} fn
 * @returns {Record<string,string>}
 */
function filterEnv(env, fn) {
  const result = {};
  for (const [key, value] of Object.entries(env)) {
    if (fn(value, key)) result[key] = value;
  }
  return result;
}

/**
 * Apply multiple named transforms in sequence
 * @param {Record<string,string>} env
 * @param {Array<{type: string, fn: Function}>} transforms
 * @returns {Record<string,string>}
 */
function applyTransforms(env, transforms) {
  return transforms.reduce((current, { type, fn }) => {
    if (type === 'mapValues') return mapValues(current, fn);
    if (type === 'mapKeys') return mapKeys(current, fn);
    if (type === 'filter') return filterEnv(current, fn);
    throw new Error(`Unknown transform type: ${type}`);
  }, env);
}

/**
 * Summarize what changed after a transform
 * @param {Record<string,string>} before
 * @param {Record<string,string>} after
 * @returns {{ added: string[], removed: string[], changed: string[] }}
 */
function transformSummary(before, after) {
  const beforeKeys = new Set(Object.keys(before));
  const afterKeys = new Set(Object.keys(after));
  const added = [...afterKeys].filter(k => !beforeKeys.has(k));
  const removed = [...beforeKeys].filter(k => !afterKeys.has(k));
  const changed = [...afterKeys].filter(k => beforeKeys.has(k) && before[k] !== after[k]);
  return { added, removed, changed };
}

module.exports = { mapValues, mapKeys, filterEnv, applyTransforms, transformSummary };
