// Standaardinstellingen voor alle pagina's in deze map.
module.exports = {
  layout: 'layouts/base.njk',
  // Platte uitvoer: src/pages/contact.njk wordt site/contact.html
  permalink: (data) => `${data.page.fileSlug}.html`,
};
