const { formatDiff } = require('./formatDiff');

/**
 * Format a watch event for console output
 * @param {string} filePath
 * @param {object} diffResult
 * @param {object} auditEntry
 * @returns {string}
 */
function formatWatchEvent(filePath, diffResult, auditEntry) {
  const ts = new Date(auditEntry.timestamp).toLocaleTimeString();
  const lines = [];
  lines.push(`[${ts}] Change detected in ${filePath}`);
  lines.push(formatDiff(diffResult));
  return lines.join('\n');
}

/**
 * Format a summary line for watch startup
 * @param {string} filePath
 * @returns {string}
 */
function formatWatchStart(filePath) {
  return `Watching ${filePath} for changes... (Ctrl+C to stop)`;
}

/**
 * Format a watch stopped message
 * @param {string} filePath
 * @param {number} eventCount
 * @returns {string}
 */
function formatWatchStop(filePath, eventCount) {
  const noun = eventCount === 1 ? 'change' : 'changes';
  return `Stopped watching ${filePath}. Detected ${eventCount} ${noun}.`;
}

module.exports = { formatWatchEvent, formatWatchStart, formatWatchStop };
