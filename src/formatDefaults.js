/**
 * formatDefaults.js — Human-readable output for defaults operations.
 */

const FILLED_ICON = '+';
const OK_ICON = '✓';
const WARN_ICON = '!';

/**
 * Format the result of an applyDefaults call.
 *
 * @param {string[]} filled  Keys that were filled from defaults
 * @returns {string}
 */
function formatApplyDefaults(filled) {
  if (filled.length === 0) {
    return `${OK_ICON} No missing keys — nothing to fill.`;
  }
  const lines = [`${FILLED_ICON} Filled ${filled.length} missing key(s) from defaults:`];
  for (const key of filled) {
    lines.push(`  ${FILLED_ICON} ${key}`);
  }
  return lines.join('\n');
}

/**
 * Format a completeness check result.
 *
 * @param {string[]} missing  Keys missing from target
 * @param {string}   label    Optional label for the target env
 * @returns {string}
 */
function formatCompletenessCheck(missing, label = '.env') {
  if (missing.length === 0) {
    return `${OK_ICON} ${label} has all required default keys.`;
  }
  const lines = [
    `${WARN_ICON} ${label} is missing ${missing.length} required key(s):`,
  ];
  for (const key of missing) {
    lines.push(`  - ${key}`);
  }
  return lines.join('\n');
}

/**
 * One-line summary suitable for CLI output.
 *
 * @param {string[]} filled
 * @param {number}   total   Total keys in defaults
 * @returns {string}
 */
function formatDefaultsSummary(filled, total) {
  const skipped = total - filled.length;
  return [
    `Defaults applied: ${filled.length} filled, ${skipped} already present (${total} total).`,
  ].join('');
}

module.exports = { formatApplyDefaults, formatCompletenessCheck, formatDefaultsSummary };
