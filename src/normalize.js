/**
 * Normalize .env entries: trim keys, normalize line endings,
 * collapse duplicate whitespace in values, and optionally uppercase keys.
 */

/**
 * Normalize a single key string.
 * @param {string} key
 * @param {object} options
 * @param {boolean} [options.uppercaseKeys=false]
 * @returns {string}
 */
function normalizeKey(key, { uppercaseKeys = false } = {}) {
  const trimmed = key.trim();
  return uppercaseKeys ? trimmed.toUpperCase() : trimmed;
}

/**
 * Normalize a single value string.
 * @param {string} value
 * @param {object} options
 * @param {boolean} [options.collapseWhitespace=false]
 * @param {boolean} [options.trimValues=true]
 * @returns {string}
 */
function normalizeValue(value, { collapseWhitespace = false, trimValues = true } = {}) {
  let v = value.replace(/\r\n|\r/g, '\n');
  if (trimValues) v = v.trim();
  if (collapseWhitespace) v = v.replace(/[ \t]+/g, ' ');
  return v;
}

/**
 * Normalize a parsed env object.
 * @param {Record<string, string>} env
 * @param {object} options
 * @param {boolean} [options.uppercaseKeys=false]
 * @param {boolean} [options.collapseWhitespace=false]
 * @param {boolean} [options.trimValues=true]
 * @returns {Record<string, string>}
 */
function normalizeEnv(env, options = {}) {
  const result = {};
  for (const [key, value] of Object.entries(env)) {
    const nk = normalizeKey(key, options);
    const nv = normalizeValue(value, options);
    result[nk] = nv;
  }
  return result;
}

/**
 * Summarize what changed during normalization.
 * @param {Record<string, string>} before
 * @param {Record<string, string>} after
 * @returns {{ changedKeys: string[], renamedKeys: Array<{from:string,to:string}> }}
 */
function normalizeSummary(before, after) {
  const beforeKeys = Object.keys(before);
  const afterKeys = Object.keys(after);

  const changedKeys = afterKeys.filter(k => before[k] !== undefined && before[k] !== after[k]);

  const renamedKeys = [];
  for (const bk of beforeKeys) {
    const ak = bk.trim().toUpperCase();
    if (ak !== bk && after[ak] !== undefined) {
      renamedKeys.push({ from: bk, to: ak });
    }
  }

  return { changedKeys, renamedKeys };
}

module.exports = { normalizeKey, normalizeValue, normalizeEnv, normalizeSummary };
