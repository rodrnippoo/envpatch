/**
 * formatInherit.js — Human-readable output for inheritance operations
 */

/**
 * Format a summary of an inheritance merge.
 * @param {Object} summary - from inheritSummary()
 * @param {string} [baseName]
 * @param {string} [childName]
 * @returns {string}
 */
function formatInheritSummary(summary, baseName = 'base', childName = 'child') {
  const lines = [`Inheritance: ${childName} extends ${baseName}`];
  if (summary.inherited.length > 0) {
    lines.push(`  Inherited (${summary.inherited.length}): ${summary.inherited.join(', ')}`);
  }
  if (summary.overridden.length > 0) {
    lines.push(`  Overridden (${summary.overridden.length}): ${summary.overridden.join(', ')}`);
  }
  if (summary.added.length > 0) {
    lines.push(`  Added (${summary.added.length}): ${summary.added.join(', ')}`);
  }
  lines.push(`  Total keys: ${summary.total}`);
  return lines.join('\n');
}

/**
 * Format a single inherited key entry.
 * @param {string} key
 * @param {string} value
 * @param {'inherited'|'overridden'|'added'} status
 * @returns {string}
 */
function formatInheritEntry(key, value, status) {
  const icons = { inherited: '↓', overridden: '↑', added: '+' };
  const icon = icons[status] || ' ';
  return `${icon} ${key}=${value}`;
}

/**
 * Format the full result of a chain resolution.
 * @param {Object} result - resolved env object
 * @param {Object} summary
 * @returns {string}
 */
function formatInheritResult(result, summary) {
  const lines = [];
  for (const [key, value] of Object.entries(result)) {
    let status = 'added';
    if (summary.inherited.includes(key)) status = 'inherited';
    else if (summary.overridden.includes(key)) status = 'overridden';
    lines.push(formatInheritEntry(key, value, status));
  }
  return lines.join('\n');
}

module.exports = { formatInheritSummary, formatInheritEntry, formatInheritResult };
