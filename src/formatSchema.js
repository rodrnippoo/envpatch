/**
 * Format a schema definition to/from a human-readable .env-schema format
 *
 * Schema file format (line-based):
 *   KEY type [required] [pattern=<regex>]
 *
 * Example:
 *   PORT number required
 *   API_URL url required
 *   NODE_ENV string pattern=^(development|staging|production)$
 */

/**
 * Parse a .env-schema text into a schema object
 * @param {string} text
 * @returns {Record<string, { type?: string, required?: boolean, pattern?: string }>}
 */
function parseSchema(text) {
  const schema = {};
  for (const raw of text.split('\n')) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const parts = line.split(/\s+/);
    const key = parts[0];
    const def = {};
    if (parts[1]) def.type = parts[1];
    for (const part of parts.slice(2)) {
      if (part === 'required') {
        def.required = true;
      } else if (part.startsWith('pattern=')) {
        def.pattern = part.slice('pattern='.length);
      }
    }
    schema[key] = def;
  }
  return schema;
}

/**
 * Serialize a schema object back to .env-schema text
 * @param {Record<string, { type?: string, required?: boolean, pattern?: string }>} schema
 * @returns {string}
 */
function serializeSchema(schema) {
  const lines = [];
  for (const [key, def] of Object.entries(schema)) {
    const parts = [key, def.type || 'string'];
    if (def.required) parts.push('required');
    if (def.pattern) parts.push(`pattern=${def.pattern}`);
    lines.push(parts.join(' '));
  }
  return lines.join('\n') + (lines.length ? '\n' : '');
}

module.exports = { parseSchema, serializeSchema };
