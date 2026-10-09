/**
 * Inhoud die op meerdere pagina's terugkomt (reviews, keurmerken, stappen, FAQ).
 * Teksten komen uit Figma. Waar Figma nog geen tekst heeft, staat een <placeholder>.
 */
// Als HTML-entiteiten, omdat deze tekst als HTML wordt ingevoegd.
const TBD = '&lt;Tekst volgt vanuit de contentdocumenten&gt;';

module.exports = {
  TBD,

  reviews: [
    { name: 'Paul', date: '2 juli 2026', text: 'Ter plaatse goed en duidelijk advies gekregen en daarbij ook meteen de offerte. De uitvoering was uitstekend, werkplek werd netjes achter gelaten.' },
    { name: 'Hans Smits', date: '30 mei 2026', text: 'Vriendelijke man. Vermoedelijk allemaal prima gelukt. Onder het keukenblok over geslagen. Bleek noet uitvoerbaar door leidingen.' },
    { name: 'Esther Kuik', date: '14 juli 2025', text: 'Snelle reactie. Goede uitleg offerte Prettig contact met uitvoerder. Duidelijke en heldere prijsopgaven. Goed resultaat en goede uitvoering.' },
    { name: 'Esther Kuik', date: '14 juli 2025', text: 'Snelle reactie. Goede uitleg offerte Prettig contact met uitvoerder. Duidelijke en heldere prijsopgaven. Goed resultaat en goede uitvoering.' },
  ],

  keurmerken: [
    { logo: 'Logo ATG 3121', text: 'Onafhankelijk technisch beoordeeld.' },
    { logo: 'Logo Buildwise getest', text: 'Prestaties getest bij verschillende vochtbelastingen.' },
    { logo: 'Logo VCA', text: 'Veilig en verantwoord werken.' },
    { logo: 'Logo Kiwa', text: 'Gecertificeerd personeel voor injectietechniek.' },
    { logo: 'Logo Trustoo', text: 'Beoordeeld door klanten.' },
  ],

  stappen: [
    { title: 'Neem contact op', text: 'Bel, WhatsApp of stuur foto’s. We vragen waar je last van hebt en waar het probleem zit.' },
    { title: 'We beoordelen de situatie', text: 'Denken we dat we iets kunnen betekenen? Dan komen we indien gewenst bij je langs en bekijken we waar het vocht vandaan komt.' },
    { title: 'Je krijgt duidelijk advies', text: 'We leggen uit wat volgens ons de oorzaak is en welke oplossing daarbij past. Kunnen wij het probleem oplossen? Dan ontvang je een uitgebreide, vrijblijvende offerte.' },
    { title: 'We voeren het werk uit', text: 'Ga je akkoord? Dan plannen we de werkzaamheden in en voeren we de afgesproken oplossing uit.' },
    { title: 'We blijven je helpen', text: 'Bij muurinjectie ontvang je 30 jaar schriftelijke garantie. Na de droogperiode kun je bovendien een gratis droogcontrole aanvragen.' },
  ],

  // Opties van de keuzelijsten (Figma: Keuzelijst / Onderwerp en Keuzelijst / Wat zie je)
  onderwerpen: ['Vraag over mijn offerte of opdracht', 'Garantie of droogcontrole', 'Webshopbestelling', 'Zakelijk of samenwerking', 'Ik heb vocht in huis', 'Anders'],
  watZieJe: ['Vochtige muur', 'Schimmel', 'Condens', 'Beschadigd stucwerk', 'Anders', 'Weet ik niet'],

  // Artikelkaarten (Gerelateerde artikelen / Handige kennis & advies)
  artikelen: [
    { title: 'Het verschil tussen optrekkend vocht en doorslaand vocht', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio.' },
    { title: 'Wat kost het injecteren van muren gemiddeld?', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio.' },
    { title: '5 tips om schimmel in de kelder te voorkomen', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio.' },
  ],

  // FAQ-pagina: vragen per categorie (antwoorden volgen uit de contentdocumenten)
  faqCategorieen: [
    { title: 'Oorzaken & Herkenning', items: [
      { q: 'Hoe herken ik opstijgend vocht in mijn woning?', a: TBD },
      { q: 'Wat is het verschil tussen opstijgend vocht en doorslaand vocht?', a: TBD },
      { q: 'Is opstijgend vocht schadelijk voor de gezondheid', a: TBD },
    ] },
    { title: 'Categorie 2: Oplossingen & Behandeling', items: [
      { q: 'Hoe wordt opstijgend vocht definitief behandeld', a: TBD },
      { q: 'Hoelang duurt het voordat een behandelde muur helemaal droog is', a: TBD },
      { q: 'Moet ik de woning uit tijdens de werkzaamheden', a: TBD },
    ] },
    { title: 'Categorie 3: Kosten & Garantie', items: [
      { q: 'Wat kost het behandelen van opstijgend vocht', a: TBD },
      { q: 'Krijg ik garantie op de uitgevoerde werkzaamheden', a: TBD },
    ] },
  ],

  faqHome: [
    { q: 'Moet elke vochtige muur worden geïnjecteerd?', a: TBD },
    { q: 'Kan ik eerst foto’s sturen?', a: TBD },
    { q: 'Is het vochtadvies gratis?', a: TBD },
    { q: 'Hoe lang duurt het voordat een muur droog is?', a: TBD },
    { q: 'Helpt ventilatie tegen condens en schimmel?', a: TBD },
    { q: 'Welke garantie krijg ik?', a: TBD },
  ],
};
