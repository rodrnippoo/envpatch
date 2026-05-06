#!/usr/bin/env node
const path = require('path');
const { watchEnv } = require('./watch');
const { formatWatchEvent, formatWatchStart, formatWatchStop } = require('./formatWatch');

function getArg(flag, defaultValue = null) {
  const idx = process.argv.indexOf(flag);
  if (idx !== -1 && process.argv[idx + 1]) return process.argv[idx + 1];
  return defaultValue;
}

function run() {
  const filePath = getArg('--file') || getArg('-f') || '.env';
  const resolved = path.resolve(filePath);
  let eventCount = 0;

  console.log(formatWatchStart(resolved));

  const handle = watchEnv(resolved, {
    onChange(diffResult, auditEntry) {
      eventCount++;
      console.log(formatWatchEvent(resolved, diffResult, auditEntry));
    },
    onError(err) {
      console.error('Watch error:', err.message);
    },
  });

  function shutdown() {
    handle.stop();
    console.log('\n' + formatWatchStop(resolved, eventCount));
    process.exit(0);
  }

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

run();
