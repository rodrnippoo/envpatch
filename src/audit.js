/**
 * audit.js — Track changes made to .env files over time
 */

/**
 * Create an audit entry for a merge/patch/encrypt operation
 * @param {string} operation - 'merge' | 'patch' | 'encrypt' | 'decrypt'
 * @param {object} before - parsed env before operation
 * @param {object} after - parsed env after operation
 * @param {object} [meta] - optional metadata (user, timestamp, etc.)
 * @returns {object} audit entry
 */
function createAuditEntry(operation, before, after, meta = {}) {
  const added = [];
  const removed = [];
  const changed = [];

  const allKeys = new Set([...Object.keys(before), ...Object.keys(after)]);

  for (const key of allKeys) {
    const hadKey = Object.prototype.hasOwnProperty.call(before, key);
    const hasKey = Object.prototype.hasOwnProperty.call(after, key);

    if (!hadKey && hasKey) {
      added.push(key);
    } else if (hadKey && !hasKey) {
      removed.push(key);
    } else if (before[key] !== after[key]) {
      changed.push(key);
    }
  }

  return {
    operation,
    timestamp: meta.timestamp || new Date().toISOString(),
    user: meta.user || null,
    summary: { added, removed, changed },
    totalKeys: Object.keys(after).length,
  };
}

/**
 * Serialize an array of audit entries to a human-readable log string
 * @param {object[]} entries
 * @returns {string}
 */
function formatAuditLog(entries) {
  if (entries.length === 0) return '(no audit entries)';

  return entries
    .map((entry) => {
      const { operation, timestamp, user, summary, totalKeys } = entry;
      const who = user ? ` by ${user}` : '';
      const lines = [`[${timestamp}] ${operation}${who} (${totalKeys} keys total)`];

      if (summary.added.length > 0)
        lines.push(`  + added:   ${summary.added.join(', ')}`);
      if (summary.removed.length > 0)
        lines.push(`  - removed: ${summary.removed.join(', ')}`);
      if (summary.changed.length > 0)
        lines.push(`  ~ changed: ${summary.changed.join(', ')}`);
      if (!summary.added.length && !summary.removed.length && !summary.changed.length)
        lines.push('  (no changes)');

      return lines.join('\n');
    })
    .join('\n\n');
}

module.exports = { createAuditEntry, formatAuditLog };
