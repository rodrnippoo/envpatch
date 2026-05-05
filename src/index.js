/**
 * envpatch — public API
 * Exposes parse, serialize, diff, merge, resolve, and formatting utilities.
 */

const { parse, serialize } = require('./parser');
const { diff, hasDifferences } = require('./diff');
const { formatDiff } = require('./formatDiff');
const { merge, hasConflicts } = require('./merge');
const { resolve, getConflicts } = require('./resolve');
const { formatConflictEntry, formatConflicts } = require('./formatConflict');

/**
 * High-level helper: merge two .env strings and resolve conflicts in one step.
 *
 * @param {string} oursText - raw .env content (ours)
 * @param {string} theirsText - raw .env content (theirs)
 * @param {'ours'|'theirs'|'interactive'} strategy
 * @param {Function} [resolver]
 * @returns {Promise<string>} serialized resolved .env content
 */
async function mergeAndResolve(oursText, theirsText, strategy = 'ours', resolver) {
  const ours = parse(oursText);
  const theirs = parse(theirsText);
  const merged = merge(ours, theirs);
  const resolved = await resolve(merged, strategy, resolver);
  return serialize(resolved);
}

/**
 * High-level helper: diff two .env strings and return a formatted string.
 *
 * @param {string} baseText
 * @param {string} headText
 * @param {{ color?: boolean }} options
 * @returns {string}
 */
function diffEnv(baseText, headText, options = {}) {
  const base = parse(baseText);
  const head = parse(headText);
  const diffResult = diff(base, head);
  return formatDiff(diffResult, options);
}

module.exports = {
  // low-level
  parse,
  serialize,
  diff,
  hasDifferences,
  formatDiff,
  merge,
  hasConflicts,
  resolve,
  getConflicts,
  formatConflictEntry,
  formatConflicts,
  // high-level helpers
  mergeAndResolve,
  diffEnv,
};
