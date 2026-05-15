/**
 * formatCoerce.js — Human-readable output for coercion results
 */

/**
 * Format a single coercion change.
 * @param {{ key: string, from: string, to: any, type: string }} entry
 * @returns {string}
 */
function formatCoerceEntry(entry) {
  return `  ${entry.key}: "${entry.from}" → ${JSON.stringify(entry.to)} (${entry.type})`;
}

/**
 * Format the full coercion summary.
 * @param {{ key: string, from: string, to: any, type: string }[]} summary
 * @returns {string}
 */
function formatCoerceSummary(summary) {
  if (summary.length === 0) {
    return 'No values were coerced (all remain strings).';
  }
  const lines = ['Coerced values:', ...summary.map(formatCoerceEntry)];
  return lines.join('\n');
}

/**
 * Format a coercion result showing before/after env.
 * @param {Record<string, string>} original
 * @param {Record<string, any>} coerced
 * @param {{ key: string, from: string, to: any, type: string }[]} summary
 * @returns {string}
 */
function formatCoerceResult(original, coerced, summary) {
  const totalKeys = Object.keys(original).length;
  const coercedCount = summary.length;
  const skippedCount = totalKeys - coercedCount;

  const lines = [
    `Coercion complete: ${totalKeys} key(s) processed`,
    `  ${coercedCount} coerced, ${skippedCount} left as string`,
  ];

  if (coercedCount > 0) {
    lines.push('');
    lines.push(formatCoerceSummary(summary));
  }

  return lines.join('\n');
}

module.exports = { formatCoerceEntry, formatCoerceSummary, formatCoerceResult };
