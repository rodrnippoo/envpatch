/**
 * Format output for encrypt/decrypt CLI operations
 */

const { isEncrypted } = require('./encrypt');

const RESET = '\x1b[0m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const DIM = '\x1b[2m';

function formatEncryptResult(before, after) {
  const lines = [];

  for (const key of Object.keys(after)) {
    const wasPlain = !isEncrypted(before[key]);
    const nowEncrypted = isEncrypted(after[key]);

    if (wasPlain && nowEncrypted) {
      lines.push(`${GREEN}encrypted${RESET}  ${key}`);
    } else {
      lines.push(`${DIM}unchanged${RESET}  ${key}`);
    }
  }

  return lines.join('\n');
}

function formatDecryptResult(before, after) {
  const lines = [];

  for (const key of Object.keys(after)) {
    const wasEncrypted = isEncrypted(before[key]);
    const nowPlain = !isEncrypted(after[key]);

    if (wasEncrypted && nowPlain) {
      lines.push(`${YELLOW}decrypted${RESET}  ${key}`);
    } else {
      lines.push(`${DIM}unchanged${RESET}  ${key}`);
    }
  }

  return lines.join('\n');
}

function formatEncryptSummary(before, after) {
  const encryptedCount = Object.keys(after).filter(
    (k) => !isEncrypted(before[k]) && isEncrypted(after[k])
  ).length;

  const total = Object.keys(after).length;
  return `${encryptedCount}/${total} value(s) encrypted`;
}

module.exports = { formatEncryptResult, formatDecryptResult, formatEncryptSummary };
