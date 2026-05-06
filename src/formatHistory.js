/**
 * Format a single history entry as a human-readable string.
 * @param {object} entry
 * @returns {string}
 */
function formatHistoryEntry(entry) {
  const lines = [];
  const ts = new Date(entry.timestamp).toLocaleString();
  lines.push(`[${entry.id}] ${entry.action.toUpperCase()} — ${ts}`);
  if (entry.addedKeys.length)    lines.push(`  + added:    ${entry.addedKeys.join(', ')}`);
  if (entry.removedKeys.length)  lines.push(`  - removed:  ${entry.removedKeys.join(', ')}`);
  if (entry.modifiedKeys.length) lines.push(`  ~ modified: ${entry.modifiedKeys.join(', ')}`);
  if (!entry.changedKeys.length) lines.push('  (no changes)');
  const metaKeys = Object.keys(entry.meta || {});
  if (metaKeys.length) {
    lines.push(`  meta: ${metaKeys.map(k => `${k}=${entry.meta[k]}`).join(', ')}`);
  }
  return lines.join('\n');
}

/**
 * Format a full history log.
 * @param {object[]} log
 * @returns {string}
 */
function formatHistoryLog(log) {
  if (!log.length) return '(no history)';
  return log.map(formatHistoryEntry).join('\n\n');
}

/**
 * Format a compact one-line summary per entry.
 * @param {object[]} log
 * @returns {string}
 */
function formatHistorySummary(log) {
  if (!log.length) return '(no history)';
  return log.map(e => {
    const ts = new Date(e.timestamp).toLocaleString();
    const counts = [
      e.addedKeys.length    ? `+${e.addedKeys.length}`    : null,
      e.removedKeys.length  ? `-${e.removedKeys.length}`  : null,
      e.modifiedKeys.length ? `~${e.modifiedKeys.length}` : null,
    ].filter(Boolean).join(' ');
    return `${ts}  ${e.action.padEnd(10)} ${counts || '(no changes)'}  [${e.id}]`;
  }).join('\n');
}

module.exports = { formatHistoryEntry, formatHistoryLog, formatHistorySummary };
