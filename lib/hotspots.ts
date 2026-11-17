import type { HotspotId } from "./i18n";

/**
 * Kamera- og markørdata for anleggsmodellen (Draco-GLB i /public/models).
 *
 * Modellen er én sammenslått mesh uten delnavn, så hotspotene er plassert
 * på verdenskoordinater (målt med ?debug=1-klikklogging). Når en bedre
 * eksport med navngitte deler foreligger, kan posisjonene leses fra noder
 * i stedet.
 *
 * `interior: true` betyr at hotspoten ligger inne i bygget: når den velges
 * aktiveres snittvisningen («Se inni»), som klipper bort taket over
 * CUTAWAY_HEIGHT.
 */
export const MODEL_URL: string | null = "/models/anlegg.glb";

/** Snitthøyde for «Se inni»-visningen, i scene-enheter */
export const CUTAWAY_HEIGHT = 5.5;

export interface HotspotDef {
  id: HotspotId;
  /** Markørens posisjon i scenen */
  marker: [number, number, number];
  /** Kameraposisjon når hotspoten er aktiv */
  camera: [number, number, number];
  /** Punktet kameraet ser mot */
  target: [number, number, number];
  /** Ligger delen inne i bygget (krever snittvisning)? */
  interior: boolean;
}

export const DEFAULT_VIEW: { camera: [number, number, number]; target: [number, number, number] } = {
  camera: [46, 30, 46],
  target: [0, 3, 0],
};

export const hotspotDefs: HotspotDef[] = [
  { id: "intake", marker: [-43.4, 3.2, -4.9], camera: [-51, 8, 5], target: [-43.4, 2, -4.9], interior: false },
  { id: "smolt", marker: [-33.2, 8, -3.8], camera: [-42, 15, 16], target: [-33.2, 3, 0.1], interior: true },
  { id: "grow", marker: [-8, 6.5, 2], camera: [-14, 15, 20], target: [-8, 3, 2], interior: true },
  { id: "filter", marker: [15, 6.5, 8], camera: [21, 12, 20], target: [15, 3, 8], interior: true },
  { id: "purge", marker: [20, 6.5, 2], camera: [27, 13, 14], target: [20, 3, 2], interior: true },
  { id: "processing", marker: [33, 6.5, -6], camera: [43, 12, -16], target: [33, 3, -6], interior: true },
  { id: "energy", marker: [-2.6, 6.5, -4.4], camera: [2, 11, -17], target: [-2.6, 3, -4.4], interior: true },
];
