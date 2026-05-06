/**
 * Template utilities for .env files
 * Generates a .env.example / template from a parsed env object
 * by stripping all values and optionally adding type hints.
 */

/**
 * Convert a parsed env map into a template (values replaced with empty or hint).
 * @param {Record<string, string>} parsed - key/value pairs from parse()
 * @param {Record<string, string>} [hints={}] - optional per-key placeholder hints
 * @returns {Record<string, string>} template map with empty or hinted values
 */
function toTemplate(parsed, hints = {}) {
  const result = {};
  for (const key of Object.keys(parsed)) {
    result[key] = Object.prototype.hasOwnProperty.call(hints, key)
      ? hints[key]
      : '';
  }
  return result;
}

/**
 * Check whether all keys in a template are present in a given env map.
 * @param {Record<string, string>} template
 * @param {Record<string, string>} env
 * @returns {{ missing: string[], extra: string[] }}
 */
function checkTemplate(template, env) {
  const templateKeys = new Set(Object.keys(template));
  const envKeys = new Set(Object.keys(env));

  const missing = [...templateKeys].filter((k) => !envKeys.has(k));
  const extra = [...envKeys].filter((k) => !templateKeys.has(k));

  return { missing, extra };
}

/**
 * Format the result of checkTemplate into a human-readable string.
 * @param {{ missing: string[], extra: string[] }} result
 * @returns {string}
 */
function formatTemplateCheck(result) {
  const lines = [];
  if (result.missing.length > 0) {
    lines.push('Missing required keys:');
    for (const key of result.missing) {
      lines.push(`  - ${key}`);
    }
  }
  if (result.extra.length > 0) {
    lines.push('Extra keys not in template:');
    for (const key of result.extra) {
      lines.push(`  + ${key}`);
    }
  }
  if (lines.length === 0) {
    lines.push('All required keys are present.');
  }
  return lines.join('\n');
}

module.exports = { toTemplate, checkTemplate, formatTemplateCheck };
