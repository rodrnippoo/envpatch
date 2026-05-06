/**
 * Validates parsed .env objects for common issues.
 */

/**
 * Checks if a key is a valid env variable name.
 * @param {string} key
 * @returns {boolean}
 */
function isValidKey(key) {
  return /^[A-Za-z_][A-Za-z0-9_]*$/.test(key);
}

/**
 * Validates a parsed env object and returns a list of validation errors.
 * @param {Record<string, string>} env
 * @returns {Array<{ key: string, message: string }>}
 */
function validate(env) {
  const errors = [];

  for (const [key, value] of Object.entries(env)) {
    if (!isValidKey(key)) {
      errors.push({ key, message: `Invalid key name: "${key}"` });
    }

    if (value === undefined || value === null) {
      errors.push({ key, message: `Value for "${key}" is null or undefined` });
    }

    if (typeof value !== 'string') {
      errors.push({ key, message: `Value for "${key}" must be a string, got ${typeof value}` });
    }
  }

  return errors;
}

/**
 * Returns true if the env object has no validation errors.
 * @param {Record<string, string>} env
 * @returns {boolean}
 */
function isValid(env) {
  return validate(env).length === 0;
}

/**
 * Formats validation errors into a human-readable string.
 * @param {Array<{ key: string, message: string }>} errors
 * @returns {string}
 */
function formatValidationErrors(errors) {
  if (errors.length === 0) return 'No validation errors.';
  return errors.map(e => `  [${e.key}] ${e.message}`).join('\n');
}

module.exports = { validate, isValid, isValidKey, formatValidationErrors };
