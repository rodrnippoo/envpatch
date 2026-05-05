/**
 * Compute a diff between two parsed .env objects.
 * Returns an array of change entries describing added, removed, and modified keys.
 */

/**
 * @typedef {'added'|'removed'|'modified'|'unchanged'} ChangeType
 * @typedef {{ key: string, type: ChangeType, oldValue?: string, newValue?: string }} Change
 */

/**
 * Diff two env objects produced by parse().
 * @param {Record<string,string>} base  - the original env
 * @param {Record<string,string>} next  - the incoming env
 * @returns {Change[]}
 */
function diff(base, next) {
  const changes = [];
  const allKeys = new Set([...Object.keys(base), ...Object.keys(next)]);

  for (const key of [...allKeys].sort()) {
    const inBase = Object.prototype.hasOwnProperty.call(base, key);
    const inNext = Object.prototype.hasOwnProperty.call(next, key);

    if (inBase && !inNext) {
      changes.push({ key, type: 'removed', oldValue: base[key] });
    } else if (!inBase && inNext) {
      changes.push({ key, type: 'added', newValue: next[key] });
    } else if (base[key] !== next[key]) {
      changes.push({ key, type: 'modified', oldValue: base[key], newValue: next[key] });
    } else {
      changes.push({ key, type: 'unchanged', oldValue: base[key], newValue: next[key] });
    }
  }

  return changes;
}

/**
 * Returns true if the diff contains any added, removed, or modified entries.
 * @param {Change[]} changes
 * @returns {boolean}
 */
function hasDifferences(changes) {
  return changes.some((c) => c.type !== 'unchanged');
}

module.exports = { diff, hasDifferences };
