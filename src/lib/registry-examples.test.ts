import { test, expect } from 'vitest';
import {
  mkdtempSync,
  mkdirSync,
  rmSync,
  symlinkSync,
  writeFileSync
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import ts from 'typescript';
import { renderComponentPage } from './registry-md';
import components from '../data/components.json';

test('copied examples and source compile without a freeCodeCamp package', () => {
  const root = mkdtempSync(join(tmpdir(), 'design-copy-test-'));
  try {
    symlinkSync(
      resolve('node_modules'),
      join(root, 'node_modules'),
      'junction'
    );
    const files = new Map<string, string>();
    for (const { id: slug } of components) {
      const page = renderComponentPage({
        slug,
        title: slug,
        summary: '',
        category: ''
      });
      const local = new Map<string, string>();
      for (const match of page.matchAll(
        /### (src\/[^\n]+)\n\nSource:[^\n]+\n\n```\w+\n([\s\S]*?)\n```/g
      ))
        local.set(match[1]!, match[2]!);
      const example = page.match(/## Example\n\n```tsx\n([\s\S]*?)\n```/);
      expect(example, slug).not.toBeNull();
      local.set(`src/example-${slug}.tsx`, example![1]!);
      for (const [file, content] of local) {
        for (const match of content.matchAll(/from ['"](\.[^'"]+)['"]/g)) {
          const target = join(dirname(file), match[1]!);
          expect(
            ['', '.ts', '.tsx', '.css'].some(extension =>
              local.has(target + extension)
            ),
            `${slug}: ${file} imports ${match[1]}`
          ).toBe(true);
        }
        files.set(file, content);
      }
    }
    for (const [file, content] of files) {
      const target = join(root, file);
      mkdirSync(dirname(target), { recursive: true });
      writeFileSync(target, content);
    }
    const program = ts.createProgram(
      [...files.keys()]
        .filter(file => /\.tsx?$/.test(file))
        .map(file => join(root, file)),
      {
        strict: true,
        noEmit: true,
        jsx: ts.JsxEmit.ReactJSX,
        target: ts.ScriptTarget.ES2022,
        module: ts.ModuleKind.ESNext,
        moduleResolution: ts.ModuleResolutionKind.Bundler,
        esModuleInterop: true,
        skipLibCheck: true,
        types: ['react'],
        typeRoots: [resolve('node_modules/@types')]
      }
    );
    const errors = ts.getPreEmitDiagnostics(program);
    expect(
      errors.map(error =>
        ts.flattenDiagnosticMessageText(error.messageText, '\n')
      )
    ).toEqual([]);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}, 15000);
