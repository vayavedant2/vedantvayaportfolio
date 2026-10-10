"use client";

import { useEffect, useRef } from "react";
import { aboutStatement, aboutSub, versionLabel, type RichPart } from "@/data/profile";
import { HoverLink } from "./HoverLink";
import { gsap, prefersReducedMotion } from "./motion";
import { Poster } from "./Poster";
import home from "./home.module.css";
import site from "./site.module.css";

function Statement({ parts }: { parts: RichPart[] }) {
  return parts.flatMap((part, partIndex) =>
    part.text.split(/(\s+)/).map((bit, bitIndex) =>
      bit.trim() ? (
        <span
          key={`${partIndex}-${bitIndex}`}
          data-word=""
          className={part.italic ? site.italic : undefined}
        >
          {bit}
        </span>
      ) : (
        <span key={`${partIndex}-${bitIndex}`}>{bit}</span>
      ),
    ),
  );
}

export function About() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || prefersReducedMotion()) return;
    const words = section.querySelectorAll<HTMLElement>("[data-word]");
    gsap.set(words, { opacity: 0.18, y: 14, filter: "blur(7px)" });
    const tween = gsap.to(words, {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      stagger: 0.12,
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top 72%",
        end: "center 48%",
        scrub: 0.6,
      },
    });
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
    <section id="about" ref={sectionRef} className={home.about} aria-labelledby="about-title">
      <div>
        <h2 id="about-title" className={site.srOnly}>
          About
        </h2>
        <p className={home.kicker} aria-hidden="true">
          About
        </p>
        <p className={home.statement}>
          <Statement parts={aboutStatement} />
        </p>
        <p className={home.sub}>{aboutSub}</p>
        <div className={home.aboutRow}>
          <HoverLink href="/info">Learn more</HoverLink>
          <span className={home.versionMark}>→ {versionLabel}</span>
        </div>
      </div>
      <div className={home.aboutVisual} aria-hidden="true">
        <div className={home.aboutGlow} />
        <div className={home.aboutPoster}>
          <Poster seed={2} title="Vedant Vaya" kicker="Jaipur" monogram />
        </div>
      </div>
    </section>
  );
}
