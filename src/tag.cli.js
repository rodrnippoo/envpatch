#!/usr/bin/env node
// CLI for tagging env keys: list, filter, summarize

const fs = require('fs');
const { parse } = require('./parser');
const { tagKeys, filterByTag, listTags, tagSummary } = require('./tag');
const { formatTagGroups, formatTagSummary, formatTagEntry } = require('./formatTag');

function getArg(flag) {
  const i = process.argv.indexOf(flag);
  return i !== -1 ? process.argv[i + 1] : null;
}

function loadTagMap(path) {
  if (!path || !fs.existsSync(path)) return {};
  const raw = fs.readFileSync(path, 'utf8');
  return JSON.parse(raw);
}

function run() {
  const envFile = getArg('--env') || '.env';
  const tagFile = getArg('--tags');
  const filterTag = getArg('--filter');
  const cmd = process.argv[2];

  if (!fs.existsSync(envFile)) {
    console.error(`File not found: ${envFile}`);
    process.exit(1);
  }

  const env = parse(fs.readFileSync(envFile, 'utf8'));
  const tagMap = loadTagMap(tagFile);
  const tagged = tagKeys(env, tagMap);

  if (cmd === 'list') {
    console.log(formatTagGroups(tagged));
    return;
  }

  if (cmd === 'filter') {
    if (!filterTag) {
      console.error('--filter <tag> is required for filter command');
      process.exit(1);
    }
    const result = filterByTag(tagged, filterTag);
    for (const [key, value] of Object.entries(result)) {
      console.log(`${key}=${value}`);
    }
    return;
  }

  if (cmd === 'summary') {
    const summary = tagSummary(tagged);
    console.log(formatTagSummary(summary));
    return;
  }

  // default: print all with inline tag annotations
  for (const [key, entry] of Object.entries(tagged)) {
    console.log(formatTagEntry(key, entry));
  }
}

run();
