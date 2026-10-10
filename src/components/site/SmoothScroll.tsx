"use client";

import { useEffect, useRef } from "react";
import type Lenis from "lenis";
import { gsap, prefersReducedMotion, ScrollTrigger } from "./motion";
import { isReady, onReady } from "./ready";

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (prefersReducedMotion()) {
      ScrollTrigger.refresh();
      return;
    }

    let removeTicker = () => {};
    let removeReady = () => {};
    let cancelled = false;

    const start = async () => {
      const { default: LenisCtor } = await import("lenis");
      if (cancelled) return;

      const lenis = new LenisCtor({
        lerp: 0.085,
        smoothWheel: true,
      });
      lenisRef.current = lenis;
      if (!isReady()) lenis.stop();

      lenis.on("scroll", ScrollTrigger.update);
      const tick = (time: number) => {
        lenis.raf(time * 1000);
      };
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      removeTicker = () => gsap.ticker.remove(tick);
      removeReady = onReady(() => {
        lenis.start();
        ScrollTrigger.refresh();
      });
      ScrollTrigger.refresh();
    };

    void start();

    return () => {
      cancelled = true;
      removeTicker();
      removeReady();
      lenisRef.current?.destroy();
      lenisRef.current = null;
    };
  }, []);

  return children;
}
