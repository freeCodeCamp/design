import { existsSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, posix } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

export const REQUIRED_HOSTING_ARTEFACTS = [
  '_headers',
  'robots.txt',
  'favicon.svg',
  'sitemap-index.xml',
  'sitemap-0.xml'
];
export const REQUIRED_GENERATED_ARTEFACTS = [
  'index.html',
  'handbook/index.html',
  'playground/index.html',
  'handbook.md',
  'llms.txt',
  'registry/index.json',
  'registry/starter.md',
  'registry/theme.md',
  'license.txt'
];

export function findMissingArtefacts(
  dist,
  required = REQUIRED_HOSTING_ARTEFACTS
) {
  return required.filter(
    name =>
      !existsSync(join(dist, name)) || !statSync(join(dist, name)).isFile()
  );
}

export function findRegistryProblems(dist) {
  const problems = [];
  const manifest = JSON.parse(
    readFileSync(join(dist, 'registry/index.json'), 'utf8')
  );
  const llms = readFileSync(join(dist, 'llms.txt'), 'utf8');
  const names = new Set(manifest.items.map(item => item.name));
  const files = manifest.items.flatMap(item => item.files);
  const targets = new Set(files.map(file => file.target));
  for (const item of manifest.items) {
    const docs = new URL(item.docs).pathname;
    if (!existsSync(join(dist, docs)))
      problems.push(`${item.name}: Markdown missing`);
    if (!llms.includes(docs))
      problems.push(`${item.name}: missing from llms.txt`);
    for (const dep of item.registryDependencies)
      if (!names.has(dep))
        problems.push(`${item.name}: unknown dependency ${dep}`);
    for (const file of item.files) {
      const raw = join(dist, new URL(file.url).pathname);
      if (!existsSync(raw)) {
        problems.push(`${item.name}: missing ${file.name}`);
        continue;
      }
      const source = readFileSync(raw, 'utf8');
      if (!source.trim()) problems.push(`${item.name}: empty ${file.name}`);
      if (!/\.tsx?$/.test(file.target)) continue;
      const ast = ts.createSourceFile(
        file.name,
        source,
        ts.ScriptTarget.Latest,
        true
      );
      function visit(node) {
        if (
          (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) &&
          node.moduleSpecifier &&
          ts.isStringLiteral(node.moduleSpecifier)
        ) {
          const spec = node.moduleSpecifier.text;
          if (spec.startsWith('.')) {
            const target = posix.join(posix.dirname(file.target), spec);
            if (
              !['', '.ts', '.tsx', '/index.ts', '/index.tsx'].some(ext =>
                targets.has(target + ext)
              )
            )
              problems.push(`${file.target}: unresolved ${spec}`);
          } else {
            const pkg = spec.startsWith('@')
              ? spec.split('/').slice(0, 2).join('/')
              : spec.split('/')[0];
            if (
              !item.npmDependencies.some(
                dep => dep === pkg || dep.startsWith(pkg + '@')
              )
            )
              problems.push(`${file.target}: undeclared ${pkg}`);
          }
        }
        ts.forEachChild(node, visit);
      }
      visit(ast);
    }
  }
  return problems;
}

function main() {
  const app = join(dirname(fileURLToPath(import.meta.url)), '..');
  const dist = join(app, 'dist');
  const missing = findMissingArtefacts(dist, [
    ...REQUIRED_HOSTING_ARTEFACTS,
    ...REQUIRED_GENERATED_ARTEFACTS
  ]);
  if (missing.length)
    throw new Error(`Missing build files: ${missing.join(', ')}`);
  const manifest = JSON.parse(
    readFileSync(join(dist, 'registry/index.json'), 'utf8')
  );
  const expected = JSON.parse(
    readFileSync(join(app, 'src/data/components.json'), 'utf8')
  )
    .map(component => component.id)
    .sort();
  const actual = manifest.items
    .filter(item => item.kind === 'component')
    .map(item => item.name)
    .sort();
  if (JSON.stringify(expected) !== JSON.stringify(actual))
    throw new Error('Component inventory and registry differ');
  const problems = findRegistryProblems(dist);
  if (problems.length) throw new Error(problems.join('\n'));
  console.log(
    `Verified three pages and ${actual.length} copyable components, including import destinations and external dependencies.`
  );
}

if (process.argv[1] && import.meta.url === `file://${process.argv[1]}`) main();
