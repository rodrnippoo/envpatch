/**
 * formatDeprecate.js — Human-readable output for deprecation results
 */

/**
 * Format a single deprecated key warning.
 * @param {string} key
 * @param {string|null} replacement
 * @returns {string}
 */
function formatDeprecateEntry(key, replacement = null) {
  const suggestion = replacement ? ` → use ${replacement} instead` : '';
  return `  ⚠  ${key} is deprecated${suggestion}`;
}

/**
 * Format a list of deprecated keys found in an env.
 * @param {string[]} found
 * @param {Object} replacements - map of { oldKey: newKey }
 * @returns {string}
 */
function formatDeprecateWarnings(found, replacements = {}) {
  if (found.length === 0) return '✔ No deprecated keys found.';
  const lines = ['Deprecated keys detected:'];
  for (const key of found) {
    lines.push(formatDeprecateEntry(key, replacements[key] || null));
  }
  return lines.join('\n');
}

/**
 * Format the result of applying replacements.
 * @param {Array<{ from: string, to: string }>} applied
 * @returns {string}
 */
function formatReplaceResult(applied) {
  if (applied.length === 0) return 'No replacements applied.';
  const lines = [`Applied ${applied.length} replacement(s):`];
  for (const { from, to } of applied) {
    lines.push(`  ${from} → ${to}`);
  }
  return lines.join('\n');
}

/**
 * Format a deprecation summary object.
 * @param {{ total: number, found: string[], replaced: Array, clean: boolean }} summary
 * @returns {string}
 */
function formatDeprecateSummary(summary) {
  if (summary.clean) return '✔ Environment is free of deprecated keys.';
  const parts = [`Found ${summary.total} deprecated key(s).`];
  if (summary.replaced.length > 0) {
    parts.push(`Replaced: ${summary.replaced.map(r => r.from).join(', ')}`);
  }
  const remaining = summary.found.filter(
    k => !summary.replaced.some(r => r.from === k)
  );
  if (remaining.length > 0) {
    parts.push(`Still present: ${remaining.join(', ')}`);
  }
  return parts.join(' ');
}

module.exports = {
  formatDeprecateEntry,
  formatDeprecateWarnings,
  formatReplaceResult,
  formatDeprecateSummary,
};
