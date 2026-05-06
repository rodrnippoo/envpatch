/**
 * Lint .env files for common issues and style violations.
 */

const VALID_KEY_RE = /^[A-Z][A-Z0-9_]*$/;
const QUOTED_VALUE_RE = /^".*"$|^'.*'$/;
const TRAILING_SPACE_RE = /\s+$/;
const DUPLICATE_BLANK_RE = /\n{3,}/;

/**
 * @param {string} raw - raw .env file content
 * @returns {Array<{line: number, code: string, message: string}>}
 */
function lint(raw) {
  const issues = [];
  const lines = raw.split('\n');
  const seenKeys = new Map();

  lines.forEach((line, idx) => {
    const lineNum = idx + 1;

    // skip blank lines and comments
    if (line.trim() === '' || line.trimStart().startsWith('#')) return;

    const eqIdx = line.indexOf('=');
    if (eqIdx === -1) {
      issues.push({ line: lineNum, code: 'E001', message: 'Missing "=" in assignment' });
      return;
    }

    const key = line.slice(0, eqIdx).trim();
    const value = line.slice(eqIdx + 1);

    if (!VALID_KEY_RE.test(key)) {
      issues.push({ line: lineNum, code: 'W001', message: `Key "${key}" should be uppercase with underscores` });
    }

    if (seenKeys.has(key)) {
      issues.push({ line: lineNum, code: 'E002', message: `Duplicate key "${key}" (first seen on line ${seenKeys.get(key)})` });
    } else {
      seenKeys.set(key, lineNum);
    }

    if (TRAILING_SPACE_RE.test(value)) {
      issues.push({ line: lineNum, code: 'W002', message: `Trailing whitespace in value for "${key}"` });
    }

    if (value.includes('"') && !QUOTED_VALUE_RE.test(value.trim())) {
      issues.push({ line: lineNum, code: 'W003', message: `Unbalanced quotes in value for "${key}"` });
    }
  });

  if (DUPLICATE_BLANK_RE.test(raw)) {
    issues.push({ line: null, code: 'W004', message: 'Multiple consecutive blank lines detected' });
  }

  return issues;
}

/**
 * @param {Array<{line: number, code: string, message: string}>} issues
 * @returns {string}
 */
function formatLintResults(issues) {
  if (issues.length === 0) return 'No issues found.';

  const lines = issues.map(({ line, code, message }) => {
    const loc = line != null ? `line ${line}` : 'file';
    return `  [${code}] ${loc}: ${message}`;
  });

  const summary = `${issues.length} issue${issues.length === 1 ? '' : 's'} found.`;
  return [summary, ...lines].join('\n');
}

module.exports = { lint, formatLintResults };
