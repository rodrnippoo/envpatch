/**
 * Deduplicate keys in a parsed env object or across multiple env objects.
 * When duplicates exist, the last occurrence wins by default.
 */

/**
 * Find duplicate keys in a flat key array.
 * @param {string[]} keys
 * @returns {string[]}
 */
function findDuplicateKeys(keys) {
  const seen = new Set();
  const dupes = new Set();
  for (const key of keys) {
    if (seen.has(key)) dupes.add(key);
    else seen.add(key);
  }
  return [...dupes];
}

/**
 * Deduplicate an array of {key, value} entries (as produced by a raw parse).
 * @param {Array<{key: string, value: string}>} entries
 * @param {'first'|'last'} strategy - which occurrence to keep
 * @returns {{ result: Object, duplicates: string[] }}
 */
function dedupeEntries(entries, strategy = 'last') {
  const keys = entries.map(e => e.key);
  const duplicates = findDuplicateKeys(keys);

  const result = {};
  const ordered = strategy === 'first' ? entries : [...entries].reverse();
  for (const { key, value } of ordered) {
    if (!(key in result)) {
      result[key] = value;
    }
  }

  return { result, duplicates };
}

/**
 * Deduplicate a plain env object (no-op for duplicates since objects
 * already collapse them, but useful for reporting).
 * @param {Object} env
 * @returns {{ result: Object, duplicates: string[] }}
 */
function dedupeEnv(env) {
  return { result: { ...env }, duplicates: [] };
}

/**
 * Merge multiple env objects, deduplicating keys.
 * Later envs override earlier ones.
 * @param {Object[]} envs
 * @returns {{ result: Object, duplicates: string[] }}
 */
function dedupeMany(envs) {
  const allKeys = envs.flatMap(e => Object.keys(e));
  const duplicates = findDuplicateKeys(allKeys);
  const result = Object.assign({}, ...envs);
  return { result, duplicates };
}

/**
 * Summarize a dedupe operation.
 * @param {string[]} duplicates
 * @returns {Object}
 */
function dedupeSummary(duplicates) {
  return {
    totalDuplicates: duplicates.length,
    keys: duplicates,
    clean: duplicates.length === 0,
  };
}

module.exports = { findDuplicateKeys, dedupeEntries, dedupeEnv, dedupeMany, dedupeSummary };
