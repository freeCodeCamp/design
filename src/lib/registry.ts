import { execSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import ts from 'typescript';
import components from '../data/components.json';
import consumerDependencies from '../data/consumer-dependencies.json';

const repoRoot = process.cwd();
const appRoot = repoRoot;
const uikitSrc = resolve(repoRoot, 'src/ui');
const cssSrc = resolve(uikitSrc, 'theme');
const iconsSrc = resolve(uikitSrc, 'icons');

export { CANONICAL_SITE as SITE } from './site';

export interface RegistryFile {
  name: string;
  absPath: string;
  url: string;
  target: string;
  lang: string;
}

export interface RegistryItem {
  name: string;
  kind: 'component' | 'lib' | 'theme' | 'icons';
  title: string;
  description: string;
  category?: string;
  npmDependencies: string[];
  registryDependencies: string[];
  files: RegistryFile[];
  docsPath: string;
}

function pascal(slug: string): string {
  return slug
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

function peer(name: string): string {
  const range = consumerDependencies[name as keyof typeof consumerDependencies];
  return range ? `${name}@${range}` : name;
}

function packageOf(specifier: string): string {
  const parts = specifier.split('/');
  return specifier.startsWith('@') ? parts.slice(0, 2).join('/') : parts[0]!;
}

function scanImports(absPath: string): {
  npm: Set<string>;
  registry: Set<string>;
} {
  const src = readFileSync(absPath, 'utf8');
  const npm = new Set<string>();
  const registry = new Set<string>();
  const importRe = /import\s[^'"]*['"]([^'"]+)['"]/g;
  let m: RegExpExecArray | null;
  while ((m = importRe.exec(src)) !== null) {
    const spec = m[1]!;
    if (spec.startsWith('.')) {
      const base = spec.split('/').pop() ?? '';
      const kebab = base
        .replace(/\.(tsx?|css)$/, '')
        .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
        .toLowerCase();
      if (kebab && !spec.endsWith('.css')) registry.add(kebab);
      continue;
    }
    const pkg = packageOf(spec);
    if (pkg === 'react' || pkg === 'react-dom') continue;
    npm.add(pkg);
  }
  return { npm, registry };
}

function componentSource(slug: string): {
  absPath: string;
  fileName: string;
} | null {
  const fileName = `${pascal(slug)}.tsx`;
  const absPath = resolve(uikitSrc, slug, fileName);
  return existsSync(absPath) ? { absPath, fileName } : null;
}

function componentFiles(slug: string): RegistryFile[] {
  const source = componentSource(slug);
  if (!source) return [];
  const files: RegistryFile[] = [
    {
      name: source.fileName,
      absPath: source.absPath,
      url: `/registry/${slug}/${source.fileName}`,
      target: `src/ui/${slug}/${source.fileName}`,
      lang: 'tsx'
    }
  ];
  const cssPath = resolve(uikitSrc, slug, `${slug}.css`);
  if (existsSync(cssPath)) {
    files.push({
      name: `${slug}.css`,
      absPath: cssPath,
      url: `/registry/${slug}/${slug}.css`,
      target: `src/ui/${slug}/${slug}.css`,
      lang: 'css'
    });
  }
  return files;
}

const styleDependencies: Record<string, string[]> = {
  'form-control': ['input'],
  dropdown: ['button'],
  modal: ['close-button'],
  'data-table': ['skeleton']
};

export function componentItem(
  slug: string,
  meta: { title: string; summary: string; category: string }
): RegistryItem | null {
  const files = componentFiles(slug);
  if (!files.length) return null;
  const npm = new Set<string>([peer('react')]);
  const registry = new Set<string>([
    'theme',
    ...(styleDependencies[slug] ?? [])
  ]);
  for (const file of files) {
    if (file.lang !== 'tsx') continue;
    const scanned = scanImports(file.absPath);
    for (const pkg of scanned.npm) npm.add(peer(pkg));
    for (const dep of scanned.registry) registry.add(dep);
  }
  return {
    name: slug,
    kind: 'component',
    title: meta.title,
    description: meta.summary,
    category: meta.category,
    npmDependencies: [...npm],
    registryDependencies: [...registry],
    files,
    docsPath: `/components/${slug}.md`
  };
}

function libItem(
  name: string,
  title: string,
  description: string,
  absPath: string,
  fileName: string
): RegistryItem {
  const scanned = scanImports(absPath);
  const registry = new Set<string>(scanned.registry);
  registry.delete(name);
  if (name === 'hotspot-shapes') registry.add('hotspots');
  return {
    name,
    kind: 'lib',
    title,
    description,
    npmDependencies: [peer('react'), ...[...scanned.npm].map(peer)],
    registryDependencies: [...registry],
    files: [
      {
        name: fileName,
        absPath,
        url: `/registry/${name}/${fileName}`,
        target: `src/ui/${name === 'use-async-combobox-items' ? 'combobox' : name}/${fileName}`,
        lang: fileName.endsWith('.tsx') ? 'tsx' : 'ts'
      }
    ],
    docsPath: `/registry/${name}.md`
  };
}

function file(
  item: string,
  absPath: string,
  target: string,
  lang: string
): RegistryFile {
  const name = absPath.split('/').pop()!;
  return { name, absPath, url: `/registry/${item}/${name}`, target, lang };
}

export function themeItem(): RegistryItem {
  return {
    name: 'theme',
    kind: 'theme',
    title: 'Theme',
    description:
      'Design tokens (colors, type, spacing, motion) + shared base helpers. Every component depends on this. Dark by default; add .light-palette to opt into light mode.',
    npmDependencies: [],
    registryDependencies: [],
    files: [
      file(
        'theme',
        resolve(cssSrc, 'tokens.css'),
        'src/ui/theme/tokens.css',
        'css'
      ),
      file('theme', resolve(cssSrc, 'base.css'), 'src/ui/theme/base.css', 'css')
    ],
    docsPath: '/registry/theme.md'
  };
}

export function iconsItem(): RegistryItem {
  return {
    name: 'icons',
    kind: 'icons',
    title: 'Icons',
    description:
      'Curated Lucide subset: Icon React component + icon map. Copy Icon.tsx and a subset of icons.ts, or grab raw SVGs per icon.',
    npmDependencies: [peer('react')],
    registryDependencies: [],
    files: [
      file(
        'icons',
        resolve(iconsSrc, 'react.tsx'),
        'src/ui/icons/Icon.tsx',
        'tsx'
      ),
      file(
        'icons',
        resolve(iconsSrc, 'icons.ts'),
        'src/ui/icons/icons.ts',
        'ts'
      )
    ],
    docsPath: '/registry/icons.md'
  };
}

export function iconSvgNames(): string[] {
  return readdirSync(resolve(iconsSrc, 'svg'))
    .filter(f => f.endsWith('.svg'))
    .map(f => f.replace(/\.svg$/, ''))
    .sort();
}

export function iconSvgFile(name: string): RegistryFile {
  return file(
    'icons',
    resolve(iconsSrc, 'svg', `${name}.svg`),
    `src/ui/icons/svg/${name}.svg`,
    'svg'
  );
}

export function sharedLibItems(): RegistryItem[] {
  return [
    libItem(
      'use-async-combobox-items',
      'useAsyncComboboxItems',
      'Debounced + cancellable async item loading for the Combobox component.',
      resolve(uikitSrc, 'combobox', 'useAsyncComboboxItems.ts'),
      'useAsyncComboboxItems.ts'
    ),
    libItem(
      'hotspot-shapes',
      'HotspotShapes',
      'Shape helpers (rect, circle, polygon) for the Hotspots game component.',
      resolve(uikitSrc, 'hotspot-shapes', 'HotspotShapes.tsx'),
      'HotspotShapes.tsx'
    )
  ];
}

export function nonComponentItems(): RegistryItem[] {
  return [themeItem(), iconsItem(), ...sharedLibItems()];
}

let copyTargets: Map<string, string> | undefined;

export function reactSnippet(slug: string): string | null {
  const path = resolve(uikitSrc, slug, 'example.tsx');
  if (!existsSync(path)) return null;
  copyTargets ??= new Map(
    [
      ...components.flatMap(component => componentFiles(component.id)),
      ...nonComponentItems().flatMap(item => item.files)
    ].map(file => [
      file.absPath.replace(/\.tsx?$/, ''),
      `./${file.target.replace(/^src\//, '').replace(/\.tsx?$/, '')}`
    ])
  );
  let source = readFileSync(path, 'utf8');
  const ast = ts.createSourceFile(path, source, ts.ScriptTarget.Latest, true);
  for (const node of [...ast.statements].reverse()) {
    if (
      !ts.isImportDeclaration(node) ||
      !ts.isStringLiteral(node.moduleSpecifier)
    )
      continue;
    const specifier = node.moduleSpecifier;
    if (!specifier.text.startsWith('.')) continue;
    const target = copyTargets.get(
      resolve(dirname(path), specifier.text).replace(/\.tsx?$/, '')
    );
    if (!target)
      throw new Error(`Unknown example import: ${slug}: ${specifier.text}`);
    source =
      source.slice(0, specifier.getStart(ast) + 1) +
      target +
      source.slice(specifier.end - 1);
  }
  return source;
}

let versionCache: string | null = null;
export function registryVersion(): string {
  if (versionCache) return versionCache;
  try {
    const sha = execSync('git rev-parse --short HEAD', {
      cwd: repoRoot,
      encoding: 'utf8'
    }).trim();
    const date = execSync('git show -s --format=%cs HEAD', {
      cwd: repoRoot,
      encoding: 'utf8'
    }).trim();
    versionCache = `${sha} (${date})`;
  } catch {
    versionCache = 'unknown';
  }
  return versionCache;
}

export function readRegistryFile(f: RegistryFile): string {
  return readFileSync(f.absPath, 'utf8');
}

export function publicFontNames(): string[] {
  return readdirSync(resolve(appRoot, 'public', 'fonts'))
    .filter(f => /\.woff2?$/.test(f))
    .sort();
}
