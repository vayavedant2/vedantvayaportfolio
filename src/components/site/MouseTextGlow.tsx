"use client";

import { useEffect, type RefObject } from "react";
import { prefersReducedMotion } from "./motion";

type Rgb = { r: number; g: number; b: number };

type MouseTextGlowOptions = {
  glowStartColor?: string;
  animateGlow?: boolean;
  glowBlur?: number;
  glowOpacity?: number;
  softGlowBlur?: number;
  softGlowOpacity?: number;
  enabled?: boolean;
};

function parseColor(input: string): Rgb {
  if (input.startsWith("rgb")) {
    const match = input.match(/rgba?\(([^)]+)\)/);
    if (match) {
      const parts = match[1].split(",").map((part) => Number(part.trim()));
      return { r: parts[0] || 255, g: parts[1] || 255, b: parts[2] || 255 };
    }
  }

  if (input.startsWith("#")) {
    let hex = input.slice(1);
    if (hex.length === 3) {
      hex = hex
        .split("")
        .map((char) => char + char)
        .join("");
    }
    if (hex.length >= 6) {
      return {
        r: Number.parseInt(hex.slice(0, 2), 16),
        g: Number.parseInt(hex.slice(2, 4), 16),
        b: Number.parseInt(hex.slice(4, 6), 16),
      };
    }
  }

  return { r: 255, g: 255, b: 255 };
}

/** Pointer-driven text-shadow glow on the real intro name (no DOM trail copies). */
export function useMouseTextGlow(
  layerRef: RefObject<HTMLElement | null>,
  contentRef: RefObject<HTMLElement | null>,
  {
    animateGlow = true,
    glowBlur = 26,
    glowOpacity = 0.55,
    softGlowBlur = 14,
    softGlowOpacity = 0.28,
    glowStartColor = "#FFFFFF",
    enabled = true,
  }: MouseTextGlowOptions = {},
) {
  useEffect(() => {
    const layer = layerRef.current;
    if (!layer || !enabled) return;

    let horizontal = 1;
    let vertical = 1;
    let pulse = 1;
    let hovering = false;
    let rafId = 0;
    let centerRafId = 0;
    let pulseRafId = 0;
    let disposed = false;

    const glowRgb = parseColor(glowStartColor);

    const paint = () => {
      if (disposed) return;
      const soft = layer.dataset.glowSoft === "true";
      const blur = soft ? softGlowBlur : glowBlur;
      const opacity = (soft ? softGlowOpacity : glowOpacity) * pulse;
      const fontSize = contentRef.current
        ? Number.parseFloat(getComputedStyle(contentRef.current).fontSize) || 96
        : 96;
      const glowOffset = 0.55 * (fontSize / 160);
      const x1 = horizontal * glowOffset;
      const y1 = vertical * glowOffset;
      const x2 = horizontal * glowOffset * 1.6;
      const y2 = vertical * glowOffset * 1.6;
      const glow = `rgba(${glowRgb.r},${glowRgb.g},${glowRgb.b},${opacity})`;

      layer.style.setProperty("--horizontal", String(horizontal));
      layer.style.setProperty("--vertical", String(vertical));

      if (soft) {
        layer.style.setProperty(
          "--name-glow",
          `${x1}px ${y1}px ${blur}px ${glow}, ${x2}px ${y2}px ${blur * 1.6}px ${glow}`,
        );
      } else {
        const x3 = horizontal * glowOffset * 0.4;
        const y3 = vertical * glowOffset * 0.4;
        layer.style.setProperty(
          "--name-glow",
          `${x1}px ${y1}px ${blur}px ${glow}, ${x2}px ${y2}px ${blur * 1.8}px ${glow}, ${x3}px ${y3}px ${Math.round(blur / 3)}px ${glow}`,
        );
      }
    };

    const setDirection = (nextH: number, nextV: number) => {
      horizontal = nextH;
      vertical = nextV;
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(paint);
    };

    const onPointerMove = (event: PointerEvent) => {
      const content = contentRef.current;
      if (!content) return;

      hovering = true;
      if (centerRafId) cancelAnimationFrame(centerRafId);

      const rect = content.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      let nextH =
        x > rect.width / 2
          ? ((x - rect.width / 2) / (rect.width / 2 || 1)) * -1
          : (rect.width / 2 - x) / (rect.width / 2 || 1);
      let nextV =
        y > rect.height / 2
          ? ((y - rect.height / 2) / (rect.height / 2 || 1)) * -1
          : (rect.height / 2 - y) / (rect.height / 2 || 1);

      nextH = Math.max(-1, Math.min(1, nextH));
      nextV = Math.max(-1, Math.min(1, nextV));
      setDirection(nextH, nextV);
    };

    const animateBack = () => {
      const speed = 0.18;
      horizontal += (1 - horizontal) * speed;
      vertical += (1 - vertical) * speed;
      paint();

      if (Math.abs(horizontal - 1) < 0.01 && Math.abs(vertical - 1) < 0.01) {
        horizontal = 1;
        vertical = 1;
        paint();
        return;
      }

      centerRafId = requestAnimationFrame(animateBack);
    };

    const onPointerLeave = () => {
      if (!hovering) return;
      hovering = false;
      if (centerRafId) cancelAnimationFrame(centerRafId);
      centerRafId = requestAnimationFrame(animateBack);
    };

    const softObserver = new MutationObserver(paint);
    softObserver.observe(layer, { attributes: true, attributeFilter: ["data-glow-soft"] });

    paint();

    if (animateGlow && !prefersReducedMotion()) {
      let start = 0;
      const tick = (ts: number) => {
        if (!start) start = ts;
        const t = (ts - start) / 1000;
        pulse = 0.96 + 0.08 * (0.5 + 0.5 * Math.sin(t * 1.6));
        paint();
        pulseRafId = requestAnimationFrame(tick);
      };
      pulseRafId = requestAnimationFrame(tick);
    }

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerleave", onPointerLeave);
    document.documentElement.addEventListener("mouseleave", onPointerLeave);

    return () => {
      disposed = true;
      softObserver.disconnect();
      cancelAnimationFrame(rafId);
      cancelAnimationFrame(centerRafId);
      cancelAnimationFrame(pulseRafId);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
      document.documentElement.removeEventListener("mouseleave", onPointerLeave);
    };
  }, [
    animateGlow,
    contentRef,
    enabled,
    glowBlur,
    glowOpacity,
    glowStartColor,
    layerRef,
    softGlowBlur,
    softGlowOpacity,
  ]);
}
