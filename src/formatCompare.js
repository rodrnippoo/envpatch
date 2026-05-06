const { summarizeCompare } = require('./compare');

const SYMBOLS = { added: '+', removed: '-', changed: '~', unchanged: ' ' };
const COLORS = {
  added: '\x1b[32m',
  removed: '\x1b[31m',
  changed: '\x1b[33m',
  unchanged: '\x1b[90m',
  reset: '\x1b[0m',
};

/**
 * Format a full compare result as a colored diff-like string.
 * @param {CompareResult} result
 * @param {{ color?: boolean }} options
 */
function formatCompare(result, { color = true } = {}) {
  const lines = [];

  const render = (type, key, value) => {
    const sym = SYMBOLS[type];
    const line = `${sym} ${key}=${value}`;
    if (color) {
      return `${COLORS[type]}${line}${COLORS.reset}`;
    }
    return line;
  };

  for (const [key, value] of Object.entries(result.removed)) {
    lines.push(render('removed', key, value));
  }
  for (const [key, { from, to }] of Object.entries(result.changed)) {
    lines.push(render('removed', key, from));
    lines.push(render('added', key, to));
  }
  for (const [key, value] of Object.entries(result.added)) {
    lines.push(render('added', key, value));
  }
  for (const [key, value] of Object.entries(result.unchanged)) {
    lines.push(render('unchanged', key, value));
  }

  return lines.join('\n');
}

/**
 * Format a one-line summary of a compare result.
 * @param {CompareResult} result
 */
function formatCompareSummary(result) {
  const { added, removed, changed, unchanged } = summarizeCompare(result);
  const parts = [];
  if (added) parts.push(`+${added} added`);
  if (removed) parts.push(`-${removed} removed`);
  if (changed) parts.push(`~${changed} changed`);
  parts.push(`${unchanged} unchanged`);
  return parts.join(', ');
}

module.exports = { formatCompare, formatCompareSummary };
