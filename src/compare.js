/**
 * Compare two env objects and produce a structured report
 * showing added, removed, changed, and unchanged keys.
 */

/**
 * @param {Record<string, string>} base
 * @param {Record<string, string>} target
 * @returns {CompareResult}
 */
function compareEnv(base, target) {
  const allKeys = new Set([...Object.keys(base), ...Object.keys(target)]);
  const added = {};
  const removed = {};
  const changed = {};
  const unchanged = {};

  for (const key of allKeys) {
    const inBase = Object.prototype.hasOwnProperty.call(base, key);
    const inTarget = Object.prototype.hasOwnProperty.call(target, key);

    if (inBase && !inTarget) {
      removed[key] = base[key];
    } else if (!inBase && inTarget) {
      added[key] = target[key];
    } else if (base[key] !== target[key]) {
      changed[key] = { from: base[key], to: target[key] };
    } else {
      unchanged[key] = base[key];
    }
  }

  return { added, removed, changed, unchanged };
}

/**
 * Returns a summary count of changes.
 * @param {CompareResult} result
 */
function summarizeCompare(result) {
  return {
    added: Object.keys(result.added).length,
    removed: Object.keys(result.removed).length,
    changed: Object.keys(result.changed).length,
    unchanged: Object.keys(result.unchanged).length,
  };
}

/**
 * Returns true if there are any differences between the two envs.
 * @param {CompareResult} result
 */
function hasChanges(result) {
  const s = summarizeCompare(result);
  return s.added > 0 || s.removed > 0 || s.changed > 0;
}

module.exports = { compareEnv, summarizeCompare, hasChanges };
