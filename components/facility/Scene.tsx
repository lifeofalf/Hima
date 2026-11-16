"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Html, Line, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { easing } from "maath";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { hotspotDefs, DEFAULT_VIEW, MODEL_URL, CUTAWAY_HEIGHT } from "@/lib/hotspots";
import PlaceholderModel from "./PlaceholderModel";
import type { Dict, HotspotId } from "@/lib/i18n";

interface SceneProps {
  dict: Dict;
  activeId: HotspotId | null;
  resetTick: number;
  cutaway: boolean;
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
    const view = activeId
      ? hotspotDefs.find((h) => h.id === activeId)!
      : DEFAULT_VIEW;
    const tgt = new THREE.Vector3(...view.target);
    // Smale skjermer trenger mer avstand for å få med hele utsnittet
    const { width, height } = get().size;
    const factor = width / height < 0.9 ? 1.6 : 1;
    const cam = tgt
      .clone()
      .add(new THREE.Vector3(...view.camera).sub(tgt).multiplyScalar(factor));
    if (first.current) {
      first.current = false;
      camera.position.copy(cam);
      if (controls) {
        controls.target.copy(tgt);
        controls.update();
      }
      return;
    }
    if (reduced) {
      camera.position.copy(cam);
      if (controls) {
        controls.target.copy(tgt);
        controls.update();
      }
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
    const c0 = state.controls as unknown as OrbitControlsImpl | null;
    if (typeof window !== "undefined" && window.location.search.includes("debug")) {
      // @ts-expect-error dev-instrumentering
      window.__viewer = {
        cam: state.camera.position.toArray().map((v) => Math.round(v * 10) / 10),
        tgt: c0?.target.toArray().map((v) => Math.round(v * 10) / 10),
        goal: goal.current ? goal.current.cam.toArray() : null,
      };
    }
    const g = goal.current;
    const c = c0;
    if (!g || !c) return;
    easing.damp3(state.camera.position, g.cam, 0.32, dt);
    easing.damp3(c.target, g.tgt, 0.32, dt);
    c.update();
    if (
      state.camera.position.distanceTo(g.cam) < 0.05 &&
      c.target.distanceTo(g.tgt) < 0.05
    ) {
      goal.current = null;
    }
  });

  return null;
}

/** Animert strek som viser vannets vei gjennom anlegget. */
function WaterFlow({
  points,
  paused,
  speed = 2.2,
}: {
  points: THREE.Vector3[];
  paused: boolean;
  speed?: number;
}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ref = useRef<any>(null);
  useFrame((_, dt) => {
    const mat = ref.current?.material;
    if (!paused && mat) {
      mat.dashOffset -= dt * speed;
    }
  });
  return (
    <Line
      ref={ref}
      points={points}
      color="#8fa6a8"
      lineWidth={1.6}
      dashed
      dashSize={0.9}
      gapSize={0.6}
      transparent
      opacity={0.85}
    />
  );
}

/**
 * Den ekte anleggsmodellen (Draco-komprimert GLB, dekoder i /public/draco).
 * Filen er én sammenslått mesh uten materialer, så vi normaliserer størrelsen
 * (lengste side = 90 enheter, senter i origo, bakken på y=0) og setter ett
 * arkitektmodell-aktig materiale. Med ?debug=1 i URL-en logges verdens-
 * koordinaten for hvert klikk, til bruk for hotspot-plassering.
 */
const MODEL_FIT = 90;
const CUTAWAY_OFF = 200;

function RealModel({ url, cutaway }: { url: string; cutaway: boolean }) {
  const { scene } = useGLTF(url, "/draco/");

  const { scale, position } = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    const s = MODEL_FIT / Math.max(size.x, size.y, size.z);
    const center = box.getCenter(new THREE.Vector3());
    return {
      scale: s,
      position: [-center.x * s, -box.min.y * s, -center.z * s] as [number, number, number],
    };
  }, [scene]);

  // Snittplanet som kutter taket i «Se inni»-visningen (verdensrom, y <= constant)
  const plane = useMemo(
    () => new THREE.Plane(new THREE.Vector3(0, -1, 0), CUTAWAY_OFF),
    []
  );

  useEffect(() => {
    const material = new THREE.MeshStandardMaterial({
      color: "#b9b6a9",
      flatShading: true,
      roughness: 0.85,
      metalness: 0.05,
      side: THREE.DoubleSide,
      clippingPlanes: [plane],
      clipShadows: true,
    });
    scene.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        obj.material = material;
        obj.castShadow = true;
        obj.receiveShadow = true;
      }
    });
  }, [scene, plane]);

  // Debug: ?clip=<høyde> låser snittplanet for koordinatarbeid
  const clipOverride = useMemo(() => {
    if (typeof window === "undefined") return null;
    const v = new URLSearchParams(window.location.search).get("clip");
    return v ? Number(v) : null;
  }, []);

  useFrame((_, dt) => {
    const target = clipOverride ?? (cutaway ? CUTAWAY_HEIGHT : CUTAWAY_OFF);
    easing.damp(plane, "constant", target, 0.5, dt);
  });

  const debug =
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).has("debug");

  return (
    <group scale={scale} position={position}>
      <primitive
        object={scene}
        onPointerDown={
          debug
            ? (e: { point: THREE.Vector3 }) =>
                console.log(
                  "hotspot-koordinat:",
                  e.point.toArray().map((v) => Math.round(v * 10) / 10)
                )
            : undefined
        }
      />
    </group>
  );
}

export default function Scene({ dict, activeId, resetTick, cutaway, onSelect, onReady }: SceneProps) {
  const reduced = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  const mainLoop = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(
      [
        new THREE.Vector3(-38, 1.2, 14),
        new THREE.Vector3(-30, 1.5, 12),
        new THREE.Vector3(-22, 1.7, 10),
        new THREE.Vector3(-20, 1.9, 4),
        new THREE.Vector3(-18, 2.1, -5.5),
        new THREE.Vector3(-6, 2.1, -5.5),
        new THREE.Vector3(6, 2.1, -5.5),
        new THREE.Vector3(18, 2.1, -2),
        new THREE.Vector3(21, 2.3, 6),
        new THREE.Vector3(22, 2.6, 12),
        new THREE.Vector3(12, 3.4, 10),
        new THREE.Vector3(0, 3.6, 8),
        new THREE.Vector3(-14, 3.2, 8),
        new THREE.Vector3(-24, 2.4, 10),
      ],
      true
    );
    return curve.getPoints(280);
  }, []);

  const harvestLine = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(26, 1.8, -4),
      new THREE.Vector3(33, 1.8, -4),
      new THREE.Vector3(40, 1.8, -4),
    ]);
    return curve.getPoints(40);
  }, []);

  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: DEFAULT_VIEW.camera, fov: 42, near: 0.5, far: 400 }}
      gl={{ localClippingEnabled: true }}
      onCreated={onReady}
      aria-label={dict.facility.canvasLabel}
    >
      <color attach="background" args={["#1c1a10"]} />
      <fog attach="fog" args={["#1c1a10", 95, 230]} />

      <hemisphereLight intensity={0.6} color="#d0d2d2" groundColor="#26241a" />
      <ambientLight intensity={0.3} />
      <directionalLight
        position={[35, 45, 20]}
        intensity={1.7}
        color="#f4e9d4"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-75}
        shadow-camera-right={75}
        shadow-camera-top={60}
        shadow-camera-bottom={-60}
        shadow-camera-far={160}
      />

      <Suspense fallback={null}>
        {MODEL_URL ? <RealModel url={MODEL_URL} cutaway={cutaway} /> : <PlaceholderModel />}
      </Suspense>

      {/* Vannstrøm-animasjonen tegnes bare for plassholderen til traseen er
          lagt om til den ekte modellens layout */}
      {!MODEL_URL && (
        <>
          <WaterFlow points={mainLoop} paused={reduced} />
          <WaterFlow points={harvestLine} paused={reduced} speed={1.4} />
        </>
      )}

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
