# Hima Trout – produktside

Produktside for Hima Trout (Hima Seafood AS) med interaktiv 3D-modell av RAS-anlegget på Rjukan.
Bygd med Next.js (App Router) + react-three-fiber/drei, samme stack-familie som nye himaseafood.com,
slik at seksjonene kan løftes inn der.

## Kjøring

```bash
npm install
npm run dev      # utvikling
npm run build && npm run start   # produksjon
```

Siden finnes på `/no`, `/en`, `/de` og `/fr`. Rot (`/`) videresendes til `/no`.

## Struktur

- `app/[locale]/` – side og layout (statisk generert per språk)
- `lib/i18n.ts` – all tekst på fire språk (flat struktur, lett å flytte til Sanity)
- `lib/hotspots.ts` – hotspot-/kameradata for 3D-modellen
- `components/facility/` – 3D-visningen (lazy-lastet, egen chunk)
- `public/images`, `public/fonts` – gjenbrukt fra himaseafood.com

## 3D-modellen

Den ekte anleggsmodellen ligger Draco-komprimert i `public/models/anlegg.glb`
(8 MB → 1,5 MB, dekoder i `public/draco/`). Filen er én sammenslått mesh uten
delnavn, materialer eller normaler, derfor:

- Størrelsen normaliseres i `RealModel` (lengste side = 90 enheter) og hele
  meshen får ett arkitektmodell-materiale med flat shading.
- «Se inni»-knappen bruker et animert snittplan (`CUTAWAY_HEIGHT` i
  `lib/hotspots.ts`) som kutter taket, siden takdeler ikke kan skjules enkeltvis.
- Hotspotene er plassert på verdenskoordinater i `lib/hotspots.ts`.
  Innvendige hotspots (`interior: true`) åpner snittvisningen automatisk.

Verktøy for å justere hotspots: åpne siden med `?debug=1` og klikk i modellen,
verdenskoordinaten logges i konsollen. `?clip=<høyde>` låser snittplanet.

Får vi en ny eksport med navngitte deler og materialer, kan farger beholdes og
hotspots festes til noder i stedet for koordinater. `PlaceholderModel` brukes
bare hvis `MODEL_URL` settes til `null`, og kan slettes når modellen er endelig.

## Tilgjengelighet og fallback

- Hotspotene finnes også som vanlige knapper med full forklaringstekst under
  canvasen (tastaturnavigasjon + tekstalternativ).
- Esc lukker forklaringspanelet; `prefers-reduced-motion` gir klipp i stedet for kameraflyt.
- Uten WebGL vises et stillbilde med samme forklaringsliste.

## Merk

- Fontene (Reckless Neue, Reader) er lisensierte og hentet fra dagens himaseafood.com –
  avklar fontlisens hvis siden skal ligge på et annet domene.
- Bilder er Himas egne fra dagens nettside, som plassholdere til nye foto fra SharePoint.
