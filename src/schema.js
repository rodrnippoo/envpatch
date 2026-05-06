/**
 * Schema validation for .env files
 * Validates keys against a schema definition with types and requirements
 */

const VALID_TYPES = ['string', 'number', 'boolean', 'url', 'email'];

/**
 * Validate a single value against a schema entry
 * @param {string} value
 * @param {{ type?: string, required?: boolean, pattern?: string }} schemaDef
 * @returns {string|null} error message or null
 */
function validateValue(value, schemaDef) {
  if (schemaDef.required && (value === undefined || value === '')) {
    return 'required but missing or empty';
  }
  if (value === undefined || value === '') return null;

  const type = schemaDef.type || 'string';

  if (type === 'number' && isNaN(Number(value))) {
    return `expected number, got "${value}"`;
  }
  if (type === 'boolean' && !['true', 'false', '1', '0'].includes(value.toLowerCase())) {
    return `expected boolean (true/false/1/0), got "${value}"`;
  }
  if (type === 'url') {
    try { new URL(value); } catch {
      return `expected valid URL, got "${value}"`;
    }
  }
  if (type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    return `expected valid email, got "${value}"`;
  }
  if (schemaDef.pattern) {
    const re = new RegExp(schemaDef.pattern);
    if (!re.test(value)) {
      return `does not match pattern ${schemaDef.pattern}`;
    }
  }
  return null;
}

/**
 * Validate a parsed env object against a schema
 * @param {Record<string, string>} env
 * @param {Record<string, { type?: string, required?: boolean, pattern?: string }>} schema
 * @returns {{ key: string, error: string }[]}
 */
function validateSchema(env, schema) {
  const errors = [];
  for (const [key, schemaDef] of Object.entries(schema)) {
    if (!VALID_TYPES.includes(schemaDef.type || 'string')) {
      errors.push({ key, error: `unknown type "${schemaDef.type}"` });
      continue;
    }
    const error = validateValue(env[key], schemaDef);
    if (error) errors.push({ key, error });
  }
  return errors;
}

/**
 * Format schema validation errors as a human-readable string
 * @param {{ key: string, error: string }[]} errors
 * @returns {string}
 */
function formatSchemaErrors(errors) {
  if (errors.length === 0) return '';
  return errors.map(({ key, error }) => `  ${key}: ${error}`).join('\n');
}

module.exports = { validateSchema, validateValue, formatSchemaErrors };
