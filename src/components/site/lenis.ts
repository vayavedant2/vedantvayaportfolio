import type Lenis from "lenis";
import type { ScrollToOptions } from "lenis";
import { scrollFeel } from "@/data/motion";

let instance: Lenis | null = null;

export function getLenis() {
  return instance;
}

export function setLenis(next: Lenis | null) {
  instance = next;
}

export function setLerp(value: number) {
  if (!instance) return;
  instance.options.lerp = value;
}

export function scrollToTarget(
  target: number | string | HTMLElement,
  opts?: ScrollToOptions,
) {
  const lenis = instance;
  if (!lenis) {
    if (typeof target === "number") {
      window.scrollTo({ top: target, behavior: "auto" });
    } else if (typeof target === "string") {
      document.querySelector(target)?.scrollIntoView({ behavior: "auto" });
    } else {
      target.scrollIntoView({ behavior: "auto" });
    }
    return;
  }

  lenis.scrollTo(target, {
    duration: scrollFeel.scrollToDuration,
    ...opts,
  });
}
