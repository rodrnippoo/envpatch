/**
 * Format conflict information for display in the terminal or output files.
 */

const RESET = '\x1b[0m';
const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const BOLD = '\x1b[1m';

/**
 * Format a single conflict entry as a human-readable string.
 *
 * @param {string} key
 * @param {{ ours: string, theirs: string }} entry
 * @param {{ color?: boolean }} options
 * @returns {string}
 */
function formatConflictEntry(key, entry, { color = false } = {}) {
  if (color) {
    return [
      `${BOLD}${YELLOW}<<<<<<< ours${RESET}`,
      `${GREEN}${key}=${entry.ours}${RESET}`,
      `${BOLD}${YELLOW}=======${RESET}`,
      `${RED}${key}=${entry.theirs}${RESET}`,
      `${BOLD}${YELLOW}>>>>>>> theirs${RESET}`,
    ].join('\n');
  }

  return [
    '<<<<<<< ours',
    `${key}=${entry.ours}`,
    '=======',
    `${key}=${entry.theirs}`,
    '>>>>>>> theirs',
  ].join('\n');
}

/**
 * Format all conflicts from a merged object.
 *
 * @param {Object} merged - output from merge()
 * @param {{ color?: boolean }} options
 * @returns {string}
 */
function formatConflicts(merged, options = {}) {
  const lines = [];

  for (const [key, entry] of Object.entries(merged)) {
    if (entry.conflict) {
      lines.push(formatConflictEntry(key, entry, options));
    }
  }

  if (lines.length === 0) return '';
  return lines.join('\n\n');
}

module.exports = { formatConflictEntry, formatConflicts };
