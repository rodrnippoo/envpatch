#!/usr/bin/env node
// CLI for envpatch export
// Usage: node export.cli.js --input .env --format json [--output out.json] [--no-header]

const fs = require('fs');
const path = require('path');
const { parse } = require('./parser');
const { exportEnv } = require('./export');
const { formatExportSuccess, formatExportHeader, formatExportError } = require('./formatExport');

function getArg(args, flag, fallback = null) {
  const idx = args.indexOf(flag);
  return idx !== -1 && args[idx + 1] ? args[idx + 1] : fallback;
}

function run(argv = process.argv.slice(2)) {
  const inputPath  = getArg(argv, '--input', '.env');
  const format     = getArg(argv, '--format', 'json');
  const outputPath = getArg(argv, '--output', null);
  const noHeader   = argv.includes('--no-header');

  let raw;
  try {
    raw = fs.readFileSync(path.resolve(inputPath), 'utf8');
  } catch (err) {
    console.error(`✖ Could not read file: ${inputPath}`);
    process.exit(1);
  }

  let result;
  try {
    const env = parse(raw);
    result = exportEnv(env, format);
    const keyCount = Object.keys(env).length;

    if (outputPath) {
      fs.writeFileSync(path.resolve(outputPath), result, 'utf8');
      console.log(formatExportSuccess(format, outputPath, keyCount));
    } else {
      if (!noHeader) process.stdout.write(formatExportHeader(format, inputPath));
      console.log(result);
    }
  } catch (err) {
    console.error(formatExportError(format, err));
    process.exit(1);
  }
}

if (require.main === module) run();
module.exports = { getArg, run };
