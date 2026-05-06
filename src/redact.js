/**
 * Redact sensitive values in .env files for safe logging/display
 */

const SENSITIVE_PATTERNS = [
  /secret/i,
  /password/i,
  /passwd/i,
  /token/i,
  /api[_-]?key/i,
  /private[_-]?key/i,
  /auth/i,
  /credential/i,
  /cert/i,
  /signing/i,
];

const DEFAULT_MASK = '***';

/**
 * Check if a key name looks sensitive
 * @param {string} key
 * @returns {boolean}
 */
function isSensitiveKey(key) {
  return SENSITIVE_PATTERNS.some((pattern) => pattern.test(key));
}

/**
 * Redact a single value if the key is sensitive
 * @param {string} key
 * @param {string} value
 * @param {string} [mask]
 * @returns {string}
 */
function redactValue(key, value, mask = DEFAULT_MASK) {
  if (!value) return value;
  if (isSensitiveKey(key)) return mask;
  return value;
}

/**
 * Redact all sensitive values in a parsed env object
 * @param {Record<string, string>} env
 * @param {string[]} [additionalKeys]
 * @param {string} [mask]
 * @returns {Record<string, string>}
 */
function redactEnv(env, additionalKeys = [], mask = DEFAULT_MASK) {
  const sensitiveKeys = new Set(additionalKeys.map((k) => k.toLowerCase()));
  return Object.fromEntries(
    Object.entries(env).map(([key, value]) => {
      const shouldRedact =
        isSensitiveKey(key) || sensitiveKeys.has(key.toLowerCase());
      return [key, shouldRedact ? mask : value];
    })
  );
}

/**
 * List all keys that would be redacted
 * @param {Record<string, string>} env
 * @param {string[]} [additionalKeys]
 * @returns {string[]}
 */
function listRedactedKeys(env, additionalKeys = []) {
  const sensitiveKeys = new Set(additionalKeys.map((k) => k.toLowerCase()));
  return Object.keys(env).filter(
    (key) =>
      isSensitiveKey(key) || sensitiveKeys.has(key.toLowerCase())
  );
}

module.exports = { isSensitiveKey, redactValue, redactEnv, listRedactedKeys };
