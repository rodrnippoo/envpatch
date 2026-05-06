/**
 * envpatch public API
 */

const { parse, serialize } = require('./parser');
const { diff, hasDifferences } = require('./diff');
const { merge, hasConflicts } = require('./merge');
const { getConflicts } = require('./resolve');
const { formatDiff } = require('./formatDiff');
const { formatConflicts } = require('./formatConflict');
const { applyPatch, checkApplicable } = require('./applyPatch');
const { formatPatch } = require('./formatPatch');

/**
 * Diff two .env file strings.
 * @param {string} baseText
 * @param {string} headText
 * @returns {{ entries: Array, hasDifferences: boolean, formatted: string }}
 */
function diffEnv(baseText, headText) {
  const base = parse(baseText);
  const head = parse(headText);
  const entries = diff(base, head);
  return {
    entries,
    hasDifferences: hasDifferences(entries),
    formatted: formatDiff(entries),
  };
}

/**
 * Merge two .env file strings into a base.
 * @param {string} baseText
 * @param {string} oursText
 * @param {string} theirsText
 * @returns {{ result: Record<string,string>, hasConflicts: boolean, conflicts: Array, formatted: string }}
 */
function mergeEnv(baseText, oursText, theirsText) {
  const base = parse(baseText);
  const ours = parse(oursText);
  const theirs = parse(theirsText);
  const result = merge(base, ours, theirs);
  const conflicts = getConflicts(base, ours, theirs);
  return {
    result,
    hasConflicts: hasConflicts(result),
    conflicts,
    formatted: formatConflicts(conflicts),
  };
}

/**
 * Apply a patch (diff entries) to a base .env string.
 * @param {string} baseText
 * @param {Array} patch
 * @param {{ color?: boolean }} options
 * @returns {{ result: Record<string,string>, serialized: string, applicable: boolean, conflicts: string[], formatted: string }}
 */
function patchEnv(baseText, patch, options = {}) {
  const base = parse(baseText);
  const { applicable, conflicts } = checkApplicable(base, patch);
  const result = applicable ? applyPatch(base, patch) : base;
  return {
    result,
    serialized: serialize(result),
    applicable,
    conflicts,
    formatted: formatPatch(patch, options),
  };
}

module.exports = { diffEnv, mergeEnv, patchEnv, parse, serialize };
