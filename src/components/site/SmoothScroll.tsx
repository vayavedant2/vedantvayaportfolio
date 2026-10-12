"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import type Lenis from "lenis";
import { scrollFeel } from "@/data/motion";
import { setLenis } from "./lenis";
import { gsap, prefersReducedMotion, ScrollTrigger } from "./motion";
import { isPending, onPendingChange, onReady } from "./ready";

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (prefersReducedMotion()) {
      ScrollTrigger.refresh();
      return;
    }

    let removeTicker = () => {};
    let removeReady = () => {};
    let removePending = () => {};
    let cancelled = false;

    const start = async () => {
      const { default: LenisCtor } = await import("lenis");
      if (cancelled) return;

      const lenis = new LenisCtor({
        lerp: scrollFeel.lerp,
        smoothWheel: true,
        anchors: { duration: scrollFeel.scrollToDuration },
      });
      lenisRef.current = lenis;
      setLenis(lenis);

      if (isPending()) lenis.stop();

      lenis.on("scroll", ScrollTrigger.update);
      const tick = (time: number) => {
        lenis.raf(time * 1000);
      };
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      removeTicker = () => gsap.ticker.remove(tick);

      removePending = onPendingChange((pending) => {
        if (pending) {
          lenis.stop();
          return;
        }
        lenis.start();
        ScrollTrigger.refresh();
      });

      removeReady = onReady(() => {
        if (!isPending()) {
          lenis.start();
          ScrollTrigger.refresh();
        }
      });

      ScrollTrigger.refresh();
    };

    void start();

    return () => {
      cancelled = true;
      removeTicker();
      removeReady();
      removePending();
      lenisRef.current?.destroy();
      lenisRef.current = null;
      setLenis(null);
    };
  }, []);

  useEffect(() => {
    const lenis = lenisRef.current;
    if (!lenis) {
      ScrollTrigger.refresh();
      return;
    }
    lenis.scrollTo(0, { immediate: true });
    ScrollTrigger.refresh();
  }, [pathname]);

  return children;
}
