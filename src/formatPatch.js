/**
 * Format a diff patch for human-readable output.
 * Uses unified-diff-style symbols: + for added, - for removed, ~ for changed.
 */

const SYMBOLS = {
  added: '+',
  removed: '-',
  changed: '~',
};

const COLORS = {
  added: '\x1b[32m',
  removed: '\x1b[31m',
  changed: '\x1b[33m',
  reset: '\x1b[0m',
};

/**
 * @param {Array<{key: string, type: string, oldValue?: string, newValue?: string}>} patch
 * @param {{ color?: boolean }} options
 * @returns {string}
 */
function formatPatch(patch, { color = false } = {}) {
  if (patch.length === 0) return '(no changes)';

  return patch
    .map((entry) => {
      const symbol = SYMBOLS[entry.type] ?? '?';
      const colorStart = color ? (COLORS[entry.type] ?? '') : '';
      const colorEnd = color ? COLORS.reset : '';

      if (entry.type === 'added') {
        return `${colorStart}${symbol} ${entry.key}=${entry.newValue}${colorEnd}`;
      }
      if (entry.type === 'removed') {
        return `${colorStart}${symbol} ${entry.key}=${entry.oldValue}${colorEnd}`;
      }
      if (entry.type === 'changed') {
        return [
          `${colorStart}${symbol} ${entry.key}: ${entry.oldValue} -> ${entry.newValue}${colorEnd}`,
        ].join('');
      }
      return `? ${entry.key}`;
    })
    .join('\n');
}

module.exports = { formatPatch };
