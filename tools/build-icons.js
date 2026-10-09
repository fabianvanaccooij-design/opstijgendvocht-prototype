/**
 * Bouwt src/assets/icons/sprite.svg uit de Figma-iconexports (tools/icons-*.json).
 * Gebruik: node tools/build-icons.js
 *
 * Iconen zijn Font Awesome 7 Sharp Pro (Solid), geexporteerd als paden uit de Figma Icon set.
 * Vsee heeft hiervoor een licentie. In de templates gebruik je {{ icon('arrow-right') }}.
 */
const fs = require('fs');
const path = require('path');

const files = fs.readdirSync(__dirname).filter((f) => /^icons-.*\.json$/.test(f)).sort();
const icons = Object.assign({}, ...files.map((f) => JSON.parse(fs.readFileSync(path.join(__dirname, f), 'utf8'))));
const slug = (n) => n.toLowerCase().replace(/\s+/g, '-');

const symbols = Object.entries(icons).map(([name, { vb, d }]) =>
  `  <symbol id="i-${slug(name)}" viewBox="${vb}">${d.map((p) => `<path d="${p}"/>`).join('')}</symbol>`);

const out = path.join(__dirname, '..', 'src', 'assets', 'icons', 'sprite.svg');
fs.writeFileSync(out, `<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style="display:none">\n${symbols.join('\n')}\n</svg>\n`);

// Lijst voor de icon-macro (handig om typfouten te vangen).
fs.writeFileSync(path.join(__dirname, '..', 'src', '_data', 'icons.json'), JSON.stringify(Object.keys(icons).map(slug), null, 2));
console.log(`sprite.svg geschreven (${symbols.length} iconen)`);
