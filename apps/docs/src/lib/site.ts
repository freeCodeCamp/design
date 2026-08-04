/**
 * Canonical site origin for the absolute URLs emitted in agent-facing content
 * (llms.txt, llms-full.txt, registry .md pages, index.json).
 *
 * Resolution order:
 *   1. PUBLIC_SITE env var - wins everywhere (preview deploys, CI, staging).
 *   2. Dev server (`astro dev`) - the actual request origin, so an agent
 *      reading local output curls http://localhost:4321, NOT the prod host.
 *   3. Build / prod - the `site` configured in astro.config.mjs.
 *
 * Keeping astro.config's `site` as the single source of truth for the prod URL
 * means there is no hard-coded host to drift.
 */

const stripTrailing = (u: string): string => u.replace(/\/+$/, '');

/** The configured production origin (astro.config.mjs `site`). */
export const CANONICAL_SITE = stripTrailing(
  import.meta.env.SITE ?? 'https://design.freecodecamp.org'
);

/**
 * Resolve the base origin for an Astro endpoint request. Pass the endpoint's
 * APIContext (or anything with a `url`); in dev this reflects the live host.
 */
export function resolveSite(context: { url: URL }): string {
  const override = import.meta.env.PUBLIC_SITE;
  if (override) return stripTrailing(override);
  if (import.meta.env.DEV) return stripTrailing(context.url.origin);
  return CANONICAL_SITE;
}

/**
 * Same resolution as resolveSite, but host only (no scheme) - for the bare
 * `design.freecodecamp.org/...` snippets shown in the human-facing pages.
 */
export function resolveHost(context: { url: URL }): string {
  return new URL(resolveSite(context)).host;
}
