import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  findMissingArtefacts,
  REQUIRED_GENERATED_ARTEFACTS,
  REQUIRED_HOSTING_ARTEFACTS
} from '../../scripts/verify-dist.mjs';

const DOCS_ROOT = join(__dirname, '..', '..');
const PUBLIC_ROOT = join(DOCS_ROOT, 'public');

function parseHeadersFile(
  input: string
): Record<string, Record<string, string>> {
  const blocks: Record<string, Record<string, string>> = {};
  let current: string | null = null;
  for (const rawLine of input.split('\n')) {
    const line = rawLine.replace(/\r$/, '');
    if (line.trim() === '' || line.trim().startsWith('#')) {
      if (line.trim() === '') current = null;
      continue;
    }
    const isIndented = /^\s/.test(line);
    if (!isIndented) {
      current = line.trim();
      blocks[current] ??= {};
      continue;
    }
    if (current === null) continue;
    const trimmed = line.trim();
    const colon = trimmed.indexOf(':');
    if (colon === -1) continue;
    const name = trimmed.slice(0, colon).trim();
    const value = trimmed.slice(colon + 1).trim();
    blocks[current]![name] = value;
  }
  return blocks;
}

describe('public/_headers - Cloudflare Workers headers', () => {
  const raw = readFileSync(join(PUBLIC_ROOT, '_headers'), 'utf8');
  const blocks = parseHeadersFile(raw);

  describe('global security headers under `/*`', () => {
    const globals = blocks['/*'] ?? {};

    it('block exists', () => {
      expect(blocks['/*'], 'no `/*` block in _headers').toBeDefined();
    });

    it('declares HSTS with includeSubDomains + preload', () => {
      expect(globals['Strict-Transport-Security']).toMatch(
        /max-age=\d+;\s*includeSubDomains;\s*preload/
      );
    });

    it('disables MIME sniffing', () => {
      expect(globals['X-Content-Type-Options']).toBe('nosniff');
    });

    it('denies framing (clickjacking guard)', () => {
      expect(globals['X-Frame-Options']).toBe('DENY');
    });

    it('sets a strict referrer policy', () => {
      expect(globals['Referrer-Policy']).toBe(
        'strict-origin-when-cross-origin'
      );
    });

    it('opts out of the obvious Permissions-Policy features', () => {
      const policy = globals['Permissions-Policy'] ?? '';
      const requiredOptOut = [
        'accelerometer',
        'camera',
        'geolocation',
        'gyroscope',
        'microphone',
        'payment',
        'usb',
        'interest-cohort'
      ];
      for (const feature of requiredOptOut) {
        expect(policy, `Permissions-Policy missing ${feature}=()`).toMatch(
          new RegExp(`${feature}=\\(\\)`)
        );
      }
    });

    it('sets the report-only content security policy', () => {
      const csp = globals['Content-Security-Policy-Report-Only'];
      expect(csp, 'CSP-Report-Only header missing').toBeTruthy();
      expect(globals['Content-Security-Policy']).toBeUndefined();
      // Sanity-check the directive baseline.
      for (const directive of [
        "default-src 'self'",
        "script-src 'self'",
        "frame-ancestors 'none'",
        "base-uri 'self'",
        "form-action 'self'",
        "object-src 'none'"
      ]) {
        expect(csp).toContain(directive);
      }
    });
  });

  it('serves copied TypeScript as plain text', () => {
    for (const pattern of ['/registry/*.ts', '/registry/*.tsx']) {
      expect(blocks[pattern]?.['Content-Type']).toBe(
        'text/plain; charset=utf-8'
      );
    }
  });

  describe('cache rules', () => {
    it('immutable-caches Astro hashed assets for one year', () => {
      expect(blocks['/_astro/*']?.['Cache-Control']).toBe(
        'public, max-age=31536000, immutable'
      );
    });

    it('caches brand files for one day', () => {
      expect(blocks['/brand/*']?.['Cache-Control']).toBe(
        'public, max-age=86400'
      );
    });
  });

  describe('preview-URL hardening', () => {
    it('keeps Workers previews out of search engines', () => {
      expect(
        blocks['https://:version.:project.workers.dev/*']?.['X-Robots-Tag']
      ).toBe('noindex');
    });
  });
});

describe('public/robots.txt - crawler directives', () => {
  const raw = readFileSync(join(PUBLIC_ROOT, 'robots.txt'), 'utf8');

  it('declares a wildcard User-agent rule', () => {
    expect(raw).toMatch(/^User-agent:\s*\*\s*$/m);
  });

  it('points crawlers at the absolute sitemap URL', () => {
    // Sitemap directive must be absolute per https://www.rfc-editor.org/rfc/rfc9309#name-sitemap
    expect(raw).toMatch(
      /^Sitemap:\s*https:\/\/design\.freecodecamp\.org\/sitemap-index\.xml\s*$/m
    );
  });
});

describe('verify-dist.mjs - post-build gate', () => {
  it('declares the canonical Cloudflare Workers artefact list', () => {
    // Order is documentation-only, but presence locks the contract.
    expect([...REQUIRED_HOSTING_ARTEFACTS].sort()).toEqual([
      '_headers',
      'favicon.svg',
      'robots.txt',
      'sitemap-0.xml',
      'sitemap-index.xml'
    ]);
  });

  it('declares the build-generated registry artefact list', () => {
    // These come from prerendered endpoints, not public/, so they live in
    // their own list - the public/ source-of-truth check must skip them.
    expect([...REQUIRED_GENERATED_ARTEFACTS].sort()).toEqual([
      'handbook.md',
      'handbook/index.html',
      'index.html',
      'license.txt',
      'llms.txt',
      'playground/index.html',
      'registry/index.json',
      'registry/starter.md',
      'registry/theme.md'
    ]);
  });

  it('reports every artefact as missing when the dist dir is empty', () => {
    const tmp = mkdtempSync(join(tmpdir(), 'fcc-pages-empty-'));
    expect(findMissingArtefacts(tmp)).toEqual([...REQUIRED_HOSTING_ARTEFACTS]);
  });

  it('reports zero missing when every artefact exists', () => {
    const tmp = mkdtempSync(join(tmpdir(), 'fcc-pages-full-'));
    for (const name of REQUIRED_HOSTING_ARTEFACTS) {
      writeFileSync(join(tmp, name), '');
    }
    expect(findMissingArtefacts(tmp)).toEqual([]);
  });

  it('reports the gap when a single artefact is absent', () => {
    const tmp = mkdtempSync(join(tmpdir(), 'fcc-pages-gap-'));
    for (const name of REQUIRED_HOSTING_ARTEFACTS) {
      if (name === '_headers') continue;
      writeFileSync(join(tmp, name), '');
    }
    expect(findMissingArtefacts(tmp)).toEqual(['_headers']);
  });

  it('agrees that every artefact already lives under public/ at source', () => {
    // This is the source-of-truth half of the contract: build copies
    // public/ verbatim. If anything goes missing here, the post-build
    // CLI gate also fails.
    const sourceMissing = findMissingArtefacts(PUBLIC_ROOT).filter(
      // Sitemap files are emitted by `@astrojs/sitemap` at build time, not
      // tracked in `public/`; skip them in the source-of-truth check.
      name => !name.startsWith('sitemap')
    );
    expect(sourceMissing).toEqual([]);
  });
});
