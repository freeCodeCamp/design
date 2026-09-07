const stripTrailing = (url: string): string => url.replace(/\/+$/, '');

export const CANONICAL_SITE = stripTrailing(
  import.meta.env.SITE ?? 'https://design.freecodecamp.org'
);

export function resolveSite(context: { url: URL }): string {
  return import.meta.env.DEV
    ? stripTrailing(process.env.PORTLESS_URL ?? context.url.origin)
    : CANONICAL_SITE;
}
