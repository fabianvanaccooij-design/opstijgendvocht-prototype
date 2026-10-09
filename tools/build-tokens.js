/**
 * Zet de Figma-export (tools/figma-tokens.json) om naar src/assets/css/tokens.css.
 * Gebruik: node tools/build-tokens.js
 *
 * - Primitives worden --color-blue-500, --space-24 enz.
 * - Tokens en Typography (modes Desktop/Mobile) worden semantische variabelen
 *   die naar de primitives verwijzen. Desktop staat op :root, Mobile onder 768 px.
 * - Tussen 768 en 1199 px (tablet / kleine laptop) gelden de overrides uit TABLET.
 */
const fs = require('fs');
const path = require('path');

const src = JSON.parse(fs.readFileSync(path.join(__dirname, 'figma-tokens.json'), 'utf8'));
const MOBILE_MAX = 767;
const TABLET_MAX = 1199;

// Eigen keuze (geen Figma-mode): tussenwaarden voor tablet en kleine laptops.
const TABLET = {
  'page/margin': 40,
  'section/padding-y': 80,
  'card/padding-lg': 56,
  'heading/gap': 40,
  'grid/column-gap': 48,
  'font/size-h1': 48, 'font/line-height-h1': 58,
  'font/size-h2': 36, 'font/line-height-h2': 46,
  'font/size-h3': 26, 'font/line-height-h3': 34,
};

const UNITLESS = /^(opacity|font\/weight|font\/family)/;
const cssName = (name) => '--' + name.replace(/\//g, '-').replace(/[^a-z0-9-]/gi, '-').toLowerCase();

function value(name, raw) {
  if (typeof raw === 'string' && raw.startsWith('@')) return `var(${cssName(raw.slice(1))})`;
  if (typeof raw === 'number') {
    if (UNITLESS.test(name)) return String(raw);
    return `${raw}px`;
  }
  if (name.startsWith('font/family')) return `"${raw}"`;
  return raw;
}

const lines = [];
lines.push('/* Gegenereerd door tools/build-tokens.js uit tools/figma-tokens.json. Niet met de hand aanpassen. */');
lines.push(`/* Bron: ${src.source}, export ${src.exported} */`, '');

const root = [], mobile = [], tablet = [];
const prim = src.collections.Primitives.vars;
for (const [n, v] of Object.entries(prim)) root.push(`  ${cssName(n)}: ${value(n, v[0])};`);
for (const col of ['Tokens', 'Typography']) {
  for (const [n, [d, m]] of Object.entries(src.collections[col].vars)) {
    root.push(`  ${cssName(n)}: ${value(n, d)};`);
    if (JSON.stringify(d) !== JSON.stringify(m)) mobile.push(`    ${cssName(n)}: ${value(n, m)};`);
  }
}
for (const [n, v] of Object.entries(TABLET)) tablet.push(`    ${cssName(n)}: ${value(n, v)};`);
for (const [n, v] of Object.entries(src.effects)) root.push(`  --shadow-${n.replace(/^Schaduw ?/, '').trim().toLowerCase() || 'default'}: ${v};`);
for (const [n, v] of Object.entries(src.gradients)) root.push(`  --gradient-${n.replace('Verloop/', '').toLowerCase().replace(/\s+/g, '-')}: ${v};`);

lines.push(':root {', ...root, '}', '');
lines.push(`@media (min-width: ${MOBILE_MAX + 1}px) and (max-width: ${TABLET_MAX}px) {`, '  :root {', ...tablet, '  }', '}', '');
lines.push(`@media (max-width: ${MOBILE_MAX}px) {`, '  :root {', ...mobile, '  }', '}', '');

// Tekststijlen als utility-classes (zelfde namen als in Figma).
lines.push('/* Tekststijlen (Figma Text Styles) */');
for (const t of src.textStyles) {
  const cls = '.text-' + t.n.toLowerCase().replace(/[\/ ]+/g, '-');
  const decl = [
    `font-family: var(--font-family-${t.family}), system-ui, sans-serif`,
    `font-size: var(--font-size-${t.size})`,
    `line-height: var(--font-line-height-${t.size})`,
    `font-weight: var(--font-weight-${t.weight})`,
  ];
  if (t.ls) decl.push(`letter-spacing: var(--font-letter-spacing-${t.ls})`);
  if (t.ls === 'caps') decl.push('text-transform: uppercase');
  lines.push(`${cls} { ${decl.join('; ')}; }`);
}

const out = path.join(__dirname, '..', 'src', 'assets', 'css', 'tokens.css');
fs.writeFileSync(out, lines.join('\n') + '\n');
console.log('tokens.css geschreven:', out, `(${root.length} variabelen, ${mobile.length} mobiel, ${tablet.length} tablet)`);
