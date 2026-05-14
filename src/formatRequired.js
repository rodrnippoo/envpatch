/**
 * formatRequired.js — Format required key check results for display
 */

import { missingRequired, requiredReport } from './required.js';

const PASS = '✔';
const FAIL = '✘';

/**
 * Format a single report entry.
 * @param {{ key: string, present: boolean, value: string|undefined }} entry
 * @returns {string}
 */
export function formatRequiredEntry(entry) {
  const icon = entry.present ? PASS : FAIL;
  const status = entry.present ? `= ${entry.value}` : 'MISSING';
  return `  ${icon} ${entry.key}: ${status}`;
}

/**
 * Format the full required check output.
 * @param {Object} env
 * @param {string[]} requiredKeys
 * @returns {string}
 */
export function formatRequiredCheck(env, requiredKeys) {
  const report = requiredReport(env, requiredKeys);
  const missing = missingRequired(env, requiredKeys);
  const lines = [
    `Required keys check (${requiredKeys.length} keys):`,
    ...report.map(formatRequiredEntry),
  ];
  if (missing.length === 0) {
    lines.push('\nAll required keys are present.');
  } else {
    lines.push(`\n${missing.length} required key(s) missing: ${missing.join(', ')}`);
  }
  return lines.join('\n');
}

/**
 * Format a short summary line.
 * @param {string[]} missing
 * @param {number} total
 * @returns {string}
 */
export function formatRequiredSummary(missing, total) {
  if (missing.length === 0) {
    return `All ${total} required key(s) satisfied.`;
  }
  return `Missing ${missing.length}/${total} required key(s): ${missing.join(', ')}`;
}
