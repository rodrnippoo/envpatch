/**
 * freeze.js — Lock env keys to prevent accidental modification
 */

/**
 * Freeze specific keys so they cannot be changed in a target env.
 * Returns a list of violations.
 * @param {Object} source - the env with locked values
 * @param {Object} target - the env being checked
 * @param {string[]} keys - keys to freeze
 * @returns {{ key: string, expected: string, actual: string }[]}
 */
function checkFrozen(source, target, keys) {
  return keys
    .filter(key => key in source && key in target)
    .filter(key => target[key] !== source[key])
    .map(key => ({ key, expected: source[key], actual: target[key] }));
}

/**
 * Apply frozen keys from source into target, overwriting any changes.
 * @param {Object} source
 * @param {Object} target
 * @param {string[]} keys
 * @returns {Object} patched target
 */
function applyFreeze(source, target, keys) {
  const result = { ...target };
  for (const key of keys) {
    if (key in source) {
      result[key] = source[key];
    }
  }
  return result;
}

/**
 * Detect which keys differ between source and target.
 * @param {Object} source
 * @param {Object} target
 * @returns {string[]}
 */
function frozenKeys(source, target) {
  return Object.keys(source).filter(
    key => key in target && target[key] !== source[key]
  );
}

/**
 * Summarize freeze operation.
 * @param {string[]} locked
 * @param {{ key: string, expected: string, actual: string }[]} violations
 * @returns {Object}
 */
function freezeSummary(locked, violations) {
  return {
    total: locked.length,
    violations: violations.length,
    safe: violations.length === 0,
  };
}

module.exports = { checkFrozen, applyFreeze, frozenKeys, freezeSummary };
