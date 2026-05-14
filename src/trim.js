/**
 * Trim whitespace and normalize values in env objects.
 */

/**
 * Trim leading/trailing whitespace from a single value.
 * @param {string} value
 * @returns {string}
 */
function trimValue(value) {
  if (typeof value !== 'string') return value;
  return value.trim();
}

/**
 * Trim all values in an env object.
 * @param {Record<string, string>} env
 * @returns {Record<string, string>}
 */
function trimEnv(env) {
  const result = {};
  for (const [key, value] of Object.entries(env)) {
    result[key] = trimValue(value);
  }
  return result;
}

/**
 * Trim both keys and values (removes accidental key whitespace too).
 * @param {Record<string, string>} env
 * @returns {Record<string, string>}
 */
function trimAll(env) {
  const result = {};
  for (const [key, value] of Object.entries(env)) {
    const trimmedKey = key.trim();
    if (trimmedKey) {
      result[trimmedKey] = trimValue(value);
    }
  }
  return result;
}

/**
 * Return a list of keys whose values had surrounding whitespace.
 * @param {Record<string, string>} env
 * @returns {string[]}
 */
function listUntrimmedKeys(env) {
  return Object.entries(env)
    .filter(([, value]) => typeof value === 'string' && value !== value.trim())
    .map(([key]) => key);
}

/**
 * Summarize what trimming changed.
 * @param {Record<string, string>} before
 * @param {Record<string, string>} after
 * @returns {{ changed: string[], total: number }}
 */
function trimSummary(before, after) {
  const changed = Object.keys(before).filter(
    (key) => before[key] !== after[key]
  );
  return { changed, total: changed.length };
}

module.exports = { trimValue, trimEnv, trimAll, listUntrimmedKeys, trimSummary };
