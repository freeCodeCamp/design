import {
  SITE,
  componentItem,
  nonComponentItems,
  reactSnippet,
  readRegistryFile,
  registryVersion,
  type RegistryItem
} from './registry';

export interface ComponentPageMeta {
  slug: string;
  title: string;
  summary: string;
  category: string;
  a11yPattern?: string;
}

function fence(lang: string, code: string): string {
  return `\`\`\`${lang}\n${code.trimEnd()}\n\`\`\``;
}

function filesSection(item: RegistryItem, site: string): string {
  return item.files
    .map(file =>
      [
        `### ${file.target}`,
        `Source: ${site}${file.url}`,
        fence(file.lang, readRegistryFile(file))
      ].join('\n\n')
    )
    .join('\n\n');
}

function footer(site: string): string {
  return `## Adapting this component\n\nKeep the component's semantics and keyboard behavior. Use the CSS variables to change its appearance. Check the result in your project; copied source does not receive automatic updates.\n\nSource revision: ${registryVersion()}. Component source: BSD-3-Clause. Preserve the license notice: ${site}/license.txt.\n\nDesign rules: ${site}/handbook.md`;
}

export function copyDependencies(
  item: RegistryItem
): Map<string, RegistryItem> {
  const dependencies = nonComponentItems();
  const required = new Map<string, RegistryItem>();
  function collect(name: string): void {
    if (name === item.name || required.has(name)) return;
    const dep =
      dependencies.find(candidate => candidate.name === name) ??
      componentItem(name, { title: name, summary: '', category: '' });
    if (!dep) throw new Error(`Unknown registry dependency: ${name}`);
    required.set(name, dep);
    dep.registryDependencies.forEach(collect);
  }
  item.registryDependencies.forEach(collect);
  const example = reactSnippet(item.name);
  for (const match of (example ?? '').matchAll(/from ['"]\.\/ui\/([^/]+)\//g))
    collect(match[1]!);
  return required;
}

export function copyBundle(item: RegistryItem) {
  const required = [...copyDependencies(item).values()];
  const files = [item, ...required].flatMap(dependency => dependency.files);
  const styles = files.filter(file => file.lang === 'css');
  return {
    required,
    files,
    styles: [
      ...styles.filter(file => file.target.includes('/theme/')),
      ...styles.filter(file => !file.target.includes('/theme/'))
    ],
    packages: [
      ...new Set(
        [item, ...required].flatMap(dependency => dependency.npmDependencies)
      )
    ],
    example: reactSnippet(item.name)
  };
}

export function renderComponentPage(
  meta: ComponentPageMeta,
  site = SITE
): string {
  const item = componentItem(meta.slug, meta);
  if (!item) throw new Error(`Missing component source: ${meta.slug}`);
  const { required, example, packages: npm, styles } = copyBundle(item);
  return [
    `# ${meta.title}`,
    meta.summary,
    `Preview: ${site}/playground#${meta.slug}`,
    '## Add to your project',
    `Use React and TypeScript. Required packages: ${npm.map(dep => `\`${dep}\``).join(', ')}. No freeCodeCamp package is needed.`,
    'Copy the files below to the indicated paths, relative to your project root. If you change the layout, update relative imports too.',
    'Import the CSS once from your application entry. For an entry in src/:',
    fence(
      'ts',
      styles
        .map(file => `import './${file.target.replace(/^src\//, '')}';`)
        .join('\n')
    ),
    `The theme is shared: reuse it if already installed. Fonts use /fonts/ URLs on your host. Download the font files listed in ${site}/registry/starter.md or change those URLs in your copied tokens.css.`,
    ...(example ? ['## Example', fence('tsx', example)] : []),
    ...(meta.a11yPattern
      ? [
          `## Interaction guidance\n\nReview ${meta.a11yPattern} and test keyboard operation in your project.`
        ]
      : []),
    '## Component source',
    filesSection(item, site),
    ...required.map(
      dep => `## Shared source: ${dep.title}\n\n${filesSection(dep, site)}`
    ),
    footer(site),
    ''
  ].join('\n\n');
}

export function renderItemPage(item: RegistryItem, site = SITE): string {
  return [
    `# ${item.title}`,
    item.description,
    `Required packages: ${item.npmDependencies.join(', ') || 'none'}.`,
    `Setup and fonts: ${site}/registry/starter.md`,
    ...item.registryDependencies.map(
      name =>
        `Also copy: ${site}/${componentItem(name, { title: name, summary: '', category: '' }) ? 'components' : 'registry'}/${name}.md`
    ),
    filesSection(item, site),
    footer(site),
    ''
  ].join('\n\n');
}
