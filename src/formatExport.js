// Formatting helpers for export CLI output

/**
 * Format a success message after export
 * @param {string} format
 * @param {string|null} outputPath - null means stdout
 * @param {number} keyCount
 * @returns {string}
 */
function formatExportSuccess(format, outputPath, keyCount) {
  const dest = outputPath ? `→ ${outputPath}` : '→ stdout';
  return `✔ Exported ${keyCount} key(s) as ${format.toUpperCase()} ${dest}`;
}

/**
 * Format a header/banner for export output when printing to terminal
 * @param {string} format
 * @param {string} sourcePath
 * @returns {string}
 */
function formatExportHeader(format, sourcePath) {
  return `# envpatch export: ${sourcePath} [${format.toUpperCase()}]\n`;
}

/**
 * Format an error message for export failures
 * @param {string} format
 * @param {Error} err
 * @returns {string}
 */
function formatExportError(format, err) {
  return `✖ Export failed (${format}): ${err.message}`;
}

module.exports = { formatExportSuccess, formatExportHeader, formatExportError };
