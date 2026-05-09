/**
 * promote.js — Copy/promote env variables from one environment to another
 */

/**
 * Promote keys from source env to target env.
 * Only copies keys that exist in source; optionally overwrite existing.
 */
function promoteKeys(source, target, keys, { overwrite = false } = {}) {
  const result = { ...target };
  const promoted = [];
  const skipped = [];
  const missing = [];

  for (const key of keys) {
    if (!(key in source)) {
      missing.push(key);
      continue;
    }
    if (key in target && !overwrite) {
      skipped.push({ key, existing: target[key], incoming: source[key] });
      continue;
    }
    result[key] = source[key];
    promoted.push({ key, value: source[key] });
  }

  return { result, promoted, skipped, missing };
}

/**
 * Promote ALL keys from source into target (respects overwrite flag).
 */
function promoteAll(source, target, { overwrite = false } = {}) {
  return promoteKeys(source, target, Object.keys(source), { overwrite });
}

/**
 * Promote only keys that are missing from target (safe fill).
 */
function promoteMissing(source, target) {
  const missingKeys = Object.keys(source).filter((k) => !(k in target));
  return promoteKeys(source, target, missingKeys, { overwrite: false });
}

/**
 * Summarize a promote operation.
 */
function promoteSummary({ promoted, skipped, missing }) {
  return {
    promotedCount: promoted.length,
    skippedCount: skipped.length,
    missingCount: missing.length,
  };
}

module.exports = { promoteKeys, promoteAll, promoteMissing, promoteSummary };
