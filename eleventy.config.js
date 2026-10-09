/**
 * Eleventy-configuratie.
 *
 * - Bron in src/, resultaat in site/ (die map kun je zo openen of uploaden).
 * - Alle pagina's komen plat in site/ (home.html, contact.html ...), zodat het
 *   prototype ook werkt door site/index.html te dubbelklikken (file://).
 * - Gedeelde onderdelen (header, footer, secties) staan in src/_includes en
 *   worden in elke pagina hergebruikt. Eén aanpassing daar geldt overal.
 */
const fs = require('fs');
const path = require('path');
const nunjucks = require('nunjucks');

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ 'src/assets': 'assets' });
  eleventyConfig.addWatchTarget('src/assets/');

  const safe = (html) => new nunjucks.runtime.SafeString(html);

  // Icoon uit de sprite. Gebruik {{ icon('arrow-right') }} of {{ icon('check', 'icon--sm') }}.
  // De sprite staat inline in elke pagina (zie base.njk), zodat <use href="#..."> ook via file:// werkt.
  const known = new Set(require('./src/_data/icons.json'));
  eleventyConfig.addNunjucksGlobal('icon', (name, cls = '') => {
    if (!known.has(name)) throw new Error(`Onbekend icoon "${name}". Zie src/_data/icons.json`);
    return safe(`<svg class="icon ${cls}" aria-hidden="true" focusable="false"><use href="#i-${name}"></use></svg>`);
  });

  // Inline SVG-bestand (sprite, QR-code).
  eleventyConfig.addNunjucksGlobal('inlineSvg', (file) => safe(fs.readFileSync(path.join(__dirname, 'src', file), 'utf8')));

  // Bedrag als "€ 1.234,50" (of "€ 390" als er geen centen zijn).
  eleventyConfig.addFilter('euro', (n) => {
    const hasCents = Math.round(n * 100) % 100 !== 0;
    return '€ ' + n.toLocaleString('nl-NL', { minimumFractionDigits: hasCents ? 2 : 0, maximumFractionDigits: 2 });
  });

  // Bedrag altijd met centen: 2645 -> "€ 2.645,00" (zo staat het in de koopbox).
  eleventyConfig.addFilter('euroCents', (n) => '€ ' + Number(n).toLocaleString('nl-NL', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));

  // Paginalink: 'contact' -> 'contact.html'. Volledige URL's en ankers blijven zoals ze zijn.
  eleventyConfig.addFilter('href', (slug) => {
    if (!slug) return '#';
    if (/^(https?:|mailto:|tel:|#)/.test(slug)) return slug;
    return slug.includes('.html') ? slug : `${slug.replace(/#.*/, '')}.html${slug.includes('#') ? slug.slice(slug.indexOf('#')) : ''}`;
  });

  return {
    dir: { input: 'src', output: 'site', includes: '_includes', data: '_data' },
    templateFormats: ['njk', 'md'],
    htmlTemplateEngine: 'njk',
    markdownTemplateEngine: 'njk',
  };
};
