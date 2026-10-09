# Prototype Opstijgendvocht.nl (v2)

Klikbaar HTML/CSS/JS-prototype van het Figma-ontwerp (bestand tUguEVvwZz6DdLwQAQy763), gebouwd door Vsee.

## Bekijken

Open `site/index.html` in de browser. Er is geen server of internet nodig, alles werkt ook rechtstreeks vanaf de schijf. Wil je het online zetten, upload dan de inhoud van de map `site`.

## Pagina's

| Pagina | Bestand |
| --- | --- |
| Homepage | `index.html` |
| Schimmel in huis (dienstpagina) | `schimmel.html` |
| Vocht in een binnenmuur (dienstpagina) | `vocht-in-een-binnenmuur.html` |
| Werkwijze | `werkwijze.html` |
| Resultaten & Klantbeoordelingen | `resultaten.html` |
| Over ons | `over-ons.html` |
| Zakelijk | `zakelijk.html` |
| Contact (met verzonden-staat) | `contact.html` |
| Gratis vochtadvies (formulier in 3 stappen, upload) | `gratis-vochtadvies.html` |
| Bedankpagina | `bedankt.html` |
| Veelgestelde vragen | `veelgestelde-vragen.html` |
| Kennisbank & Blog | `blog.html` |
| Blogartikel | `blogartikel.html` |
| Vocht Magazine (met verzonden-staat) | `vocht-magazine.html` |
| Webshop (met filters) | `webshop.html` |
| Productpagina (galerij, koopbox, sticky koopbalk) | `productpagina.html` |
| 404 | `404.html` |
| Juridische tekstpagina | `tekstpagina.html` |

Interacties in het prototype
- Megamenu (desktop) en mobiel menu met submenu's
- WhatsApp-keuzehulp met drie vragen, een bericht dat zich vult op basis van de antwoorden, een werkende QR-code (desktop) en de knop Open WhatsApp (mobiel)
- Uitklapkaarten, sliders met pijlen (desktop) en veegbare rijen met stippen (mobiel)
- Formulieren met validatie, verzonden-staten en doorsturen naar de bedankpagina
- Gratis vochtadvies: formulier in drie stappen met stappenbalk, Volgende stap en Vorige, keuzekaarten (bij Weet ik niet verschijnt de WhatsApp-tip), adres dat zich aanvult met Wijzigen naar straat en plaats, en een knop in de hero die naar het formulier scrolt
- Foto-upload met slepen, voortgang, verwijderen en foutmeldingen (een bestand met "mislukt" in de naam toont de staat Uploaden mislukt)
- Webshopfilters, productgalerij met lightbox, montage-optie die de prijs aanpast, aantal, sticky koopbalk en de uitleg over montage
- Productpagina mobiel: galerij 3:2 met pijlen en vijf miniaturen, ankerbalk die onder de header plakt met wit verloop aan de kant waar nog items zijn en het actieve onderdeel gemarkeerd (data-anchors), koopbalk altijd zichtbaar, geen WhatsApp-knop

## Aanpassen

De bronbestanden staan in `src`. Na een wijziging bouw je de map `site` opnieuw (zie hieronder).

- **Header, menu en footer** staan op één plek in `src/_includes/components/`. Menu-items, links, telefoonnummer, adressen en de WhatsApp-vragen pas je aan in `src/_data/site.js`. Dat geldt dan voor alle pagina's.
- **Secties** (Hero, Uitklaplijst, Split, CTA, Reviews en dergelijke) zijn macro's in `src/_includes/components/sections.njk`. Ze hebben dezelfde namen als de Figma-componenten. Een wijziging daar geldt voor elke pagina die de sectie gebruikt.
- **Paginateksten** staan per pagina in `src/pages/`. Teksten die vaker terugkomen (reviews, keurmerken, stappen, FAQ) staan in `src/_data/shared.js`, producten in `src/_data/products.js`.
- **Kleuren, maten en lettertypes** komen uit Figma (`tools/figma-tokens.json`) en worden omgezet naar `src/assets/css/tokens.css`. Pas tokens dus in Figma of in dat JSON-bestand aan, niet in tokens.css zelf.
- **Iconen** zijn Font Awesome 7 Sharp Pro (licentie Vsee), als SVG-paden uit de Figma Icon set (`tools/icons-*.json`).
- **Links naar pagina's die nog niet bestaan** gaan naar het dichtstbijzijnde voorbeeldtemplate. Dat staat in `routes` in `src/_data/site.js`.

## Bouwen

Eenmalig `npm install`, daarna

- `npm run build` bouwt de map `site`
- `npm start` start een lokale server die bij elke wijziging opnieuw bouwt

`npm run build` voert eerst drie hulpscripts uit (tokens, iconen en lettertypes) en daarna Eleventy.

## Responsief

- Mobiel tot 767 px (Figma Mobile-mode, 393 px ontwerpen)
- Tablet van 768 tot 1199 px (tussenwaarden, eigen keuze, niet in Figma)
- Desktop vanaf 1200 px (Figma 1920 px ontwerpen, inhoud maximaal 1680 px breed)
- Het volledige desktopmenu verschijnt vanaf 1400 px, daaronder de menuknop

## Bewuste keuzes en placeholders

- Teksten tussen `<` en `>` zijn placeholders uit Figma. Antwoorden van ingeklapte FAQ- en uitklapkaarten staan nog niet in Figma en tonen `<Tekst volgt vanuit de contentdocumenten>`.
- Alle beelden komen uit de Figma-pagina "03 Design" (hero home, team, magazine, Trustoo, hero Gratis vochtadvies, Meltem M-WRG-II, hero Zakelijk mobiel). Waar Figma een placeholder toont, staat hier ook de grijze Figma-placeholder (`placeholder.png`). In `src/assets/img` staan nog enkele oude beeldbestanden uit v1 (hero.jpg, huis.jpg, logo-wit.png, magazine.jpg, team-3.jpg, tegel-*.jpg). Die worden niet meer gebruikt en zijn niet verwijderd.
- Elke pagina is op 1920 en 393 px naast het Figma-ontwerp gelegd. Kleine verschillen in regelafbreking komen door verschillen in letterweergave tussen Figma en de browser.
- Scrollgedrag volgt de Figma-opbouw. Werkwijze: kop links plakt, elke kaart zit in een eigen vak (1112 hoog, 320 verschoven) zodat de stapel compleet is precies wanneer hij wegscrolt. Over ons: de foto plakt en de tekst schuift van het midden naar de bovenkant van de foto, daarna scrolt het hoofdstuk weg (hoogte per hoofdstuk berekend in main.js). Productpagina: de galerij plakt naast de koopbox.
- Paginering werkt (Blog, Webshop, Resultaten). Klikken wisselt de actieve pagina en scrolt naar het begin van de lijst (op Webshop inclusief de filters), de inhoud blijft gelijk.
- Elke pagina behalve de home heeft een kruimelpad (plat: Home > pagina, Bedankt via Gratis vochtadvies). Zet `crumb` (en eventueel `crumbParents`) in de front matter; Blogartikel, Productpagina en Binnenmuur roepen de macro zelf aan voor een dieper pad. Het kruimelpad is transparant: bij een gradient-hero loopt de gradient vanaf direct onder de header erachter door, bij een foto-hero staat het op de foto (wit, mobiel met lichte schaduw bovenaan; Vocht Magazine donker). Gelijk aan Figma. Op mobiel valt het kruimelpad weg bij pagina's op het eerste niveau (pad Home > pagina, class `crumbs--top`); alleen dieper liggende pagina's tonen de terug-link.
- Regel mobiel (tot 767 px): koppen en teksten staan links uitgelijnd, ook waar ze op desktop gecentreerd zijn (`sec-head--center`, `t-center`, CTA, citaat, gecentreerde hero). Keurmerk-bijschriften, knoplabels, upload en swipe-stippen blijven gecentreerd. De header heeft op mobiel een lichte rand onder.
- De header krijgt op desktop een lichte schaduw (shadow-default) zodra hij bovenaan vastzit.
- De sticky WhatsApp-knop staat op desktop 24 px van de onderkant (Figma 84) op verzoek van Fabian.
- De winkelmand in de header staat alleen aan op de webshop (met aantal 1) en de productpagina, zoals in Figma. Aanzetten per pagina met `cart: true` en eventueel `cartCount` in de front matter.
- Het WhatsApp-nummer is 06 11 69 18 81 (zoals op de contactpagina in Figma). De QR-code en de link openen WhatsApp met het bericht uit de keuzehulp.
- Na postcode en huisnummer vult het formulier "Voorbeeldstraat" en "Voorbeeldplaats" in, als voorbeeld van het automatisch aanvullen. Op Gratis vochtadvies verschijnt de balk met het gevonden adres pas na het invullen (Figma toont hem ingevuld); Wijzigen toont de velden Straat en Plaats.
- Gratis vochtadvies: bij wisselen van stap scrolt de pagina naar het begin van het formulier en verschijnt de nieuwe stap met een korte fade (Figma: Smart animate 0,4 s). Stap 1 heeft geen verplichte keuze (geen sterretje in Figma); in stap 2 en 3 worden alleen de zichtbare velden gecontroleerd. Op 393 heeft de verstuurknop 20 px zijpadding zodat het label op één regel past, zoals in Figma.
- In winkelmand toont alleen een korte melding. Winkelmand en afrekenen worden standaard WooCommerce en zijn niet ontworpen.
- Eigen keuzes die niet in Figma staan: de header blijft bovenaan staan bij scrollen, de melding na In winkelmand, het inschuiven van het WhatsApp-paneel, het label naast de sticky WhatsApp-knop bij hover (desktop) en het stapelen van de werkwijze-kaarten bij scrollen. Hovers zijn verder alleen gebruikt waar Figma een hover-staat heeft.
- De maximale bestandsgrootte bij uploaden staat in het prototype op 10 MB (in de tekst nog `<x>`).
