"use client";

import { useEffect, useRef } from "react";
import { profile } from "@/data/profile";
import { useMouseTextGlow } from "./MouseTextGlow";
import { gsap, prefersReducedMotion } from "./motion";
import { isReady, markReady, resetReady } from "./ready";
import styles from "./site.module.css";

function splitChars(text: string) {
  return Array.from(text).map((char, index) => (
    <span key={`${char}-${index}`} className={styles.nameClip}>
      <span data-reveal="" className={styles.nameChar}>
        {char === " " ? "\u00A0" : char}
      </span>
    </span>
  ));
}

export function Intro() {
  const layerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const givenRef = useRef<HTMLSpanElement>(null);
  const familyRef = useRef<HTMLSpanElement>(null);
  const dotRef = useRef<HTMLSpanElement>(null);
  const introBgRef = useRef<HTMLDivElement>(null);
  const panelDarkRef = useRef<HTMLDivElement>(null);
  const panelRedRef = useRef<HTMLDivElement>(null);

  const givenRest = profile.givenName.slice(1);
  const firstLetter = profile.givenName.slice(0, 1);

  useMouseTextGlow(layerRef, contentRef, {
    animateGlow: true,
    glowStartColor: "#FFFFFF",
    glowBlur: 26,
    glowOpacity: 0.55,
    enabled: true,
  });

  useEffect(() => {
    const layer = layerRef.current;
    const content = contentRef.current;
    const logo = logoRef.current;
    const given = givenRef.current;
    const family = familyRef.current;
    const dot = dotRef.current;
    const introBg = introBgRef.current;
    const panelDark = panelDarkRef.current;
    const panelRed = panelRedRef.current;
    if (!layer || !content || !logo || !given || !family || !dot || !introBg || !panelDark || !panelRed) {
      return;
    }

    // Fresh mount should replay the intro (Fast Refresh / remount).
    resetReady();
    const motionReduced = prefersReducedMotion();
    const nameParts = [logo, given, family, dot];
    const revealEls = content.querySelectorAll<HTMLElement>("[data-reveal]");

    const layoutNames = () => {
      const fs = Number.parseFloat(getComputedStyle(content).fontSize) || 1;
      const gapPx = fs * 0.55;
      const givenLeft = logo.offsetWidth;
      given.style.left = "100%";
      given.style.top = "0";
      const familyLeftPx = givenLeft + given.offsetWidth + gapPx;
      family.style.left = `${familyLeftPx / fs}em`;
      family.style.top = "-0.06em";
      const dotLeftPx = familyLeftPx + family.offsetWidth;
      dot.style.left = `${dotLeftPx / fs}em`;
      dot.style.top = "-0.06em";
    };

    const getTotalWidth = () => {
      layoutNames();
      const left = logo.getBoundingClientRect().left;
      const right = Math.max(
        logo.getBoundingClientRect().right,
        given.getBoundingClientRect().right,
        family.getBoundingClientRect().right,
        dot.getBoundingClientRect().right,
      );
      // Undo current translate so width is content-local.
      const x = Number(gsap.getProperty(content, "x")) || 0;
      void x;
      return Math.max(1, right - left);
    };

    const placeAtBottom = (fontVw?: number) => {
      if (fontVw) {
        const capped = Math.min(fontVw, 16.8);
        content.style.fontSize = `${capped}vw`;
      }
      gsap.set(content, { x: 0, y: 0, scale: 1 });
      layoutNames();
      const totalW = getTotalWidth();
      const offsetX = -(totalW / 2 - logo.offsetWidth / 2);
      const offsetXVw = (offsetX / window.innerWidth) * 100;
      const vh = window.innerHeight;
      // Keep the name in the dark lower band so mix-blend difference stays near-white.
      const bottomPad = window.innerWidth <= 768 ? Math.max(vh * 0.14, 96) : Math.max(vh * 0.18, 120);
      const targetBottom = vh - bottomPad;
      const offsetY = targetBottom - content.offsetHeight / 2 - vh / 2;
      gsap.set(content, { x: `${offsetXVw}vw`, y: offsetY, transformOrigin: "50% 50%" });
    };

    const enableDifferenceBlend = () => {
      gsap.set(layer, { mixBlendMode: "difference" });
      // Soften text-shadow once difference blend is on so it doesn't streak.
      layer.dataset.glowSoft = "true";
    };

    if (motionReduced) {
      gsap.set(nameParts, { opacity: 1 });
      gsap.set(revealEls, { yPercent: 0 });
      gsap.set(dot, { opacity: 1 });
      layer.dataset.glowOpen = "true";
      gsap.set(introBg, { display: "none" });
      gsap.set([panelDark, panelRed], { y: "-100%" });
      placeAtBottom(16.7);
      enableDifferenceBlend();
      markReady();
      return;
    }

    layoutNames();
    gsap.set(logo, { opacity: 1 });
    gsap.set(given, { opacity: 1 });
    gsap.set(family, { opacity: 1 });
    gsap.set(revealEls, { yPercent: 110 });
    gsap.set(dot, { opacity: 0 });
    gsap.set(content, { x: -(getTotalWidth() / 2 - logo.offsetWidth / 2), y: 0, scale: 1 });

    const master = gsap.timeline({ delay: 0.2 });

    master
      .to(revealEls, {
        yPercent: 0,
        duration: 0.4,
        ease: "power3.out",
        stagger: { each: 0.025, from: "center" },
      })
      .add(() => {
        layoutNames();
        layer.dataset.glowOpen = "true";
      })
      .to(dot, { opacity: 1, duration: 0.25, ease: "power2.out" })
      .to({}, { duration: 0.3 })
      .add(() => {
        const mobile = window.innerWidth <= 768;
        const pad = mobile ? 20 : 48;
        const currentW = getTotalWidth();
        const targetW = window.innerWidth - pad * 2;
        const scale = targetW / currentW;
        const visualCenterX = getTotalWidth() / 2;
        const visualCenterY = content.offsetHeight / 2;
        gsap.set(content, { transformOrigin: `${visualCenterX}px ${visualCenterY}px` });

        const vh = window.innerHeight;
        const bottomPad = mobile ? Math.max(vh * 0.18, 110) : Math.max(vh * 0.16, 110);
        const targetBottom = vh - bottomPad;
        const contentRect = content.getBoundingClientRect();
        const curVisualCenterY = contentRect.top + visualCenterY;
        const targetVisualCenterY = targetBottom - (content.offsetHeight * scale) / 2;
        const deltaY = targetVisualCenterY - curVisualCenterY;
        const baseFontSize = Number.parseFloat(getComputedStyle(content).fontSize);
        const newFontSize = baseFontSize * scale;
        const fontVw = (newFontSize / window.innerWidth) * 100;

        gsap.to(content, {
          scale,
          y: `+=${deltaY}`,
          duration: 0.75,
          ease: "power3.inOut",
          onComplete: () => {
            content.style.visibility = "hidden";
            gsap.set(content, { scale: 1, x: 0, y: 0 });
            enableDifferenceBlend();
            placeAtBottom(fontVw);
            content.style.visibility = "visible";
          },
        });
      })
      .to(panelDark, { y: "0%", duration: 0.45, ease: "power3.inOut" }, "<+=0.05")
      .to(panelRed, { y: "0%", duration: 0.45, ease: "power3.inOut" }, "-=0.3")
      .set(introBg, { display: "none" })
      .to(panelRed, { y: "-100%", duration: 0.55, ease: "power3.inOut" }, "+=0.05")
      .to(panelDark, { y: "-100%", duration: 0.55, ease: "power3.inOut" }, "-=0.4")
      .add(() => markReady());

    const onResize = () => {
      if (!isReady()) return;
      const fs = Number.parseFloat(getComputedStyle(content).fontSize);
      const fontVw = (fs / window.innerWidth) * 100;
      placeAtBottom(fontVw);
    };

    const onScroll = () => {
      if (!isReady()) return;
      const hero = document.getElementById("hero");
      if (!hero) return;
      const progress = Math.min(1, Math.max(0, -hero.getBoundingClientRect().top / (hero.offsetHeight * 0.55)));
      gsap.set(layer, { opacity: 1 - progress });
    };

    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      master.kill();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
    };
  }, [firstLetter, givenRest]);

  return (
    <>
      <div ref={introBgRef} className={styles.introBg} aria-hidden="true" />
      <div ref={layerRef} className={styles.nameLayer} aria-hidden="true">
        <div ref={contentRef} className={styles.preloaderContent}>
          <div ref={logoRef} className={styles.preloaderLogo}>
            {splitChars(firstLetter)}
          </div>
          <span ref={givenRef} className={styles.preloaderGiven}>
            {splitChars(givenRest)}
          </span>
          <span ref={familyRef} className={styles.preloaderFamily}>
            {splitChars(` ${profile.familyName}`)}
          </span>
          <span ref={dotRef} className={styles.preloaderDot}>
            .
          </span>
        </div>
      </div>
      <div className={styles.transitionPanel} aria-hidden="true">
        <div ref={panelDarkRef} className={styles.panelDark} />
        <div ref={panelRedRef} className={styles.panelRed} />
      </div>
    </>
  );
}
