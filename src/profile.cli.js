#!/usr/bin/env node
// profile.cli.js — CLI for profile management

import fs from 'fs';
import { createProfile, applyProfile, diffProfiles, listProfiles, serializeProfile, parseProfile } from './profile.js';
import { formatProfileList, formatProfileDiff, formatApplyResult } from './formatProfile.js';

function getArg(args, flag) {
  const idx = args.indexOf(flag);
  return idx !== -1 ? args[idx + 1] : null;
}

export async function run(argv = process.argv.slice(2)) {
  const command = argv[0];

  if (command === 'list') {
    const dir = getArg(argv, '--dir') || '.';
    const files = fs.readdirSync(dir).filter(f => f.startsWith('.env.') && !f.endsWith('.example'));
    const profileMap = {};
    for (const file of files) {
      const name = file.replace('.env.', '');
      const text = fs.readFileSync(`${dir}/${file}`, 'utf8');
      profileMap[name] = parseProfile(name, text);
    }
    process.stdout.write(formatProfileList(listProfiles(profileMap)));
    return;
  }

  if (command === 'diff') {
    const fileA = getArg(argv, '--from');
    const fileB = getArg(argv, '--to');
    if (!fileA || !fileB) {
      process.stderr.write('Usage: profile diff --from <file> --to <file>\n');
      process.exit(1);
    }
    const nameA = fileA.replace(/.*\.env\.?/, '') || 'a';
    const nameB = fileB.replace(/.*\.env\.?/, '') || 'b';
    const pA = parseProfile(nameA, fs.readFileSync(fileA, 'utf8'));
    const pB = parseProfile(nameB, fs.readFileSync(fileB, 'utf8'));
    process.stdout.write(formatProfileDiff(pA, pB));
    return;
  }

  if (command === 'apply') {
    const baseFile = getArg(argv, '--base');
    const profileFile = getArg(argv, '--profile');
    const out = getArg(argv, '--out');
    if (!baseFile || !profileFile) {
      process.stderr.write('Usage: profile apply --base <file> --profile <file> [--out <file>]\n');
      process.exit(1);
    }
    const profileName = profileFile.replace(/.*\.env\.?/, '') || 'profile';
    const base = parseProfile('base', fs.readFileSync(baseFile, 'utf8')).vars;
    const profile = parseProfile(profileName, fs.readFileSync(profileFile, 'utf8'));
    const result = applyProfile(base, profile);
    const serialized = Object.entries(result).map(([k, v]) => `${k}=${v}`).join('\n') + '\n';
    if (out) {
      fs.writeFileSync(out, serialized);
      process.stdout.write(formatApplyResult(profileName, base, result));
    } else {
      process.stdout.write(serialized);
    }
    return;
  }

  process.stderr.write('Commands: list, diff, apply\n');
  process.exit(1);
}

if (process.argv[1] && process.argv[1].endsWith('profile.cli.js')) {
  run();
}
