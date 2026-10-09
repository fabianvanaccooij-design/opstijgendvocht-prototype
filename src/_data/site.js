/**
 * Centrale gegevens van de site. Pas hier iets aan en het verandert op elke pagina.
 *
 * Links: gebruik de slug van een pagina (bijv. 'contact'). In de templates wordt dat
 * via de filter `href` automatisch 'contact.html'. Pagina's die in het prototype nog
 * niet bestaan, verwijzen naar het dichtstbijzijnde voorbeeldtemplate (zie `routes`).
 */

// Voorbeeldtemplates waar nog niet-bestaande pagina's naartoe linken.
const routes = {
  vochtigeMuur: 'vocht-in-een-binnenmuur',
  schimmel: 'schimmel',
  condens: 'schimmel',
  muurAfwerken: 'vocht-in-een-binnenmuur',
  product: 'productpagina',
  blog: 'blogartikel',
  juridisch: 'tekstpagina',
};

module.exports = {
  name: 'OpstijgendVocht.nl',
  company: 'Van Eijk Vochtwering BV',
  kvk: 'KvK 00000000',
  year: 2026,
  phone: { label: '+31 (0)76 76 76 322', href: 'tel:+31767676322' },
  email: 'info@opstijgendvocht.nl',
  // WhatsApp-nummer zoals op de contactpagina in Figma (06 11 69 18 81). Gebruikt voor wa.me-link en QR-code.
  whatsapp: { number: '31611691881', label: '06 11 69 18 81', defaultText: 'Hallo, ik wil graag vochtadvies.' },
  reactietijd: '<reactietijd>',
  rating: { score: '9,7', count: 145, source: 'Trustoo' },

  routes,

  usps: [
    { icon: 'star', text: '9,7/10 (145 reviews)' },
    { icon: 'shield-check', text: '30 jaar schriftelijke garantie' },
    { icon: 'check', text: 'Gratis en vrijblijvend advies' },
  ],

  topLinks: [
    { label: 'Webshop', href: 'webshop' },
    { label: 'Werkwijze', href: 'werkwijze' },
    { label: 'Resultaten', href: 'resultaten' },
    { label: 'Kennis', href: 'blog' },
  ],

  // Hoofdmenu. Items met `groups` openen een megamenu (desktop) of submenu (mobiel).
  nav: [
    {
      label: 'Vochtige muur', href: routes.vochtigeMuur,
      groups: [
        { title: 'Waar zit het vocht?', links: [
          { label: 'Vocht in een binnenmuur', href: 'vocht-in-een-binnenmuur' },
          { label: 'Vocht in een buitenmuur', href: routes.vochtigeMuur },
          { label: 'Vocht in de spouwmuur', href: routes.vochtigeMuur },
        ] },
        { title: 'Mogelijke oorzaak', links: [
          { label: 'Opstijgend vocht', href: routes.vochtigeMuur },
          { label: 'Vocht na isolatie', href: routes.vochtigeMuur },
          { label: 'Andere oorzaken van vocht in muren', href: routes.vochtigeMuur },
        ] },
        { title: 'Behandeling', links: [
          { label: 'Opstijgend vocht behandelen', href: routes.vochtigeMuur },
          { label: 'Muur injecteren tegen vocht', href: routes.vochtigeMuur },
          { label: 'Vochtige muren behandelen', href: routes.vochtigeMuur },
        ] },
      ],
      cta: { label: 'Alles over vochtige muren', href: routes.vochtigeMuur },
    },
    {
      label: 'Schimmel', href: 'schimmel',
      groups: [
        { links: [
          { label: 'Schimmel in huis', href: 'schimmel' },
          { label: 'Schimmel in huis verwijderen', href: routes.schimmel },
          { label: 'Vocht en schimmel in huis', href: routes.schimmel },
        ] },
      ],
      cta: { label: 'Alles over schimmel', href: 'schimmel' },
    },
    {
      label: 'Condens', href: routes.condens,
      groups: [
        { title: 'Condens & Luchtvochtigheid', links: [
          { label: 'Condens aan de binnenkant van het raam', href: routes.condens },
          { label: 'Hoge luchtvochtigheid in huis', href: routes.condens },
        ] },
        { title: 'Ventilatie als oplossing', links: [
          { label: 'CTA systeem (Overdruksysteem)', href: routes.product },
          { label: 'Decentrale ventilatie (WTW)', href: routes.product },
          { label: 'WTW-unit / Luchtbehandeling', href: routes.product },
          { label: 'Spouwmuurisolatie vochtproblemen', href: routes.condens },
        ] },
      ],
      cta: { label: 'Alles over condens', href: routes.condens },
    },
    {
      label: 'Muur afwerken', href: routes.muurAfwerken,
      groups: [
        { title: 'Afwerking & Herstel', links: [
          { label: 'Muur drogen na injecteren', href: routes.muurAfwerken },
          { label: 'Zoutuitslag op de muur', href: routes.muurAfwerken },
          { label: 'Beschadigd stucwerk herstellen', href: routes.muurAfwerken },
          { label: 'SaltShieldPlus', href: routes.product },
        ] },
      ],
      cta: { label: 'Alles over muur afwerken', href: routes.muurAfwerken },
    },
    {
      label: 'Over ons', href: 'over-ons',
      groups: [
        { links: [
          { label: 'Zakelijk samenwerken', href: 'zakelijk' },
          { label: 'Veelgestelde vragen', href: 'veelgestelde-vragen' },
        ] },
      ],
      cta: { label: 'Alles over ons', href: 'over-ons' },
      small: true,
    },
    { label: 'Contact', href: 'contact' },
  ],

  footer: {
    locations: [
      { city: 'Rijsbergen', street: 'Begijneweide 4s' },
      { city: 'Goes', street: 'Van Dusseldorpstraat 40' },
      { city: 'Middelharnis', street: 'Voorstraat 15' },
    ],
    columns: [
      { title: 'Vochtproblemen', links: [
        { label: 'Vochtige muur', href: routes.vochtigeMuur },
        { label: 'Schimmel', href: 'schimmel' },
        { label: 'Condens', href: routes.condens },
        { label: 'Muur afwerken', href: routes.muurAfwerken },
      ] },
      { title: 'Over ons', links: [
        { label: 'Werkwijze', href: 'werkwijze' },
        { label: 'Over ons', href: 'over-ons' },
        { label: 'Zakelijk samenwerken', href: 'zakelijk' },
        { label: 'Contact', href: 'contact' },
      ] },
      { title: 'Kennis en webshop', links: [
        { label: 'Veelgestelde vragen', href: 'veelgestelde-vragen' },
        { label: 'Blogs en kennisbank', href: 'blog' },
        { label: 'Vocht Magazine', href: 'vocht-magazine' },
        { label: 'Webshop', href: 'webshop' },
      ] },
    ],
    legal: [
      { label: 'Privacybeleid', href: routes.juridisch },
      { label: 'Algemene voorwaarden', href: routes.juridisch },
    ],
    badges: ['Trustoo Top PRO', 'Kiwa', 'VCA'],
  },

  // Vragen van de WhatsApp-keuzehulp (zelfde in het desktoppaneel en de mobiele sheet).
  keuzehulp: [
    { question: 'Wat zie je?', key: 'wat', options: ['Vochtige plekken', 'Beschadigd stucwerk', 'Schimmel', 'Condens', 'Anders / weet ik niet'] },
    { question: 'Waar in de woning zie je het?', key: 'waar', options: ['Bovenverdieping / zolder', 'Begane grond', 'Trapkast', 'Souterrain', 'Kelder', 'Op meerdere verdiepingen'] },
    { question: 'Waar zit het?', key: 'plek', options: ['Binnenmuur', 'Buitenmuur', 'Rond ramen of kozijnen', 'Op meerdere plekken', 'Weet ik niet'] },
  ],
};
