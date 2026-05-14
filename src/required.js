/**
 * required.js — Check for required keys in an env object
 */

/**
 * Returns keys that are required but missing or empty.
 * @param {Object} env
 * @param {string[]} requiredKeys
 * @returns {string[]}
 */
export function missingRequired(env, requiredKeys) {
  return requiredKeys.filter(key => {
    const val = env[key];
    return val === undefined || val === null || val === '';
  });
}

/**
 * Returns keys that are present and non-empty.
 * @param {Object} env
 * @param {string[]} requiredKeys
 * @returns {string[]}
 */
export function presentRequired(env, requiredKeys) {
  return requiredKeys.filter(key => {
    const val = env[key];
    return val !== undefined && val !== null && val !== '';
  });
}

/**
 * Check if all required keys are satisfied.
 * @param {Object} env
 * @param {string[]} requiredKeys
 * @returns {boolean}
 */
export function checkRequired(env, requiredKeys) {
  return missingRequired(env, requiredKeys).length === 0;
}

/**
 * Build a structured report of required key status.
 * @param {Object} env
 * @param {string[]} requiredKeys
 * @returns {{ key: string, present: boolean, value: string|undefined }[]}
 */
export function requiredReport(env, requiredKeys) {
  return requiredKeys.map(key => {
    const value = env[key];
    const present = value !== undefined && value !== null && value !== '';
    return { key, present, value: present ? value : undefined };
  });
}
