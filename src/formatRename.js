/**
 * formatRename.js — Human-readable output for rename operations
 */

/**
 * Format the result of a renameKeys operation.
 * @param {{ applied: Array<{from:string,to:string}>, skipped: Array<{from:string,to:string,reason:string}> }} renameResult
 * @returns {string}
 */
function formatRenameResult({ applied, skipped }) {
  const lines = [];

  if (applied.length === 0 && skipped.length === 0) {
    return 'No renames requested.';
  }

  if (applied.length > 0) {
    lines.push(`Renamed (${applied.length}):`);
    for (const { from, to } of applied) {
      lines.push(`  ${from} → ${to}`);
    }
  }

  if (skipped.length > 0) {
    if (lines.length > 0) lines.push('');
    lines.push(`Skipped (${skipped.length}):`);
    for (const { from, to, reason } of skipped) {
      lines.push(`  ${from} → ${to}  [${reason}]`);
    }
  }

  return lines.join('\n');
}

/**
 * Format a single rename entry for inline display.
 * @param {{ from: string, to: string }} entry
 * @returns {string}
 */
function formatRenameEntry({ from, to }) {
  return `${from} → ${to}`;
}

/**
 * Format a summary line for a rename operation.
 * @param {{ applied: Array<any>, skipped: Array<any> }} renameResult
 * @returns {string}
 */
function formatRenameSummary({ applied, skipped }) {
  const parts = [];
  if (applied.length > 0) parts.push(`${applied.length} renamed`);
  if (skipped.length > 0) parts.push(`${skipped.length} skipped`);
  return parts.length > 0 ? parts.join(', ') : 'nothing to rename';
}

module.exports = { formatRenameResult, formatRenameEntry, formatRenameSummary };
