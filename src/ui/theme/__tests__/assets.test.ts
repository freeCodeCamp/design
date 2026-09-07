import { existsSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { describe, it, expect } from 'vitest';

const here = dirname(fileURLToPath(import.meta.url));

describe('font assets', () => {
  const fontsDir = resolve(here, '../../../../public/fonts');

  it('ships Lato weights', () => {
    expect(existsSync(resolve(fontsDir, 'Lato-Regular.woff'))).toBe(true);
    expect(existsSync(resolve(fontsDir, 'Lato-Bold.woff'))).toBe(true);
    expect(existsSync(resolve(fontsDir, 'Lato-Light.woff'))).toBe(true);
    expect(existsSync(resolve(fontsDir, 'Lato-Italic.woff'))).toBe(true);
  });

  it('ships Hack monospace weights', () => {
    const files = readdirSync(fontsDir);
    const hackVariants = files.filter(f => f.startsWith('Hack-'));
    expect(hackVariants.length).toBeGreaterThanOrEqual(4);
  });
});

describe('brand assets', () => {
  const brandDir = resolve(here, '../../../../public/brand');

  it('ships canonical fcc logos as SVG', () => {
    for (const name of [
      'fcc-primary.svg',
      'fcc-secondary.svg',
      'fcc-puck.svg'
    ]) {
      const p = resolve(brandDir, name);
      expect(existsSync(p)).toBe(true);
      expect(statSync(p).size).toBeGreaterThan(100);
    }
  });
});
