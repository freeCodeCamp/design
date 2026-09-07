import { expect, test } from 'vitest';
import { renderComponentPage, renderItemPage } from './registry-md';
import {
  componentItem,
  iconsItem,
  readRegistryFile,
  SITE,
  themeItem
} from './registry';

test.each(['button', 'input', 'modal'])(
  '%s Markdown includes complete source, CSS, shared theme, and accurate destinations',
  slug => {
    const meta = { slug, title: slug, summary: 'Example', category: 'form' };
    const page = renderComponentPage(meta);
    const item = componentItem(slug, meta)!;
    for (const file of [...item.files, ...themeItem().files]) {
      expect(page).toContain(file.target);
      expect(page).toContain(readRegistryFile(file).trimEnd());
    }
    expect(page).toContain(`import './ui/${slug}/${slug}.css';`);
    expect(page).toContain(`Preview: ${SITE}/playground#${slug}`);
    expect(page).toContain('Source revision:');
    expect(page).not.toContain('/cdn/');
    expect(page).not.toContain('HTML / vanilla');
  }
);

test('unknown component fails instead of generating incomplete instructions', () => {
  expect(() =>
    renderComponentPage({
      slug: 'missing',
      title: 'Missing',
      summary: '',
      category: ''
    })
  ).toThrow('Missing component source');
});

test('shared item references include their source', () => {
  for (const item of [themeItem(), iconsItem()]) {
    const page = renderItemPage(item);
    for (const file of item.files)
      expect(page).toContain(readRegistryFile(file).trimEnd());
  }
});

test.each([
  ['input', 'form-group/FormGroup.tsx'],
  ['input', 'help-block/HelpBlock.tsx'],
  ['modal', 'button/Button.tsx'],
  ['modal', 'close-button/close-button.css'],
  ['dropdown', 'button/button.css'],
  ['hotspots', 'hotspot-shapes/HotspotShapes.tsx']
])(
  '%s handoff includes the source and CSS needed by its example',
  (slug, target) => {
    const page = renderComponentPage({
      slug,
      title: slug,
      summary: '',
      category: ''
    });
    expect(page).toContain(`### src/ui/${target}`);
  }
);
