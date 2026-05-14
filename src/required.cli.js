#!/usr/bin/env node
/**
 * required.cli.js — CLI for checking required env keys
 *
 * Usage:
 *   node required.cli.js --env .env --keys KEY1,KEY2,KEY3
 *   node required.cli.js --env .env --keys-file .env.required
 */

import { readFileSync } from 'fs';
import { parse } from './parser.js';
import { missingRequired } from './required.js';
import { formatRequiredCheck, formatRequiredSummary } from './formatRequired.js';

export function getArg(args, flag) {
  const i = args.indexOf(flag);
  return i !== -1 ? args[i + 1] : undefined;
}

export async function run(args = process.argv.slice(2)) {
  const envFile = getArg(args, '--env') || '.env';
  const keysArg = getArg(args, '--keys');
  const keysFile = getArg(args, '--keys-file');
  const summary = args.includes('--summary');

  let envContent;
  try {
    envContent = readFileSync(envFile, 'utf8');
  } catch {
    console.error(`Error: could not read env file: ${envFile}`);
    process.exit(1);
  }

  let requiredKeys = [];
  if (keysArg) {
    requiredKeys = keysArg.split(',').map(k => k.trim()).filter(Boolean);
  } else if (keysFile) {
    try {
      const content = readFileSync(keysFile, 'utf8');
      const parsed = parse(content);
      requiredKeys = Object.keys(parsed);
    } catch {
      console.error(`Error: could not read keys file: ${keysFile}`);
      process.exit(1);
    }
  } else {
    console.error('Error: provide --keys KEY1,KEY2 or --keys-file <file>');
    process.exit(1);
  }

  const env = parse(envContent);
  const missing = missingRequired(env, requiredKeys);

  if (summary) {
    console.log(formatRequiredSummary(missing, requiredKeys.length));
  } else {
    console.log(formatRequiredCheck(env, requiredKeys));
  }

  process.exit(missing.length > 0 ? 1 : 0);
}

run();
