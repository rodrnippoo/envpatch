/**
 * formatTransform.js — Human-readable output for transform operations
 */

/**
 * Format a transform summary into a readable string
 * @param {{ added: string[], removed: string[], changed: string[] }} summary
 * @returns {string}
 */
function formatTransformSummary(summary) {
  const lines = [];
  if (summary.added.length) {
    lines.push(`Added keys (${summary.added.length}):`);
    summary.added.forEach(k => lines.push(`  + ${k}`));
  }
  if (summary.removed.length) {
    lines.push(`Removed keys (${summary.removed.length}):`);
    summary.removed.forEach(k => lines.push(`  - ${k}`));
  }
  if (summary.changed.length) {
    lines.push(`Changed values (${summary.changed.length}):`);
    summary.changed.forEach(k => lines.push(`  ~ ${k}`));
  }
  if (!lines.length) return 'No changes from transform.';
  return lines.join('\n');
}

/**
 * Format the result of a transform for display
 * @param {Record<string,string>} before
 * @param {Record<string,string>} after
 * @param {{ added: string[], removed: string[], changed: string[] }} summary
 * @returns {string}
 */
function formatTransformResult(before, after, summary) {
  const total = Object.keys(after).length;
  const changeCount = summary.added.length + summary.removed.length + summary.changed.length;
  const header = `Transform complete: ${total} key(s) in result, ${changeCount} change(s).`;
  const detail = formatTransformSummary(summary);
  return [header, detail].join('\n');
}

/**
 * Format a simple before/after value diff for a single key
 * @param {string} key
 * @param {string} before
 * @param {string} after
 * @returns {string}
 */
function formatValueChange(key, before, after) {
  return `  ${key}: "${before}" → "${after}"`;
}

module.exports = { formatTransformSummary, formatTransformResult, formatValueChange };
