#!/usr/bin/env node
/**
 * audit.cli.js — CLI helper to display or record audit entries for env operations
 * Usage: node audit.cli.js --op merge --before .env --after .env.new [--user alice]
 */

const fs = require('fs');
const path = require('path');
const { parse } = require('./parser');
const { createAuditEntry, formatAuditLog } = require('./audit');

function getArg(args, flag, defaultValue = null) {
  const idx = args.indexOf(flag);
  return idx !== -1 && args[idx + 1] ? args[idx + 1] : defaultValue;
}

function run(args = process.argv.slice(2)) {
  const operation = getArg(args, '--op') || 'unknown';
  const beforeFile = getArg(args, '--before');
  const afterFile = getArg(args, '--after');
  const user = getArg(args, '--user');
  const logFile = getArg(args, '--log');

  if (!beforeFile || !afterFile) {
    console.error('Usage: audit.cli.js --op <operation> --before <file> --after <file> [--user <name>] [--log <logfile>]');
    process.exit(1);
  }

  let before, after;
  try {
    before = parse(fs.readFileSync(path.resolve(beforeFile), 'utf8'));
  } catch (e) {
    console.error(`Could not read before file: ${beforeFile}`);
    process.exit(1);
  }

  try {
    after = parse(fs.readFileSync(path.resolve(afterFile), 'utf8'));
  } catch (e) {
    console.error(`Could not read after file: ${afterFile}`);
    process.exit(1);
  }

  const meta = { user: user || undefined };
  const entry = createAuditEntry(operation, before, after, meta);

  if (logFile) {
    let existing = [];
    try {
      existing = JSON.parse(fs.readFileSync(path.resolve(logFile), 'utf8'));
    } catch (_) {
      // file doesn't exist yet, start fresh
    }
    existing.push(entry);
    fs.writeFileSync(path.resolve(logFile), JSON.stringify(existing, null, 2));
    console.log(`Audit entry appended to ${logFile}`);
  }

  console.log(formatAuditLog([entry]));
}

if (require.main === module) {
  run();
}

module.exports = { run };
