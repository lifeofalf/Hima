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

Anleggsmodellen ligger Draco-komprimert i `public/models/anlegg.glb`
(1,9 MB, dekoder i `public/draco/`). CAD-eksporten var én sammenslått mesh
uten delnavn eller materialer, så `scripts/colorize-model.py` deler den i
navngitte deler som `Scene.tsx` farger via `PART_STYLES`:

- `wall`, `floor`, `roof`, `structure`, `ground`: bygget i varme gråtoner
- `tank_floor` + `water`: alle 32 kar (16 åttekantede påvekstkar, 8 runde kar,
  8 smoltkar) får mørk bunn og en halvgjennomsiktig vannflate rett under kanten
- `pipe_large` / `pipe_small`: rør funnet som avlange biter med rundt
  tverrsnitt, foreløpig blå og gull til de matches mot arkitektens rendring

Kar-sentrene i skriptet er lest av en plantegning generert fra modellen og
gjelder bare denne eksporten. Kommer en ny eksport med navngitte deler og
materialer, kan den brukes direkte og skriptet blir overflødig.

«Se inni»-knappen bruker et animert snittplan (`CUTAWAY_HEIGHT` i
`lib/hotspots.ts`) som kutter taket. Hotspotene er plassert på
verdenskoordinater; innvendige hotspots (`interior: true`) åpner snittet
automatisk. `?debug=1` i URL-en logger klikk-koordinater i konsollen, og
`?clip=<høyde>` låser snittplanet.

## Tilgjengelighet og fallback

- Hotspotene finnes også som vanlige knapper med full forklaringstekst under
  canvasen (tastaturnavigasjon + tekstalternativ).
- Esc lukker forklaringspanelet; `prefers-reduced-motion` gir klipp i stedet for kameraflyt.
- Uten WebGL vises et stillbilde med samme forklaringsliste.

## Merk

- Fontene (Reckless Neue, Reader) er lisensierte og hentet fra dagens himaseafood.com –
  avklar fontlisens hvis siden skal ligge på et annet domene.
- Bilder er Himas egne fra dagens nettside, som plassholdere til nye foto fra SharePoint.
