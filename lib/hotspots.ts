import type { HotspotId } from "./i18n";

/**
 * Kamera- og markørdata for anleggsmodellen.
 *
 * Når den ekte CAD-modellen (Draco-komprimert GLB) er på plass:
 *  1. Legg filen i /public/models/anlegg.glb og sett MODEL_URL under.
 *  2. Juster marker/camera/target til å treffe de faktiske delene,
 *     eller les posisjoner fra navngitte noder i GLB-en.
 */
export const MODEL_URL: string | null = null;

export interface HotspotDef {
  id: HotspotId;
  /** Markørens posisjon i scenen */
  marker: [number, number, number];
  /** Kameraposisjon når hotspoten er aktiv */
  camera: [number, number, number];
  /** Punktet kameraet ser mot */
  target: [number, number, number];
}

export const DEFAULT_VIEW: { camera: [number, number, number]; target: [number, number, number] } = {
  camera: [46, 30, 46],
  target: [0, 3, 0],
};

export const hotspotDefs: HotspotDef[] = [
  { id: "intake", marker: [-38, 4.6, 14], camera: [-52, 10, 26], target: [-38, 2, 14] },
  { id: "smolt", marker: [-22, 7.6, 13], camera: [-34, 11, 26], target: [-22, 3, 13] },
  { id: "grow", marker: [-6, 8.2, -5.5], camera: [-4, 13, -22], target: [-6, 3, -4] },
  { id: "filter", marker: [22, 9.2, 13], camera: [31, 11, 26], target: [22, 4, 13] },
  { id: "purge", marker: [32, 7.2, -4], camera: [25, 9, -17], target: [32, 3, -4] },
  { id: "processing", marker: [44, 8.6, -4], camera: [56, 11, -19], target: [44, 3, -4] },
  { id: "energy", marker: [10, 6.8, 16], camera: [16, 9, 29], target: [10, 2.5, 16] },
];
