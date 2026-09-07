import { describe, expect, test } from 'vitest';
import { existsSync } from 'node:fs';
import { posix } from 'node:path';
import { componentItem, nonComponentItems, readRegistryFile } from './registry';

const component = (name: string) =>
  componentItem(name, { title: name, summary: name, category: 'form' })!;

describe('copyable registry', () => {
  test('publishes React source without unused distribution targets', () => {
    expect(nonComponentItems().map(item => item.name)).not.toEqual(
      expect.arrayContaining(['vanilla'])
    );
    expect(nonComponentItems().map(item => item.name)).not.toContain(
      'tailwind'
    );
  });

  test('shared hook imports resolve at the advertised copy destinations', () => {
    const items = [component('combobox'), ...nonComponentItems()];
    const files = items.flatMap(item => item.files);
    const targets = new Set(files.map(file => file.target));
    const hook = files.find(file => file.name === 'useAsyncComboboxItems.ts')!;
    const spec = readRegistryFile(hook).match(
      /from ['"](\.\/Combobox)['"]/
    )![1]!;
    const target = posix.join(posix.dirname(hook.target), spec) + '.tsx';
    expect(targets.has(target), target).toBe(true);
  });

  test.each(['button', 'input', 'modal'])(
    '%s has complete source and styling with declared external dependencies',
    slug => {
      const item = component(slug);
      expect(item.files.some(file => file.name.endsWith('.tsx'))).toBe(true);
      expect(item.files.some(file => file.name.endsWith('.css'))).toBe(true);
      for (const file of item.files)
        expect(existsSync(file.absPath)).toBe(true);
      expect(item.registryDependencies).toContain('theme');
      if (slug === 'modal')
        expect(
          item.npmDependencies.some(dep => dep.startsWith('@ark-ui/react@'))
        ).toBe(true);
    }
  );
});
