#!/usr/bin/env node
/**
 * transform.cli.js — CLI for applying transforms to .env files
 * Usage: node transform.cli.js --input .env --op uppercase-keys --output .env.out
 */

const fs = require('fs');
const { parse, serialize } = require('./parser');
const { mapValues, mapKeys, filterEnv, transformSummary } = require('./transform');
const { formatTransformResult } = require('./formatTransform');

function getArg(args, flag) {
  const i = args.indexOf(flag);
  return i !== -1 ? args[i + 1] : null;
}

function run(argv = process.argv.slice(2)) {
  const input  = getArg(argv, '--input');
  const output = getArg(argv, '--output');
  const op     = getArg(argv, '--op');

  if (!input || !op) {
    console.error('Usage: transform.cli.js --input <file> --op <operation> [--output <file>]');
    console.error('Operations: uppercase-keys, lowercase-keys, trim-values, remove-empty');
    process.exit(1);
  }

  const raw = fs.readFileSync(input, 'utf8');
  const env = parse(raw);

  let result;
  switch (op) {
    case 'uppercase-keys':
      result = mapKeys(env, k => k.toUpperCase());
      break;
    case 'lowercase-keys':
      result = mapKeys(env, k => k.toLowerCase());
      break;
    case 'trim-values':
      result = mapValues(env, v => v.trim());
      break;
    case 'remove-empty':
      result = filterEnv(env, v => v !== '');
      break;
    default:
      console.error(`Unknown operation: ${op}`);
      process.exit(1);
  }

  const summary = transformSummary(env, result);
  const report  = formatTransformResult(env, result, summary);
  console.log(report);

  if (output) {
    fs.writeFileSync(output, serialize(result));
    console.log(`Written to ${output}`);
  } else {
    console.log('\n' + serialize(result));
  }
}

if (require.main === module) run();
module.exports = { getArg, run };
