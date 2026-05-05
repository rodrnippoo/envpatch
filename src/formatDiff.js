/**
 * Format a diff (from diff.js) into a human-readable string,
 * similar to unified diff output but tailored for .env files.
 */

const SYMBOLS = {
  added: '+',
  removed: '-',
  modified: '~',
  unchanged: ' ',
};

const COLORS = {
  added: '\x1b[32m',    // green
  removed: '\x1b[31m',  // red
  modified: '\x1b[33m', // yellow
  unchanged: '',
  reset: '\x1b[0m',
};

/**
 * Format a diff array into a printable string.
 * @param {import('./diff').Change[]} changes
 * @param {{ color?: boolean, showUnchanged?: boolean }} [opts]
 * @returns {string}
 */
function formatDiff(changes, opts = {}) {
  const { color = false, showUnchanged = false } = opts;
  const lines = [];

  for (const change of changes) {
    if (!showUnchanged && change.type === 'unchanged') continue;

    const sym = SYMBOLS[change.type];
    const pre = color ? COLORS[change.type] : '';
    const post = color ? COLORS.reset : '';

    if (change.type === 'modified') {
      lines.push(`${pre}- ${change.key}=${change.oldValue}${post}`);
      lines.push(`${pre}+ ${change.key}=${change.newValue}${post}`);
    } else if (change.type === 'added') {
      lines.push(`${pre}${sym} ${change.key}=${change.newValue}${post}`);
    } else if (change.type === 'removed') {
      lines.push(`${pre}${sym} ${change.key}=${change.oldValue}${post}`);
    } else {
      lines.push(`${pre}${sym} ${change.key}=${change.oldValue}${post}`);
    }
  }

  return lines.join('\n');
}

module.exports = { formatDiff };
