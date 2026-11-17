import type { HotspotId } from "./i18n";

/**
 * Kamera- og markørdata for anleggsmodellen (public/models/anlegg.glb).
 *
 * Koordinatene er i scene-enheter: CAD-koordinater × 90/398.1 (se
 * MODEL_SCALE i components/facility/Scene.tsx). Modellen har ingen delnavn
 * fra CAD, så posisjonene er målt på modellen med ?debug=1-klikklogging.
 */
export const MODEL_URL = "/models/anlegg.glb";

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
  { id: "intake", marker: [-41.8, 6.5, -2.3], camera: [-50, 13, 12], target: [-41.8, 4, -2.3] },
  { id: "smolt", marker: [-33.2, 7, -3.8], camera: [-42, 15, 16], target: [-33.2, 4, 0.1] },
  { id: "grow", marker: [-8, 7, 2], camera: [-14, 16, 20], target: [-8, 4, 2] },
  { id: "filter", marker: [15, 7, 8], camera: [21, 13, 20], target: [15, 4, 8] },
  { id: "purge", marker: [20, 7, 2], camera: [27, 14, 14], target: [20, 4, 2] },
  { id: "processing", marker: [33, 7, -6], camera: [43, 13, -16], target: [33, 4, -6] },
  { id: "energy", marker: [37.3, 7, -1.5], camera: [46, 13, 8], target: [37.3, 4, -1.5] },
];
