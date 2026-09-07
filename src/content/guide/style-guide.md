---
title: Style guide
description: The principles, brand assets, and visual language behind freeCodeCamp. A reference for everyone who builds with us.
---

## Principles

Command-line Chic is freeCodeCamp's design language. It draws from the clarity of a text editor: readable type, distinct states, direct controls, and space for the work.

The interface should help people learn. Give the content a clear order. Make the next action easy to find. Use decoration only when it helps explain something.

- **Start with the content.** Use headings, short paragraphs, and descriptive labels. Keep important instructions visible.
- **Make behavior familiar.** Use links for navigation and buttons for actions. Keep focus visible. Support keyboard input.
- **Use a shared language.** Reuse color, type, and spacing decisions. A new page should feel like part of freeCodeCamp.
- **Leave room to adapt.** Components are reference source. Copy them, then make changes that serve your project.

## Brand

Write our name as **freeCodeCamp**, with a lowercase “free” and capital “C” in “Code” and “Camp”. Use the supplied artwork for the logo. Use plain text when referring to the organization in a sentence.

### Primary logo

Use the full logo when there is enough room. Place the light logo on a dark, quiet background.

![freeCodeCamp primary logo](/brand/fcc-primary.svg)

[Download primary logo (SVG)](/brand/fcc-primary.svg)

### Alternative logo

Use the dark version on a light background.

<img class="brand-light" src="/brand/fcc-secondary.svg" alt="freeCodeCamp dark logo on a light background" />

[Download alternative logo (SVG)](/brand/fcc-secondary.svg)

### Glyph

Use the glyph when the full logo does not fit, such as a small avatar or icon.

![freeCodeCamp glyph](/brand/fcc-puck.svg)

[Download glyph (SVG)](/brand/fcc-puck.svg) · [Download the asset kit (ZIP)](/brand/asset-kit.zip)

### Give the mark space

Keep other text and artwork clear of the logo. The outgoing freeCodeCamp style guide specifies at least 50 px of padding on each side. Keep the original proportions when resizing.

Do not rotate, distort, rearrange, or recolor the artwork. Do not add elements to the logo or place it inside a new shape. Choose a supplied version with enough contrast against its background.

## Color

Our foundation is a family of navy and neutral colors. The light and dark themes use paired values to preserve the visual hierarchy. Use the theme control above to compare them.

<div class="swatches">
<div class="swatch" style="background:#0a0a23;color:#fff">Navy / #0a0a23</div>
<div class="swatch" style="background:#1b1b32;color:#fff">#1b1b32</div>
<div class="swatch" style="background:#2a2a40;color:#fff">#2a2a40</div>
<div class="swatch" style="background:#3b3b4f;color:#fff">#3b3b4f</div>
<div class="swatch" style="background:#ffffff;color:#0a0a23">White / #ffffff</div>
<div class="swatch" style="background:#f5f6f7;color:#0a0a23">#f5f6f7</div>
<div class="swatch" style="background:#dfdfe2;color:#0a0a23">#dfdfe2</div>
<div class="swatch" style="background:#d0d0d5;color:#0a0a23">#d0d0d5</div>
</div>

Use accent colors sparingly. Gold draws attention to a primary action. Blue can identify a link or focus state. Pair status colors with text or an icon so color is not the only signal.

<div class="swatches">
<div class="swatch" style="background:#f1be32;color:#0a0a23">Gold / #f1be32</div>
<div class="swatch" style="background:#99c9ff;color:#0a0a23">Blue / #99c9ff</div>
<div class="swatch" style="background:#dbb8ff;color:#0a0a23">Purple / #dbb8ff</div>
<div class="swatch" style="background:#acd157;color:#0a0a23">Green / #acd157</div>
</div>

### Use roles in your CSS

Components read CSS variables such as `--background-primary`, `--foreground-primary`, and `--cta-background`. Change the values in your copied theme to change the appearance. Keep the names stable so the components continue to share the theme.

Check text, borders, and focus indicators in both themes. A color that works on navy may need a darker counterpart on white.

## Typography

Use **Lato** for headings and reading text. Use **Hack-ZeroSlash** for code, short labels, and technical values. The logo artwork uses its own lettering; do not recreate it with a text element.

<div class="type-specimen">Learning begins with a question.<br />Aa Bb Cc · 0123456789</div>
<div class="type-specimen mono">const curiosity = true;<br />{ a → z } [ 0 → 9 ]</div>

[Download Lato Regular](/fonts/Lato-Regular.woff) · [Download Hack-ZeroSlash Regular](/fonts/Hack-ZeroSlash-Regular.woff2)

Use a clear size difference between the page title, section headings, and body text. Start reading text at 18 px. Smaller labels should remain legible and brief. Keep paragraphs narrow enough to scan, and use comfortable line spacing.

Avoid long passages in uppercase or monospace. Use real text rather than images of text.

## Spacing and layout

Use a 4 px base unit. Our shared spacing scale is 4, 8, 12, 16, 24, 32, 48, and 64 px.

Use small gaps to connect related items, and larger gaps to separate sections. Align content to a common edge. Let layouts become a single column when space is limited.

Prefer square corners and visible borders. Use surface contrast to establish groups before adding decoration. Keep the main content readable at narrow widths and when a user zooms the page.

## Interaction

Give each control a clear label and a visible focus state. Include disabled, selected, error, and loading states when they apply. Show errors near the relevant input and explain how to recover.

For complex controls, use an appropriate interaction primitive and test the result. A dialog needs more than an overlay: check initial focus, keyboard navigation, Escape, and focus return. See the [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/).

Use motion to explain a change. Keep transitions brief and respect `prefers-reduced-motion`. Do not require animation to understand a result.

### Write like a helpful person

Use direct labels: “Save changes”, “Try again”, or “Copy source”. Explain what happened and what the person can do next. Avoid hype, blame, and technical details that do not help the reader.

## Using components

The maintained reference is **React + TypeScript + CSS**. Copy the files into your project; no freeCodeCamp SDK or component package is required. Some interactive components use a third-party dependency. Each component's Markdown reference lists what it needs.

1. Open a component in the [playground](/playground).
2. Expand **Code & usage**. Copy each listed file, including supporting components and CSS. The example shows how to use the component; it is separate from the implementation.
3. Add the shared theme once. Copy [tokens.css](/registry/theme/tokens.css) and [base.css](/registry/theme/base.css) to `src/ui/theme/`.
4. Import the theme first, then the component CSS. For an entry file in `src/`:

```ts
import './ui/theme/tokens.css';
import './ui/theme/base.css';
import './ui/button/button.css';
```

The font URLs in `tokens.css` resolve against your own host. Download the required font files to `public/fonts/`, or adjust the font declarations to use fonts already in your project. The [setup reference](/registry/starter.md) lists the files.

The default theme is dark. Add `light-palette` to the root element for the light theme. Components share the CSS variables; you do not need a theme provider.

### Working with an agent

Choose **Copy as Markdown** on a component. It includes the reference source, shared theme, example, file destinations, and dependency information. Paste it into your agent with your task.

For an agent that can read URLs, start with [llms.txt](/llms.txt). It links to focused component documents. Ask the agent to preserve semantics and keyboard behavior, use the existing project conventions, and check its changes.

You own the copied files. They do not update automatically. Keep the source revision and license information when you copy, and review upstream changes when needed. See the [source license](/license.txt).
