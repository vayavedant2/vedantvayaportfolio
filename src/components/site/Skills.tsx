"use client";

import { useEffect, useRef, useState } from "react";
import { skillsLead } from "@/data/profile";
import { skillGroups } from "@/data/skills";
import { HoverLink } from "./HoverLink";
import { gsap, isCompactLayout, prefersReducedMotion, ScrollTrigger } from "./motion";
import home from "./home.module.css";

export function Skills() {
  const [open, setOpen] = useState(skillGroups[0]?.id ?? "");
  const sectionRef = useRef<HTMLElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLDivElement>(null);
  const bodyRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const openRef = useRef(open);
  openRef.current = open;

  useEffect(() => {
    const firstId = skillGroups[0]?.id;
    if (!firstId) return;
    const firstBody = bodyRefs.current.get(firstId);
    if (!firstBody) return;
    firstBody.style.height = `${firstBody.scrollHeight}px`;
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const left = leftRef.current;
    const arrow = arrowRef.current;
    if (!section || !left || !arrow) return;

    let tween: gsap.core.Tween | null = null;

    const build = () => {
      tween?.scrollTrigger?.kill();
      tween?.kill();
      tween = null;
      gsap.set(arrow, { clearProps: "transform,x,xPercent" });

      if (prefersReducedMotion() || isCompactLayout()) return;

      tween = gsap.fromTo(
        arrow,
        { xPercent: 0, x: 0 },
        {
          xPercent: 100,
          x: () => {
            const styles = getComputedStyle(left);
            const pad =
              parseFloat(styles.paddingLeft) + parseFloat(styles.paddingRight);
            return left.clientWidth - pad - arrow.offsetWidth;
          },
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            endTrigger: "#contact",
            end: "top center",
            scrub: 0.5,
          },
        },
      );
    };

    build();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const compact = window.matchMedia("(max-width: 900px)");
    reduced.addEventListener("change", build);
    compact.addEventListener("change", build);
    window.addEventListener("resize", build);

    return () => {
      tween?.scrollTrigger?.kill();
      tween?.kill();
      reduced.removeEventListener("change", build);
      compact.removeEventListener("change", build);
      window.removeEventListener("resize", build);
    };
  }, []);

  const openGroup = (id: string) => {
    if (id === openRef.current) return;

    const prevId = openRef.current;
    const prevBody = bodyRefs.current.get(prevId);
    const nextBody = bodyRefs.current.get(id);
    if (!nextBody) return;

    const reduced = prefersReducedMotion();
    const duration = reduced ? 0 : 0.45;

    if (prevBody) {
      gsap.to(prevBody, { height: 0, duration, ease: "power3.inOut" });
    }

    gsap.to(nextBody, {
      height: nextBody.scrollHeight,
      duration,
      ease: "power3.inOut",
      onComplete: () => {
        ScrollTrigger.refresh();
      },
    });

    setOpen(id);
  };

  return (
    <section
      id="skills"
      ref={sectionRef}
      className={home.skills}
      aria-labelledby="skills-title"
    >
      <div className={home.skillsInner}>
        <div ref={leftRef} className={home.skillsLeft}>
          <p id="skills-title" className={home.skillsLabel}>
            Skills
          </p>
          <p className={home.lead}>{skillsLead}</p>
          <div className={home.skillsSeparator} aria-hidden="true" />
          <div className={home.skillsLink}>
            <HoverLink href="/contact">Contact me</HoverLink>
            <span aria-hidden="true">✦</span>
          </div>
          <div ref={arrowRef} className={home.skillsArrow} aria-hidden="true">
            <svg viewBox="0 0 84 85" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M11 38H54L37 21H51L73 43L51 65H37L54 48H11Z" />
            </svg>
          </div>
        </div>

        <div className={home.skillsRight}>
          {skillGroups.map((group) => {
            const isOpen = group.id === open;
            return (
              <div
                key={group.id}
                className={isOpen ? `${home.group} ${home.groupOpen}` : home.group}
              >
                <h3>
                  <button
                    type="button"
                    className={home.groupHeader}
                    aria-expanded={isOpen}
                    onClick={() => openGroup(group.id)}
                  >
                    <span className={home.groupTitle}>{group.label}</span>
                    <span className={home.sign} aria-hidden="true" />
                  </button>
                </h3>
                <div
                  className={home.body}
                  ref={(node) => {
                    if (node) bodyRefs.current.set(group.id, node);
                    else bodyRefs.current.delete(group.id);
                  }}
                >
                  <ul className={home.items}>
                    {group.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
