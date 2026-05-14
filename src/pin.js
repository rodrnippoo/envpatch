/**
 * pin.js — Pin specific keys to fixed values, preventing them from being
 * overwritten during merge or patch operations.
 */

/**
 * Pin a set of keys in an env object so their values are locked.
 * Returns a new env with pinned metadata attached.
 */
function pinKeys(env, keysToPIn) {
  const keys = Array.isArray(keysToPIn) ? keysToPIn : [keysToPIn];
  const pinned = {};
  for (const key of keys) {
    if (Object.prototype.hasOwnProperty.call(env, key)) {
      pinned[key] = env[key];
    }
  }
  return pinned;
}

/**
 * Apply pinned values on top of an env, overriding any incoming values
 * for pinned keys.
 */
function applyPins(env, pinned) {
  return { ...env, ...pinned };
}

/**
 * Check which keys in an incoming env would be overridden by pins.
 */
function getPinConflicts(incoming, pinned) {
  const conflicts = {};
  for (const key of Object.keys(pinned)) {
    if (
      Object.prototype.hasOwnProperty.call(incoming, key) &&
      incoming[key] !== pinned[key]
    ) {
      conflicts[key] = { incoming: incoming[key], pinned: pinned[key] };
    }
  }
  return conflicts;
}

/**
 * Summarize pin application: how many keys were pinned, how many conflicts.
 */
function pinSummary(env, pinned) {
  const conflicts = getPinConflicts(env, pinned);
  const applied = Object.keys(pinned).filter(k =>
    Object.prototype.hasOwnProperty.call(env, k)
  );
  return {
    total: Object.keys(pinned).length,
    applied: applied.length,
    conflicts: Object.keys(conflicts).length,
    conflictKeys: Object.keys(conflicts),
  };
}

module.exports = { pinKeys, applyPins, getPinConflicts, pinSummary };
