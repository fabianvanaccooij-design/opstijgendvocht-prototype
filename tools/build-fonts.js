/**
 * Zet de woff2-bestanden in src/assets/fonts om naar src/assets/css/fonts.css
 * met de lettertypes als data-URI. Browsers blokkeren losse lettertypebestanden
 * als je een HTML-bestand direct opent (file://); zo werken ze altijd.
 * Gebruik: node tools/build-fonts.js
 */
const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'src', 'assets', 'fonts');
const faces = [
  ['Plus Jakarta Sans', 400, 'plus-jakarta-sans-latin-400-normal.woff2'],
  ['Plus Jakarta Sans', 700, 'plus-jakarta-sans-latin-700-normal.woff2'],
  ['Noto Sans', 400, 'noto-sans-latin-400-normal.woff2'],
  ['Noto Sans', 500, 'noto-sans-latin-500-normal.woff2'],
  ['Noto Sans', 700, 'noto-sans-latin-700-normal.woff2'],
];

const css = ['/* Gegenereerd door tools/build-fonts.js. Licentie: SIL Open Font License (zie assets/fonts). */'];
for (const [family, weight, file] of faces) {
  const b64 = fs.readFileSync(path.join(dir, file)).toString('base64');
  css.push(`@font-face { font-family: "${family}"; font-style: normal; font-weight: ${weight}; font-display: swap; src: url(data:font/woff2;base64,${b64}) format("woff2"); }`);
}
fs.writeFileSync(path.join(__dirname, '..', 'src', 'assets', 'css', 'fonts.css'), css.join('\n') + '\n');
console.log('fonts.css geschreven');
