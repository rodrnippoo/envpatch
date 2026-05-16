/**
 * formatRotate.js — Human-readable output for key rotation results
 */

/**
 * Format a single rotation entry.
 * @param {Object} entry
 * @returns {string}
 */
function formatRotateEntry(entry) {
  const rename =
    entry.oldKey !== entry.newKey
      ? `${entry.oldKey} → ${entry.newKey}`
      : entry.oldKey;
  const valueNote = entry.valueChanged
    ? ` (value updated)`
    : '';
  return `  ~ ${rename}${valueNote}`;
}

/**
 * Format the full result of a rotation operation.
 * @param {Array} entries
 * @param {Object} summary
 * @returns {string}
 */
function formatRotateResult(entries, summary) {
  if (entries.length === 0) {
    return 'No keys rotated.';
  }
  const lines = ['Rotated keys:'];
  for (const entry of entries) {
    lines.push(formatRotateEntry(entry));
  }
  return lines.join('\n');
}

/**
 * Format a rotation summary line.
 * @param {Object} summary
 * @returns {string}
 */
function formatRotateSummary(summary) {
  const parts = [`${summary.total} key(s) rotated`];
  if (summary.renamed > 0) parts.push(`${summary.renamed} renamed`);
  if (summary.valueChanged > 0) parts.push(`${summary.valueChanged} value(s) updated`);
  return parts.join(', ') + '.';
}

module.exports = { formatRotateEntry, formatRotateResult, formatRotateSummary };
