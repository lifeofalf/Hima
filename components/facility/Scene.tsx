"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Html, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { easing } from "maath";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { hotspotDefs, DEFAULT_VIEW, MODEL_URL } from "@/lib/hotspots";
import type { Dict, HotspotId } from "@/lib/i18n";

interface SceneProps {
  dict: Dict;
  activeId: HotspotId | null;
  resetTick: number;
  onSelect: (id: HotspotId | null) => void;
  onReady: () => void;
}

/** Flyr kameraet mykt mot aktiv hotspot; avbrytes når brukeren tar over. */
function CameraRig({
  activeId,
  resetTick,
  reduced,
}: {
  activeId: HotspotId | null;
  resetTick: number;
  reduced: boolean;
}) {
  const goal = useRef<{ cam: THREE.Vector3; tgt: THREE.Vector3 } | null>(null);
  const first = useRef(true);
  const camera = useThree((s) => s.camera);
  const get = useThree((s) => s.get);
  const controls = useThree((s) => s.controls) as unknown as OrbitControlsImpl | null;

  useEffect(() => {
    const view = activeId ? hotspotDefs.find((h) => h.id === activeId)! : DEFAULT_VIEW;
    const tgt = new THREE.Vector3(...view.target);
    // Smale skjermer trenger mer avstand for å få med hele utsnittet
    const { width, height } = get().size;
    const factor = width / height < 0.9 ? 1.6 : 1;
    const cam = tgt.clone().add(new THREE.Vector3(...view.camera).sub(tgt).multiplyScalar(factor));
    if (first.current || reduced) {
      first.current = false;
      camera.position.copy(cam);
      controls?.target.copy(tgt);
      controls?.update();
      goal.current = null;
    } else {
      goal.current = { cam, tgt };
    }
  }, [activeId, resetTick, reduced, camera, controls, get]);

  useEffect(() => {
    if (!controls) return;
    const cancel = () => {
      goal.current = null;
    };
    controls.addEventListener("start", cancel);
    return () => controls.removeEventListener("start", cancel);
  }, [controls]);

  useFrame((state, dt) => {
    const g = goal.current;
    const c = state.controls as unknown as OrbitControlsImpl | null;
    if (!g || !c) return;
    easing.damp3(state.camera.position, g.cam, 0.32, dt);
    easing.damp3(c.target, g.tgt, 0.32, dt);
    c.update();
    if (state.camera.position.distanceTo(g.cam) < 0.05 && c.target.distanceTo(g.tgt) < 0.05) {
      goal.current = null;
    }
  });

  return null;
}

/**
 * Anleggsmodellen, bygd fra CAD-eksporten med scripts/build-model.py:
 * uten tak og omgivelser, delt i navngitte deler som får hvert sitt
 * materiale her. Skalaen er låst til CAD-koordinatene (lengste side i
 * originalen = 90 enheter), så hotspotene i lib/hotspots.ts står fast selv
 * om modellen forenkles videre. Med ?debug=1 i URL-en logges verdens-
 * koordinaten for hvert klikk, til bruk for hotspot-plassering.
 */
const MODEL_SCALE = 90 / 398.0957;
const FLOOR_Y = 14.5 * MODEL_SCALE;

const PART_STYLES: Record<string, THREE.MeshStandardMaterialParameters> = {
  wall: { color: "#e2e4e6", roughness: 0.9 },
  wall_top: { color: "#f5f6f7", roughness: 0.9 },
  floor: { color: "#7b8086", roughness: 0.95 },
  detail: { color: "#c7cacf", roughness: 0.8 },
  pipe: { color: "#b3b7bd", roughness: 0.6, metalness: 0.2 },
  pipe_green: { color: "#3aa84a", roughness: 0.5 },
  pipe_blue: { color: "#2d6ad4", roughness: 0.5 },
  pipe_yellow: { color: "#e6c02c", roughness: 0.5 },
  vessel_red: { color: "#cf2f2b", roughness: 0.45 },
  tank_floor: { color: "#0d7fae", roughness: 0.6 },
  water: {
    color: "#28b6e0",
    emissive: "#0a5f7c",
    emissiveIntensity: 0.25,
    roughness: 0.15,
    metalness: 0,
    transparent: true,
    opacity: 0.88,
    depthWrite: false,
  },
};

function FacilityModel({ url }: { url: string }) {
  const { scene } = useGLTF(url, "/draco/");

  useEffect(() => {
    const cache = new Map<string, THREE.MeshStandardMaterial>();
    scene.traverse((obj) => {
      if (!(obj instanceof THREE.Mesh)) return;
      // Navnet sitter på noden eller nærmeste forelder, avhengig av loader
      const name = obj.name || obj.parent?.name || "";
      const part = Object.keys(PART_STYLES)
        .sort((a, b) => b.length - a.length)
        .find((k) => name.startsWith(k)) ?? "detail";
      let mat = cache.get(part);
      if (!mat) {
        mat = new THREE.MeshStandardMaterial({
          flatShading: true,
          side: THREE.DoubleSide,
          ...PART_STYLES[part],
        });
        cache.set(part, mat);
      }
      obj.material = mat;
      const isWater = part === "water";
      obj.castShadow = !isWater;
      obj.receiveShadow = true;
      if (isWater) obj.renderOrder = 1;
    });
  }, [scene]);

  const debug =
    typeof window !== "undefined" && new URLSearchParams(window.location.search).has("debug");

  return (
    <group scale={MODEL_SCALE}>
      <primitive
        object={scene}
        onPointerDown={
          debug
            ? (e: { point: THREE.Vector3 }) =>
                console.log("hotspot-koordinat:", e.point.toArray().map((v) => Math.round(v * 10) / 10))
            : undefined
        }
      />
    </group>
  );
}

export default function Scene({ dict, activeId, resetTick, onSelect, onReady }: SceneProps) {
  const reduced = useMemo(
    () =>
      typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: DEFAULT_VIEW.camera, fov: 42, near: 0.5, far: 400 }}
      onCreated={onReady}
      aria-label={dict.facility.canvasLabel}
    >
      <color attach="background" args={["#eceeee"]} />
      <fog attach="fog" args={["#eceeee", 110, 260]} />

      <hemisphereLight intensity={1.1} color="#ffffff" groundColor="#9aa0a6" />
      <ambientLight intensity={0.2} />
      <directionalLight
        position={[30, 50, 25]}
        intensity={1.5}
        color="#fffaf0"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-80}
        shadow-camera-right={80}
        shadow-camera-top={55}
        shadow-camera-bottom={-55}
        shadow-camera-far={160}
        shadow-bias={-0.0004}
      />

      <Suspense fallback={null}>
        <FacilityModel url={MODEL_URL} />
      </Suspense>

      {/* Myk skygge under bygget, ellers usynlig */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, FLOOR_Y - 0.05, 0]} receiveShadow>
        <planeGeometry args={[110, 50]} />
        <shadowMaterial opacity={0.14} />
      </mesh>

      {hotspotDefs.map((h, i) => {
        const title = dict.facility.hotspots[h.id].title;
        return (
          <Html key={h.id} position={h.marker} zIndexRange={[20, 0]}>
            <button
              type="button"
              className="hotspot-marker"
              aria-pressed={activeId === h.id}
              aria-label={dict.facility.markerLabel.replace("{title}", title)}
              onClick={() => onSelect(activeId === h.id ? null : h.id)}
            >
              {i + 1}
            </button>
          </Html>
        );
      })}

      <CameraRig activeId={activeId} resetTick={resetTick} reduced={reduced} />
      <OrbitControls
        makeDefault
        enableDamping
        dampingFactor={0.08}
        minDistance={10}
        maxDistance={110}
        maxPolarAngle={Math.PI * 0.47}
        target={DEFAULT_VIEW.target}
      />
    </Canvas>
  );
}
