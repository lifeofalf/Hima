"use client";

import { Edges } from "@react-three/drei";

/**
 * Forenklet, prosedyregenerert modell av RAS-anlegget på Rjukan.
 * Fungerer som plassholder til den ekte CAD-modellen (Draco-GLB) er klar –
 * gruppenavnene speiler hotspot-id-ene i lib/hotspots.ts.
 */

const GHOST = { color: "#8d8a7a", transparent: true, opacity: 0.13, depthWrite: false } as const;
const SHELL_EDGE = "#8d7b52";
const SOLID = "#4a463a";
const STEEL = "#9fa6a6";
const DARK_STEEL = "#666256";
const WATER = "#8fa6a8";
const GOLD = "#c39e5c";

function Tank({
  position,
  radius,
  height,
}: {
  position: [number, number, number];
  radius: number;
  height: number;
}) {
  return (
    <group position={position}>
      <mesh castShadow receiveShadow position={[0, height / 2, 0]}>
        <cylinderGeometry args={[radius, radius, height, 40]} />
        <meshStandardMaterial color={STEEL} metalness={0.25} roughness={0.55} />
      </mesh>
      <mesh position={[0, height + 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[radius * 0.93, 40]} />
        <meshStandardMaterial color={WATER} roughness={0.15} metalness={0.1} />
      </mesh>
    </group>
  );
}

function GhostHall({
  position,
  size,
}: {
  position: [number, number, number];
  size: [number, number, number];
}) {
  return (
    <mesh position={position}>
      <boxGeometry args={size} />
      <meshStandardMaterial {...GHOST} />
      <Edges color={SHELL_EDGE} />
    </mesh>
  );
}

export default function PlaceholderModel() {
  return (
    <group name="anlegg">
      {/* Dalbunnen */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[320, 320]} />
        <meshStandardMaterial color="#26241a" roughness={1} />
      </mesh>

      {/* Hovedhall med påvekstkar */}
      <GhostHall position={[0, 4.5, 0]} size={[60, 9, 22]} />
      <group name="grow">
        {[-18, -6, 6, 18].map((x) =>
          [-5.5, 5.5].map((z) => (
            <Tank key={`${x}-${z}`} position={[x, 0, z]} radius={3.1} height={4} />
          ))
        )}
      </group>

      {/* Smoltavdeling (vestfløy) */}
      <GhostHall position={[-22, 3, 13]} size={[16, 6, 10]} />
      <group name="smolt">
        {[-26, -22, -18].map((x) =>
          [11, 15].map((z) => (
            <Tank key={`${x}-${z}`} position={[x, 0, z]} radius={1.1} height={2.2} />
          ))
        )}
      </group>

      {/* Vanninntak – brønner og rør inn mot anlegget */}
      <group name="intake">
        {[
          [-38, 14],
          [-41, 12],
          [-38, 10],
        ].map(([x, z]) => (
          <mesh key={`${x}-${z}`} castShadow position={[x, 0.8, z]}>
            <cylinderGeometry args={[0.8, 0.8, 1.6, 24]} />
            <meshStandardMaterial color={DARK_STEEL} roughness={0.7} />
          </mesh>
        ))}
        <mesh position={[-33, 1.1, 13]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.3, 0.3, 10, 16]} />
          <meshStandardMaterial color={DARK_STEEL} roughness={0.5} metalness={0.3} />
        </mesh>
      </group>

      {/* RAS-filtrering (østfløy nord) */}
      <group name="filter">
        <mesh castShadow receiveShadow position={[22, 2.5, 13]}>
          <boxGeometry args={[12, 5, 10]} />
          <meshStandardMaterial color={DARK_STEEL} roughness={0.8} />
        </mesh>
        {[19, 22, 25].map((x) => (
          <mesh key={x} castShadow position={[x, 6.3, 13]}>
            <cylinderGeometry args={[1.2, 1.2, 3, 28]} />
            <meshStandardMaterial color={STEEL} metalness={0.3} roughness={0.5} />
          </mesh>
        ))}
        <mesh castShadow position={[22, 1.4, 7.2]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[1, 1, 6, 24]} />
          <meshStandardMaterial color={STEEL} metalness={0.35} roughness={0.45} />
        </mesh>
      </group>

      {/* Purge-hall */}
      <GhostHall position={[32, 3, -4]} size={[12, 6, 12]} />
      <group name="purge">
        <Tank position={[29, 0, -6.5]} radius={2} height={3.5} />
        <Tank position={[29, 0, -1.5]} radius={2} height={3.5} />
        <Tank position={[34.5, 0, -4]} radius={2} height={3.5} />
      </group>

      {/* Prosessering og pakking */}
      <group name="processing">
        <mesh castShadow receiveShadow position={[44, 3, -4]}>
          <boxGeometry args={[12, 6, 14]} />
          <meshStandardMaterial color={SOLID} roughness={0.85} />
        </mesh>
        <mesh castShadow position={[44, 6.4, -4]}>
          <boxGeometry args={[8, 0.8, 9]} />
          <meshStandardMaterial color={DARK_STEEL} roughness={0.8} />
        </mesh>
        {/* Lasterampe */}
        <mesh castShadow position={[48.5, 1, -12]}>
          <boxGeometry args={[5, 2, 2]} />
          <meshStandardMaterial color={DARK_STEEL} roughness={0.8} />
        </mesh>
      </group>

      {/* Energisenter med varmeveksler */}
      <group name="energy">
        <mesh castShadow receiveShadow position={[10, 2, 16]}>
          <boxGeometry args={[6, 4, 5]} />
          <meshStandardMaterial color={SOLID} roughness={0.85} />
        </mesh>
        {[-2, -1, 0, 1, 2].map((i) => (
          <mesh key={i} castShadow position={[10 + i, 4.5, 16]}>
            <boxGeometry args={[0.18, 1, 4.4]} />
            <meshStandardMaterial color={GOLD} metalness={0.5} roughness={0.35} />
          </mesh>
        ))}
      </group>
    </group>
  );
}
