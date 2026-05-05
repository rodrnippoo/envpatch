const { diff } = require('./diff');

/**
 * Merge strategy options:
 * - 'base'   : keep base value on conflict
 * - 'patch'  : keep patch value on conflict (default)
 * - 'error'  : throw on conflict
 */
function merge(base, patch, strategy = 'patch') {
  const result = { ...base };
  const conflicts = [];

  for (const [key, patchValue] of Object.entries(patch)) {
    if (!(key in base)) {
      // New key from patch — always add it
      result[key] = patchValue;
    } else if (base[key] !== patchValue) {
      // Conflict: key exists in both but values differ
      conflicts.push({ key, baseValue: base[key], patchValue });

      if (strategy === 'patch') {
        result[key] = patchValue;
      } else if (strategy === 'base') {
        result[key] = base[key];
      } else if (strategy === 'error') {
        throw new Error(
          `Merge conflict on key "${key}": base="${base[key]}" patch="${patchValue}"`
        );
      } else {
        throw new Error(`Unknown merge strategy: "${strategy}"`);
      }
    }
    // If values are equal, nothing to do
  }

  return { result, conflicts };
}

/**
 * Returns true if merging patch into base would produce any conflicts.
 */
function hasConflicts(base, patch) {
  for (const [key, patchValue] of Object.entries(patch)) {
    if (key in base && base[key] !== patchValue) {
      return true;
    }
  }
  return false;
}

module.exports = { merge, hasConflicts };
