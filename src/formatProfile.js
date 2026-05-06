// formatProfile.js — human-readable output for profile operations

import { diffProfiles } from './profile.js';

const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';
const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const CYAN = '\x1b[36m';
const DIM = '\x1b[2m';

export function formatProfileList(profiles) {
  if (!profiles.length) return 'No profiles defined.\n';
  const lines = [`${BOLD}Profiles:${RESET}`];
  for (const p of profiles) {
    const desc = p.description ? ` ${DIM}— ${p.description}${RESET}` : '';
    lines.push(`  ${CYAN}${p.name}${RESET}${desc} (${p.varCount} vars)`);
  }
  return lines.join('\n') + '\n';
}

export function formatProfileDiff(profileA, profileB) {
  const changes = diffProfiles(profileA, profileB);
  if (!changes.length) {
    return `${DIM}No differences between "${profileA.name}" and "${profileB.name}".${RESET}\n`;
  }
  const lines = [
    `${BOLD}Diff: ${profileA.name} → ${profileB.name}${RESET}`,
  ];
  for (const { key, from, to } of changes) {
    if (from === null) {
      lines.push(`  ${GREEN}+ ${key}=${to}${RESET}`);
    } else if (to === null) {
      lines.push(`  ${RED}- ${key}=${from}${RESET}`);
    } else {
      lines.push(`  ${RED}- ${key}=${from}${RESET}`);
      lines.push(`  ${GREEN}+ ${key}=${to}${RESET}`);
    }
  }
  return lines.join('\n') + '\n';
}

export function formatApplyResult(profileName, base, result) {
  const addedKeys = Object.keys(result).filter(k => !(k in base));
  const changedKeys = Object.keys(result).filter(k => k in base && result[k] !== base[k]);
  const lines = [
    `${BOLD}Applied profile "${profileName}":${RESET}`,
    `  ${GREEN}${changedKeys.length} overridden${RESET}, ${GREEN}${addedKeys.length} added${RESET}`,
  ];
  return lines.join('\n') + '\n';
}
