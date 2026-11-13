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

## Bytte inn den ekte CAD-modellen

1. Konverter CAD-filen til GLB og Draco-komprimer den
   (`gltf-transform optimize inn.glb ut.glb --compress draco`).
2. Legg filen i `public/models/anlegg.glb`.
3. Sett `MODEL_URL = "/models/anlegg.glb"` i `lib/hotspots.ts`.
4. Juster `marker`/`camera`/`target` per hotspot så de treffer de riktige delene.
5. Fjern `PlaceholderModel` når alt stemmer.

## Tilgjengelighet og fallback

- Hotspotene finnes også som vanlige knapper med full forklaringstekst under
  canvasen (tastaturnavigasjon + tekstalternativ).
- Esc lukker forklaringspanelet; `prefers-reduced-motion` gir klipp i stedet for kameraflyt.
- Uten WebGL vises et stillbilde med samme forklaringsliste.

## Merk

- Fontene (Reckless Neue, Reader) er lisensierte og hentet fra dagens himaseafood.com –
  avklar fontlisens hvis siden skal ligge på et annet domene.
- Bilder er Himas egne fra dagens nettside, som plassholdere til nye foto fra SharePoint.
