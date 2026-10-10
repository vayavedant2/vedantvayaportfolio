"use client";

import { useEffect, useRef } from "react";
import { heroTagline, pageLinks, profile, socials, versionLabel } from "@/data/profile";
import { FluidWash } from "./FluidWash";
import { HoverLink } from "./HoverLink";
import { gsap, prefersReducedMotion } from "./motion";
import { onReady } from "./ready";
import { RichText } from "./RichText";
import home from "./home.module.css";
import site from "./site.module.css";

function ArrowIcon() {
  return (
    <svg
      className={home.versionArrow}
      viewBox="0 0 84 85"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M11 38H54L37 21H51L73 43L51 65H37L54 48H11Z" />
    </svg>
  );
}

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const tagline = taglineRef.current;
    const line = lineRef.current;
    const bar = barRef.current;
    if (!section || !tagline || !line || !bar) return;

    if (prefersReducedMotion()) {
      gsap.set(section, { opacity: 1 });
      gsap.set([tagline, bar], { opacity: 1, clipPath: "inset(0 0 0% 0)" });
      gsap.set(line, { opacity: 1, scaleX: 1 });
      return;
    }

    gsap.set(section, { opacity: 0 });
    gsap.set([tagline, bar], { opacity: 0, clipPath: "inset(0 0 100% 0)" });
    gsap.set(line, { opacity: 1, scaleX: 0, transformOrigin: "left center" });

    let tl: gsap.core.Timeline | null = null;
    const stop = onReady(() => {
      tl = gsap.timeline();
      tl.set(section, { opacity: 1 })
        .to(tagline, {
          opacity: 1,
          clipPath: "inset(0 0 0% 0)",
          duration: 1.1,
          ease: "power3.inOut",
        })
        .to(
          bar,
          {
            opacity: 1,
            clipPath: "inset(0 0 0% 0)",
            duration: 1.0,
            ease: "power3.inOut",
          },
          "-=0.8",
        )
        .to(line, { scaleX: 1, duration: 1.0, ease: "power3.inOut" }, "<");
    });

    return () => {
      stop();
      tl?.kill();
    };
  }, []);

  return (
    <section ref={sectionRef} className={home.hero} id="hero" aria-labelledby="hero-title">
      <h1 id="hero-title" className={site.srOnly}>
        {profile.name}, {profile.role} in {profile.location}, building production web apps with
        TypeScript, React, Next.js, Node.js, and FastAPI.
      </h1>
      <div className={home.heroCanvas}>
        <FluidWash className={home.wash} />
      </div>
      <div className={home.heroContent}>
        <div ref={taglineRef} className={home.tagline}>
          <RichText parts={heroTagline} italicClass={home.otherAccent} />
        </div>
        <div ref={lineRef} className={home.heroLine} aria-hidden="true" />
        <div ref={barRef} className={home.bar}>
          <div className={home.barLeft}>
            <span className={home.version}>
              <ArrowIcon />
              {versionLabel}
            </span>
          </div>
          <nav className={home.barCenter} aria-label="Social">
            {socials.map((item, index) => (
              <span key={item.label} className={home.socialItem}>
                {index > 0 ? (
                  <span className={home.slash} aria-hidden="true">
                    /
                  </span>
                ) : null}
                <HoverLink href={item.href}>{item.label}</HoverLink>
              </span>
            ))}
          </nav>
          <nav className={home.barRight} aria-label="Primary">
            {pageLinks.map((item) => (
              <HoverLink key={item.href} href={item.href}>
                {item.label}
              </HoverLink>
            ))}
          </nav>
        </div>
      </div>
    </section>
  );
}
