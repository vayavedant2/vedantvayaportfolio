"use client";

import { useEffect, useRef } from "react";
import { heroProject } from "@/data/heroProject";
import { prefersReducedMotion } from "./motion";

type CoreRendererApi = {
  init: () => Promise<unknown>;
  destroy: () => void;
};

declare global {
  interface Window {
    CoreRenderer?: CoreRendererApi;
  }
}

let scriptPromise: Promise<CoreRendererApi> | null = null;

function loadCoreRenderer(): Promise<CoreRendererApi> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("CoreRenderer requires a browser"));
  }
  if (window.CoreRenderer) return Promise.resolve(window.CoreRenderer);
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>('script[data-core-renderer="1"]');
    if (existing) {
      existing.addEventListener("load", () => {
        if (window.CoreRenderer) resolve(window.CoreRenderer);
        else reject(new Error("CoreRenderer failed to load"));
      });
      existing.addEventListener("error", () => reject(new Error("CoreRenderer script error")));
      return;
    }

    const script = document.createElement("script");
    script.src = "/vendor/core-renderer.js";
    script.async = true;
    script.dataset.coreRenderer = "1";
    script.onload = () => {
      if (window.CoreRenderer) resolve(window.CoreRenderer);
      else reject(new Error("CoreRenderer failed to load"));
    };
    script.onerror = () => reject(new Error("CoreRenderer script error"));
    document.head.appendChild(script);
  });

  return scriptPromise;
}

export function FluidWash({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container || prefersReducedMotion()) return;

    let cancelled = false;
    let blobUrl: string | null = null;

    const wakeInteractivity = () => {
      const event = new MouseEvent("mousemove", {
        clientX: window.innerWidth * 0.55,
        clientY: window.innerHeight * 0.35,
        bubbles: true,
      });
      window.dispatchEvent(event);
      window.dispatchEvent(new Event("scroll"));
    };

    void (async () => {
      try {
        const CoreRenderer = await loadCoreRenderer();
        if (cancelled || !ref.current) return;

        blobUrl = URL.createObjectURL(
          new Blob([JSON.stringify(heroProject)], { type: "application/json" }),
        );
        container.setAttribute("data-cr-project-src", blobUrl);
        container.removeAttribute("data-cr-initialized");
        container.removeAttribute("data-scene-id");
        container.replaceChildren();

        await CoreRenderer.init();
        if (cancelled) return;

        URL.revokeObjectURL(blobUrl);
        blobUrl = null;
        wakeInteractivity();
      } catch (error) {
        console.error("Hero CoreRenderer init failed:", error);
      }
    })();

    return () => {
      cancelled = true;
      if (blobUrl) URL.revokeObjectURL(blobUrl);
      window.CoreRenderer?.destroy();
      container.removeAttribute("data-cr-project-src");
      container.removeAttribute("data-cr-initialized");
      container.removeAttribute("data-scene-id");
      container.replaceChildren();
    };
  }, []);

  return <div ref={ref} className={className} aria-hidden="true" />;
}
