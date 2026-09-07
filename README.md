# freeCodeCamp Design

**Command-line Chic** is the freeCodeCamp design system. The website has an overview, a style guide, and a component playground at [design.freecodecamp.org](https://design.freecodecamp.org).

## Run locally

Use Node.js 24 or later and pnpm. From a clone of this repository:

```sh
pnpm install
pnpm dev
```

Open the URL printed by Portless (normally <https://design.localhost>). No environment file, account, or package build is required. Portless is installed with the project. On first use, it can ask for permission to set up local HTTPS.

## Copy a component

Open the playground and expand **Code & usage** to copy React source and CSS. Use **Copy as Markdown** for the complete reference, including shared source and setup instructions.

There is no freeCodeCamp package to install. Components use React and ordinary CSS. Some interactive components declare a third-party dependency. Copied files belong to the consuming project and do not update automatically.

For agents, start at [llms.txt](https://design.freecodecamp.org/llms.txt).

## Check a change

```sh
pnpm test
pnpm typecheck
pnpm lint
pnpm format:check
pnpm build
```

`pnpm build` creates the static site in `dist` and verifies the component registry. Use `pnpm preview` to inspect that build.

## Source layout

- `src/pages`: overview, style guide, playground, and text endpoints.
- `src/content/guide/style-guide.md`: the style guide and its Markdown reference.
- `src/data/components.json`: component names, descriptions, and categories.
- `src/data/consumer-dependencies.json`: dependency ranges for copied source.
- `src/ui/<component>`: source, CSS, tests, executable example, and Astro preview.
- `src/ui/theme`: shared theme and base styles.
- `src/ui/icons`: React icons and SVG files.
- `public/brand` and `public/fonts`: static assets.

This is one private application. It has no npm release or workspace packages.

To change a component, edit its folder and catalog entry. Import component source directly in examples; the registry converts these imports to copy destinations. Check the preview and the copied result in both themes, including keyboard use. Tests also compile the copied examples. Compilation does not verify appearance or accessibility.

Use `pnpm format` to format changes and `pnpm test:coverage` to check coverage. The pre-commit hook runs lint-staged. Use Conventional Commits.

Use `pnpm preview:cf` after a build to check Cloudflare asset serving locally. The static hosting configuration is `wrangler.jsonc`. The operator handles uploads and deployment. Local development needs no hosting account.

Read the [Code of Conduct](./CODE_OF_CONDUCT.md). Report security issues through [SECURITY.md](./SECURITY.md).

Source code is licensed under [BSD-3-Clause](./LICENSE.md). Documentation is licensed under [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/).
