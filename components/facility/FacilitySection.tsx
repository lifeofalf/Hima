"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Logo from "../Logo";
import { hotspotDefs } from "@/lib/hotspots";
import type { Dict, HotspotId } from "@/lib/i18n";

const Scene = dynamic(() => import("./Scene"), { ssr: false, loading: () => null });

function supportsWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl2") || canvas.getContext("webgl"))
    );
  } catch {
    return false;
  }
}

export default function FacilitySection({ dict }: { dict: Dict }) {
  const [webgl, setWebgl] = useState<boolean | null>(null);
  const [ready, setReady] = useState(false);
  const [activeId, setActiveId] = useState<HotspotId | null>(null);
  const [resetTick, setResetTick] = useState(0);
  const panelCloseRef = useRef<HTMLButtonElement>(null);
  const lastFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    setWebgl(supportsWebGL());
  }, []);

  const select = useCallback((id: HotspotId | null) => {
    if (id) lastFocusRef.current = document.activeElement as HTMLElement;
    setActiveId(id);
  }, []);

  // Esc lukker panelet; fokus flyttes inn i og ut av dialogen
  useEffect(() => {
    if (activeId) {
      panelCloseRef.current?.focus();
      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") setActiveId(null);
      };
      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
    }
    lastFocusRef.current?.focus?.();
  }, [activeId]);

  const active = activeId ? dict.facility.hotspots[activeId] : null;

  return (
    <section className="facility dark" id="anlegget">
      <div className="container">
        <div className="facility-head">
          <div>
            <p className="kicker">{dict.facility.kicker}</p>
            <h2 className="section-heading">{dict.facility.title}</h2>
            <p>{dict.facility.intro}</p>
          </div>
        </div>

        <div className="viewer" role="region" aria-label={dict.facility.canvasLabel}>
          {webgl === false ? (
            <div className="viewer-fallback">
              <img src="/images/facility-fallback.jpg" alt={dict.facility.fallbackAlt} />
              <p>{dict.facility.webglFallback}</p>
            </div>
          ) : (
            <>
              {webgl && (
                <Scene
                  dict={dict}
                  activeId={activeId}
                  resetTick={resetTick}
                  onSelect={select}
                  onReady={() => setReady(true)}
                />
              )}
              {!ready && (
                <div className="viewer-loading" aria-live="polite">
                  <Logo />
                  <div className="bar" aria-hidden="true" />
                  <span>{dict.facility.loading}</span>
                </div>
              )}
              <p className="viewer-hint">{dict.facility.hint}</p>
              <button
                type="button"
                className="viewer-reset"
                onClick={() => {
                  select(null);
                  setResetTick((t) => t + 1);
                }}
              >
                {dict.facility.reset}
              </button>
              <p className="viewer-note">{dict.facility.placeholderNote}</p>
              {active && (
                <div
                  className="hotspot-panel"
                  role="dialog"
                  aria-label={active.title}
                >
                  <button
                    type="button"
                    ref={panelCloseRef}
                    className="panel-close"
                    onClick={() => select(null)}
                    aria-label={dict.facility.close}
                  >
                    ✕
                  </button>
                  <h4>{active.title}</h4>
                  <p>{active.body}</p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Tekstalternativ og tastaturnavigasjon for hotspotene */}
        <nav className="hotspot-list" aria-label={dict.facility.hotspotListHeading}>
          <h3>{dict.facility.hotspotListHeading}</h3>
          <ul>
            {hotspotDefs.map((h, i) => {
              const text = dict.facility.hotspots[h.id];
              return (
                <li key={h.id}>
                  <button
                    type="button"
                    aria-pressed={activeId === h.id}
                    onClick={() => select(activeId === h.id ? null : h.id)}
                  >
                    <span className="num" aria-hidden="true">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {text.title}
                    <span className="hotspot-body">{text.body}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </section>
  );
}
