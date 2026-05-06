#!/usr/bin/env node
/**
 * CLI helper for encrypting/decrypting values in a .env file
 * Usage:
 *   node encrypt.cli.js encrypt <file> <key1,key2> --secret=<secret>
 *   node encrypt.cli.js decrypt <file> --secret=<secret>
 */

const fs = require('fs');
const path = require('path');
const { parse, serialize } = require('./parser');
const { encryptEnv, decryptEnv } = require('./encrypt');
const { formatEncryptResult, formatDecryptResult, formatEncryptSummary } = require('./formatEncrypt');

function getArg(args, flag) {
  const entry = args.find((a) => a.startsWith(flag + '='));
  return entry ? entry.slice(flag.length + 1) : null;
}

function run(argv) {
  const [command, filePath, keysArg, ...rest] = argv;

  if (!command || !filePath) {
    console.error('Usage: encrypt.cli.js <encrypt|decrypt> <file> [keys] [--secret=<secret>]');
    process.exit(1);
  }

  const secret = getArg(rest, '--secret') || process.env.ENVPATCH_SECRET;
  if (!secret) {
    console.error('Error: secret is required (--secret=<value> or ENVPATCH_SECRET env var)');
    process.exit(1);
  }

  const fullPath = path.resolve(filePath);
  if (!fs.existsSync(fullPath)) {
    console.error(`Error: file not found: ${fullPath}`);
    process.exit(1);
  }

  const raw = fs.readFileSync(fullPath, 'utf8');
  const parsed = parse(raw);

  if (command === 'encrypt') {
    const keys = keysArg ? keysArg.split(',').map((k) => k.trim()) : Object.keys(parsed);
    const result = encryptEnv(parsed, keys, secret);
    console.log(formatEncryptResult(parsed, result));
    console.log(formatEncryptSummary(parsed, result));
    fs.writeFileSync(fullPath, serialize(result));
  } else if (command === 'decrypt') {
    const result = decryptEnv(parsed, secret);
    console.log(formatDecryptResult(parsed, result));
    fs.writeFileSync(fullPath, serialize(result));
  } else {
    console.error(`Unknown command: ${command}`);
    process.exit(1);
  }
}

if (require.main === module) {
  run(process.argv.slice(2));
}

module.exports = { run };
