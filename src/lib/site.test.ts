import { afterEach, expect, test, vi } from 'vitest';
import { CANONICAL_SITE, resolveSite } from './site';

afterEach(() => vi.unstubAllEnvs());

test('local references use the public Portless URL behind its HTTP proxy', () => {
  vi.stubEnv('DEV', true);
  vi.stubEnv('PORTLESS_URL', 'https://design.localhost');
  expect(
    resolveSite({
      url: new URL('http://design.localhost/components/button.md')
    })
  ).toBe('https://design.localhost');
});

test('production references use the configured site', () => {
  vi.stubEnv('DEV', false);
  vi.stubEnv('PORTLESS_URL', 'https://design.localhost');
  expect(resolveSite({ url: new URL('http://localhost:4321') })).toBe(
    CANONICAL_SITE
  );
});
