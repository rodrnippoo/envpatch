/**
 * Format redaction results for display
 */

/**
 * Format a single redacted env as key=value lines
 * @param {Record<string, string>} redacted
 * @returns {string}
 */
function formatRedacted(redacted) {
  return Object.entries(redacted)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');
}

/**
 * Format a summary of which keys were redacted
 * @param {string[]} redactedKeys
 * @param {number} total
 * @returns {string}
 */
function formatRedactSummary(redactedKeys, total) {
  if (redactedKeys.length === 0) {
    return `No sensitive keys found (${total} keys checked).`;
  }
  const lines = [
    `Redacted ${redactedKeys.length} of ${total} keys:`,
    ...redactedKeys.map((k) => `  - ${k}`),
  ];
  return lines.join('\n');
}

/**
 * Format a warning about sensitive keys found in plain text
 * @param {string[]} keys
 * @returns {string}
 */
function formatRedactWarning(keys) {
  if (keys.length === 0) return '';
  const list = keys.map((k) => `  ! ${k}`).join('\n');
  return `WARNING: The following keys contain sensitive values:\n${list}\nConsider encrypting or redacting before sharing.`;
}

module.exports = { formatRedacted, formatRedactSummary, formatRedactWarning };
