/**
 * Parse .env file content into a key-value map.
 * Handles comments, blank lines, quoted values, and inline comments.
 */

/**
 * @param {string} content - Raw .env file content
 * @returns {Map<string, string>} Parsed key-value pairs
 */
function parse(content) {
  const result = new Map();

  const lines = content.split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();

    // Skip blank lines and comments
    if (!trimmed || trimmed.startsWith('#')) continue;

    const eqIndex = trimmed.indexOf('=');
    if (eqIndex === -1) continue;

    const key = trimmed.slice(0, eqIndex).trim();
    let value = trimmed.slice(eqIndex + 1).trim();

    if (!key) continue;

    // Strip inline comments (only outside quotes)
    value = stripInlineComment(value);

    // Strip surrounding quotes
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    result.set(key, value);
  }

  return result;
}

/**
 * @param {string} value
 * @returns {string}
 */
function stripInlineComment(value) {
  if (value.startsWith('"') || value.startsWith("'")) return value;

  const commentIndex = value.indexOf(' #');
  if (commentIndex !== -1) {
    return value.slice(0, commentIndex).trim();
  }
  return value;
}

/**
 * Serialize a Map back to .env file content.
 * @param {Map<string, string>} map
 * @returns {string}
 */
function serialize(map) {
  const lines = [];
  for (const [key, value] of map) {
    const needsQuotes = /\s/.test(value) || value.includes('#');
    const serializedValue = needsQuotes ? `"${value}"` : value;
    lines.push(`${key}=${serializedValue}`);
  }
  return lines.join('\n') + '\n';
}

module.exports = { parse, serialize };
