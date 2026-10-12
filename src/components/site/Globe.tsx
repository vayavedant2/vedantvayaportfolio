"use client";

import createGlobe from "cobe";
import { useEffect, useRef } from "react";
import { globeNodes } from "@/data/globe";
import home from "./home.module.css";
import { prefersReducedMotion } from "./motion";

/** Matches --accent / --accent-glow in globals.css (navy + soft steel sheen). */
const ACCENT: [number, number, number] = [28 / 255, 61 / 255, 114 / 255];
const ACCENT_SOFT: [number, number, number] = [70 / 255, 120 / 255, 190 / 255];
const BASE: [number, number, number] = [0.14, 0.14, 0.14];
const GLOW: [number, number, number] = [120 / 255, 165 / 255, 230 / 255];
const ROTATE_STEP = 0.0028;

const markers = globeNodes.map((node) => ({
  location: node.location,
  size: node.hub ? 0.09 : 0.04,
  color: node.hub ? ACCENT : ACCENT_SOFT,
}));

export function Globe() {
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    if (!stage || !canvas) return;

    let width = 0;
    let phi = 2.35;
    let frame = 0;
    let globe: ReturnType<typeof createGlobe> | null = null;
    const reduced = prefersReducedMotion();

    const measure = () => {
      const next = Math.max(1, Math.floor(Math.min(stage.clientWidth, stage.clientHeight)));
      width = next;
      canvas.width = next * 2;
      canvas.height = next * 2;
    };

    measure();

    globe = createGlobe(canvas, {
      devicePixelRatio: 2,
      width: width * 2,
      height: width * 2,
      phi,
      theta: 0.28,
      dark: 1,
      diffuse: 1.6,
      mapSamples: 22000,
      mapBrightness: 3.4,
      mapBaseBrightness: 0.04,
      baseColor: BASE,
      markerColor: ACCENT,
      glowColor: GLOW,
      markers,
      markerElevation: 0.025,
      scale: 1.08,
      offset: [0, 0],
    });

    const pushFrame = () => {
      if (!globe) return;
      if (!reduced) phi += ROTATE_STEP;

      globe.update({
        width: width * 2,
        height: width * 2,
        phi,
      });
    };

    pushFrame();

    if (!reduced) {
      const tick = () => {
        pushFrame();
        frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    }

    const observer = new ResizeObserver(() => {
      measure();
      globe?.update({ width: width * 2, height: width * 2 });
    });
    observer.observe(stage);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      globe?.destroy();
      globe = null;
    };
  }, []);

  return (
    <div ref={stageRef} className={home.globeStage} aria-hidden="true">
      <div className={home.globeMask}>
        <canvas ref={canvasRef} className={home.globeCanvas} />
      </div>
    </div>
  );
}
