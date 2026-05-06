/**
 * formatSnapshot.js — human-readable output for snapshot comparisons
 */

/**
 * Format a snapshot diff result into a readable string
 * @param {Object} diff - result from compareSnapshots()
 * @returns {string}
 */
function formatSnapshotDiff(diff) {
  const lines = [];

  lines.push(`Snapshot comparison`);
  lines.push(`  before: ${diff.before.label || '(unlabeled)'}  [${diff.before.hash}]  ${diff.before.timestamp}`);
  lines.push(`  after:  ${diff.after.label || '(unlabeled)'}  [${diff.after.hash}]  ${diff.after.timestamp}`);
  lines.push('');

  if (!diff.hasChanges) {
    lines.push('No changes detected.');
    return lines.join('\n');
  }

  if (diff.added.length > 0) {
    lines.push(`Added (${diff.added.length}):`);
    diff.added.forEach((k) => lines.push(`  + ${k}`));
  }

  if (diff.removed.length > 0) {
    lines.push(`Removed (${diff.removed.length}):`);
    diff.removed.forEach((k) => lines.push(`  - ${k}`));
  }

  if (diff.changed.length > 0) {
    lines.push(`Changed (${diff.changed.length}):`);
    diff.changed.forEach((k) => lines.push(`  ~ ${k}`));
  }

  if (diff.unchanged.length > 0) {
    lines.push(`Unchanged (${diff.unchanged.length}):`);
    diff.unchanged.forEach((k) => lines.push(`    ${k}`));
  }

  return lines.join('\n');
}

/**
 * Format a compact one-line summary of a snapshot
 * @param {Object} snapshot - from createSnapshot()
 * @returns {string}
 */
function formatSnapshotSummary(snapshot) {
  const label = snapshot.label ? `[${snapshot.label}] ` : '';
  return `${label}${snapshot.keys.length} keys  hash:${snapshot.hash}  ${snapshot.timestamp}`;
}

module.exports = { formatSnapshotDiff, formatSnapshotSummary };
