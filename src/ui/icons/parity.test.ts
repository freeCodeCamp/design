import { test } from 'vitest';
import assert from 'node:assert/strict';
import { readdirSync } from 'node:fs';
import { resolve, dirname, basename, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { icons } from './icons';

const here = dirname(fileURLToPath(import.meta.url));
const svgDir = resolve(here, 'svg');

const svgNames = readdirSync(svgDir)
  .filter(f => f.endsWith('.svg'))
  .map(f => basename(f, extname(f)))
  .sort();

const iconKeys = Object.keys(icons).sort();

test('svg filenames and icons.ts keys are in lockstep', () => {
  assert.deepEqual(svgNames, iconKeys);
});

test('core nav + feedback icons are present', () => {
  for (const required of [
    'chevron-up',
    'chevron-down',
    'chevron-left',
    'chevron-right',
    'arrow-up',
    'arrow-down',
    'arrow-left',
    'arrow-right',
    'info',
    'circle-alert',
    'triangle-alert',
    'loader',
    'menu',
    'grid',
    'home',
    'settings',
    'plus',
    'minus',
    'equal'
  ]) {
    assert.ok(required in icons, `missing required icon in map: ${required}`);
  }
});
