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

Siden finnes på `/no`, `/en`, `/de`, `/fr` og `/pl`. Rot (`/`) videresendes til `/no`.

## Struktur

- `app/[locale]/` – side og layout (statisk generert per språk)
- `lib/i18n.ts` – all tekst på fem språk (flat struktur, lett å flytte til Sanity)
- `lib/hotspots.ts` – hotspot-/kameradata for 3D-modellen
- `components/facility/` – 3D-visningen (lazy-lastet, egen chunk)
- `public/images`, `public/fonts` – gjenbrukt fra himaseafood.com

## 3D-modellen

Anleggsmodellen ligger Draco-komprimert i `public/models/anlegg.glb`
(1,2 MB, dekoder i `public/draco/`). Den bygges fra CAD-eksporten med
`scripts/build-model.py`, som lager en forenklet «dukkehus»-versjon i stil
med arkitektens rendring:

- alt utenfor bygget (tomt, master, ytre rørføringer) og under gulvnivå fjernes
- hele modellen kuttes rett over karene, uten tak og himlinger
- bittesmå biter og undersider fjernes (500k → 313k trekanter)
- resten deles i navngitte deler som `Scene.tsx` farger via `PART_STYLES`:
  hvite vegger, grå gulv, turkist vann i alle 36 kar og i kanalbassenget,
  og fargede rør og røde beholdere i det tekniske rommet i østenden

```bash
python3 scripts/build-model.py anlegg-raw.glb anlegg-web.glb   # trimesh, scipy, pillow
gltf-transform draco anlegg-web.glb public/models/anlegg.glb
```

Kar-sentrene og sonene i skriptet er lest av en plantegning generert fra
modellen og gjelder bare denne eksporten. Skalaen er låst til CAD-koordinatene
(`MODEL_SCALE` i `Scene.tsx`), så hotspotene i `lib/hotspots.ts` står fast
selv om modellen forenkles videre. `?debug=1` i URL-en logger klikk-
koordinater i konsollen, til bruk for hotspot-plassering.

## Tilgjengelighet og fallback

- Hotspotene finnes også som vanlige knapper med full forklaringstekst under
  canvasen (tastaturnavigasjon + tekstalternativ).
- Esc lukker forklaringspanelet; `prefers-reduced-motion` gir klipp i stedet for kameraflyt.
- Uten WebGL vises et stillbilde med samme forklaringsliste.

## Merk

- Fontene (Reckless Neue, Reader) er lisensierte og hentet fra dagens himaseafood.com –
  avklar fontlisens hvis siden skal ligge på et annet domene.
- Bilder er Himas egne fra dagens nettside, som plassholdere til nye foto fra SharePoint.
