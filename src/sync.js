// Sync command — watch a live site and auto-update local tokens when design changes

import { extractDesignLanguage } from './index.js';
import { formatTokens } from './formatters/tokens.js';
import { formatTailwind } from './formatters/tailwind.js';
import { formatCssVars } from './formatters/css-vars.js';
import { saveSnapshot, getHistory } from './history.js';
import { openSync, writeSync, ftruncateSync, closeSync } from 'fs';
import { join } from 'path';


// Rewrite a file ONLY if it already exists, without a check-then-write race:
// opening with 'r+' fails atomically with ENOENT when the file is absent.
function updateIfPresent(path, content) {
  let fd;
  try {
    fd = openSync(path, 'r+');
  } catch {
    return false;
  }
  try {
    ftruncateSync(fd, 0);
    writeSync(fd, content, 0, 'utf-8');
    return true;
  } finally {
    closeSync(fd);
  }
}

export async function syncDesign(url, options = {}) {
  const { out = '.' } = options;

  const current = await extractDesignLanguage(url, options);
  const history = getHistory(url);
  const previous = history.length > 1 ? history[history.length - 2] : null;

  const changes = [];

  if (previous) {
    // Detect changes
    if (previous.colors.primary !== current.colors.primary?.hex) {
      changes.push({ type: 'color', property: 'primary', from: previous.colors.primary, to: current.colors.primary?.hex });
    }
    if (previous.colors.secondary !== current.colors.secondary?.hex) {
      changes.push({ type: 'color', property: 'secondary', from: previous.colors.secondary, to: current.colors.secondary?.hex });
    }
    if (previous.typography.families.join(',') !== current.typography.families.map(f => f.name).join(',')) {
      changes.push({ type: 'typography', property: 'fonts', from: previous.typography.families.join(', '), to: current.typography.families.map(f => f.name).join(', ') });
    }
    if (previous.colors.count !== current.colors.all.length) {
      changes.push({ type: 'color', property: 'count', from: String(previous.colors.count), to: String(current.colors.all.length) });
    }
    if (previous.a11yScore !== current.accessibility?.score) {
      changes.push({ type: 'accessibility', property: 'score', from: `${previous.a11yScore}%`, to: `${current.accessibility?.score}%` });
    }
  }

  // Save snapshot
  saveSnapshot(current);

  // Update local files
  const updates = [];

  const tokensPath = join(out, 'design-tokens.json');
  if (updateIfPresent(tokensPath, formatTokens(current))) {
    updates.push('design-tokens.json');
  }

  const tailwindPath = join(out, 'tailwind.config.js');
  if (updateIfPresent(tailwindPath, formatTailwind(current))) {
    updates.push('tailwind.config.js');
  }

  const cssPath = join(out, 'variables.css');
  if (updateIfPresent(cssPath, formatCssVars(current))) {
    updates.push('variables.css');
  }

  return {
    changes,
    updatedFiles: updates,
    isFirstRun: !previous,
    design: current,
  };
}
