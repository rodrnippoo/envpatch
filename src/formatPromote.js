/**
 * formatPromote.js — Human-readable output for promote operations
 */

function formatPromoteResult({ promoted, skipped, missing }) {
  const lines = [];

  if (promoted.length > 0) {
    lines.push('Promoted:');
    for (const { key, value } of promoted) {
      lines.push(`  + ${key}=${value}`);
    }
  }

  if (skipped.length > 0) {
    lines.push('Skipped (already set):');
    for (const { key, existing, incoming } of skipped) {
      lines.push(`  ~ ${key}: kept "${existing}", incoming "${incoming}"`);
    }
  }

  if (missing.length > 0) {
    lines.push('Not found in source:');
    for (const key of missing) {
      lines.push(`  ! ${key}`);
    }
  }

  if (lines.length === 0) {
    return 'Nothing to promote.';
  }

  return lines.join('\n');
}

function formatPromoteSummary({ promotedCount, skippedCount, missingCount }) {
  const parts = [];
  if (promotedCount > 0) parts.push(`${promotedCount} promoted`);
  if (skippedCount > 0) parts.push(`${skippedCount} skipped`);
  if (missingCount > 0) parts.push(`${missingCount} missing`);
  return parts.length > 0 ? parts.join(', ') : 'No changes.';
}

function formatPromoteHeader(from, to) {
  return `Promoting from [${from}] → [${to}]`;
}

module.exports = { formatPromoteResult, formatPromoteSummary, formatPromoteHeader };
