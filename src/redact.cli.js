#!/usr/bin/env node
/**
 * CLI for redacting sensitive values from .env files
 * Usage: node redact.cli.js --input .env [--output .env.redacted] [--keys KEY1,KEY2]
 */

const fs = require('fs');
const path = require('path');
const { parse } = require('./parser');
const { redactEnv, listRedactedKeys } = require('./redact');
const {
  formatRedacted,
  formatRedactSummary,
  formatRedactWarning,
} = require('./formatRedact');

function getArg(name) {
  const idx = process.argv.indexOf(name);
  return idx !== -1 ? process.argv[idx + 1] : null;
}

function run() {
  const inputPath = getArg('--input');
  const outputPath = getArg('--output');
  const extraKeys = getArg('--keys');
  const warnOnly = process.argv.includes('--warn');

  if (!inputPath) {
    console.error('Usage: redact.cli.js --input <file> [--output <file>] [--keys KEY1,KEY2] [--warn]');
    process.exit(1);
  }

  const fullInput = path.resolve(process.cwd(), inputPath);
  if (!fs.existsSync(fullInput)) {
    console.error(`File not found: ${fullInput}`);
    process.exit(1);
  }

  const raw = fs.readFileSync(fullInput, 'utf8');
  const env = parse(raw);
  const additionalKeys = extraKeys ? extraKeys.split(',').map((k) => k.trim()) : [];
  const redactedKeys = listRedactedKeys(env, additionalKeys);

  if (warnOnly) {
    const warning = formatRedactWarning(redactedKeys);
    if (warning) {
      console.warn(warning);
      process.exit(1);
    } else {
      console.log('No sensitive keys detected.');
      process.exit(0);
    }
  }

  const redacted = redactEnv(env, additionalKeys);
  const summary = formatRedactSummary(redactedKeys, Object.keys(env).length);
  console.log(summary);

  if (outputPath) {
    const fullOutput = path.resolve(process.cwd(), outputPath);
    fs.writeFileSync(fullOutput, formatRedacted(redacted), 'utf8');
    console.log(`Written to ${fullOutput}`);
  } else {
    console.log('\n' + formatRedacted(redacted));
  }
}

run();
