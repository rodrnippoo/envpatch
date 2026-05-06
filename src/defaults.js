/**
 * defaults.js — Fill missing keys in an env object from a defaults/template env.
 */

/**
 * Fill missing keys in `target` with values from `defaults`.
 * Only adds keys that are absent or empty in target.
 *
 * @param {Record<string,string>} target
 * @param {Record<string,string>} defaults
 * @param {{ overwriteEmpty?: boolean }} options
 * @returns {Record<string,string>}
 */
function applyDefaults(target, defaults, options = {}) {
  const { overwriteEmpty = false } = options;
  const result = { ...target };
  for (const [key, value] of Object.entries(defaults)) {
    const missing = !(key in result);
    const empty = overwriteEmpty && result[key] === '';
    if (missing || empty) {
      result[key] = value;
    }
  }
  return result;
}

/**
 * Return the list of keys that would be filled from defaults.
 *
 * @param {Record<string,string>} target
 * @param {Record<string,string>} defaults
 * @param {{ overwriteEmpty?: boolean }} options
 * @returns {string[]}
 */
function missingKeys(target, defaults, options = {}) {
  const { overwriteEmpty = false } = options;
  return Object.keys(defaults).filter((key) => {
    const missing = !(key in target);
    const empty = overwriteEmpty && target[key] === '';
    return missing || empty;
  });
}

/**
 * Check whether target has all keys defined in defaults.
 *
 * @param {Record<string,string>} target
 * @param {Record<string,string>} defaults
 * @returns {boolean}
 */
function isComplete(target, defaults) {
  return Object.keys(defaults).every((key) => key in target);
}

module.exports = { applyDefaults, missingKeys, isComplete };
