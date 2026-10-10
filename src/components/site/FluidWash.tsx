"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "./motion";

export function FluidWash({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const context = canvas.getContext("2d", { alpha: false });
    if (!context) return;

    const reduced = prefersReducedMotion();
    let frame = 0;

    const paint = (time: number) => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      context.fillStyle = "#0a0a0a";
      context.fillRect(0, 0, width, height);

      const t = reduced ? 0 : time * 0.00008;
      // Keep mass in the upper/mid field so the lower name band stays near-black.
      const blobs = [
        { x: 0.8, y: 0.28, r: 0.7, c0: [210, 28, 18], a: 0.98 },
        { x: 0.6, y: 0.38, r: 0.55, c0: [160, 22, 14], a: 0.8 },
        { x: 0.92, y: 0.14, r: 0.42, c0: [255, 72, 28], a: 0.6 },
        { x: 0.48, y: 0.44, r: 0.42, c0: [110, 14, 10], a: 0.55 },
        { x: 0.72, y: 0.16, r: 0.34, c0: [190, 42, 18], a: 0.48 },
      ] as const;

      for (const blob of blobs) {
        const x = (blob.x + Math.sin(t + blob.y * 7) * 0.04) * width;
        const y = (blob.y + Math.cos(t * 0.85 + blob.x * 5) * 0.05) * height;
        const radius = blob.r * Math.max(width, height);
        const [r, g, b] = blob.c0;
        const gradient = context.createRadialGradient(x, y, 0, x, y, radius);
        gradient.addColorStop(0, `rgba(${r},${g},${b},${blob.a})`);
        gradient.addColorStop(0.35, `rgba(${r},${g},${b},${blob.a * 0.45})`);
        gradient.addColorStop(0.7, `rgba(${Math.max(0, r - 40)},${g},${b},${blob.a * 0.12})`);
        gradient.addColorStop(1, "rgba(10,10,10,0)");
        context.fillStyle = gradient;
        context.fillRect(0, 0, width, height);
      }

      // Soft vignette so edges fall into black like the reference canvas.
      const vignette = context.createRadialGradient(
        width * 0.62,
        height * 0.32,
        Math.min(width, height) * 0.12,
        width * 0.55,
        height * 0.4,
        Math.max(width, height) * 0.72,
      );
      vignette.addColorStop(0, "rgba(10,10,10,0)");
      vignette.addColorStop(1, "rgba(10,10,10,0.78)");
      context.fillStyle = vignette;
      context.fillRect(0, 0, width, height);

      const bottomFade = context.createLinearGradient(0, height * 0.55, 0, height);
      bottomFade.addColorStop(0, "rgba(10,10,10,0)");
      bottomFade.addColorStop(1, "rgba(10,10,10,0.92)");
      context.fillStyle = bottomFade;
      context.fillRect(0, 0, width, height);
    };

    const draw = (time: number) => {
      paint(time);
      frame = window.requestAnimationFrame(draw);
    };

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      canvas.width = Math.max(1, Math.floor(width * ratio));
      canvas.height = Math.max(1, Math.floor(height * ratio));
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      // Cheap blur approximation via soft draws; CSS filter does the heavy lift.
      if (reduced) paint(0);
    };

    resize();
    if (!reduced) frame = window.requestAnimationFrame(draw);
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
