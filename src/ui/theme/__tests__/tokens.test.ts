import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { describe, it, expect } from 'vitest';

const here = dirname(fileURLToPath(import.meta.url));
const tokens = readFileSync(resolve(here, '../tokens.css'), 'utf8');

describe('tokens.css', () => {
  it('declares the brand grayscale ramp', () => {
    for (const name of [
      '--gray-00',
      '--gray-05',
      '--gray-10',
      '--gray-45',
      '--gray-75',
      '--gray-85',
      '--gray-90'
    ]) {
      expect(tokens).toMatch(new RegExp(`${name}:\\s*#`));
    }
  });

  it('declares the brand purple, blue, green, red, yellow', () => {
    for (const name of [
      '--purple-mid',
      '--blue-mid',
      '--green-light',
      '--red-light',
      '--yellow-gold'
    ]) {
      expect(tokens).toMatch(new RegExp(`${name}:`));
    }
  });

  it('declares @font-face for Lato + Hack', () => {
    expect(tokens).toMatch(/@font-face[\s\S]+?font-family:\s*'Lato'/);
    expect(tokens).toMatch(/@font-face[\s\S]+?font-family:\s*'Hack-ZeroSlash'/);
  });
});
