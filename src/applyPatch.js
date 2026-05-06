/**
 * Apply a diff patch to a base env object, producing a new env object.
 * Entries that are removed in the diff are omitted from the result.
 * Entries that are added or changed are merged in.
 */

/**
 * @param {Record<string, string>} base - parsed base env
 * @param {Array<{key: string, type: 'added'|'removed'|'changed', oldValue?: string, newValue?: string}>} patch - diff to apply
 * @returns {Record<string, string>} patched env
 */
function applyPatch(base, patch) {
  const result = { ...base };

  for (const entry of patch) {
    if (entry.type === 'added') {
      result[entry.key] = entry.newValue;
    } else if (entry.type === 'removed') {
      delete result[entry.key];
    } else if (entry.type === 'changed') {
      result[entry.key] = entry.newValue;
    }
  }

  return result;
}

/**
 * Check whether a patch can be cleanly applied to a base env.
 * A patch is considered unapplicable if a 'removed' or 'changed' entry
 * does not match the current value in base.
 *
 * @param {Record<string, string>} base
 * @param {Array<{key: string, type: string, oldValue?: string, newValue?: string}>} patch
 * @returns {{ applicable: boolean, conflicts: string[] }}
 */
function checkApplicable(base, patch) {
  const conflicts = [];

  for (const entry of patch) {
    if (entry.type === 'removed' || entry.type === 'changed') {
      if (!(entry.key in base)) {
        conflicts.push(entry.key);
      } else if (base[entry.key] !== entry.oldValue) {
        conflicts.push(entry.key);
      }
    }
  }

  return { applicable: conflicts.length === 0, conflicts };
}

module.exports = { applyPatch, checkApplicable };
