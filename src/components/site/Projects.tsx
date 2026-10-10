"use client";

import { useEffect, useRef, useState } from "react";
import { works } from "@/data/projects";
import { Poster } from "./Poster";
import { isCompactLayout, prefersReducedMotion, ScrollTrigger } from "./motion";
import home from "./home.module.css";
import site from "./site.module.css";

export function Projects() {
  const rootRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const lineRef = useRef<SVGPathElement>(null);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);

  useEffect(() => {
    const root = rootRef.current;
    const stage = stageRef.current;
    if (!root || !stage) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const compact = window.matchMedia("(max-width: 900px)");
    let trigger: ScrollTrigger | null = null;

    const paint = (progress: number) => {
      const line = lineRef.current;
      const list = listRef.current;
      if (line) {
        const length = line.getTotalLength();
        if (length > 0) {
          const drawn = reduced.matches ? 1 : 0.18 + progress * 0.7;
          line.style.strokeDasharray = `${length}`;
          line.style.strokeDashoffset = `${length * (1 - drawn)}`;
        }
      }
      if (!list || reduced.matches || compact.matches) {
        if (list) list.style.transform = "";
        return;
      }
      const row = list.querySelector("li");
      const rowHeight = row?.getBoundingClientRect().height ?? 52;
      const cursor = progress * (works.length - 1);
      const mid = (works.length - 1) / 2;
      list.style.transform = `translateY(${(mid - cursor) * rowHeight}px)`;
      [...list.children].forEach((node, index) => {
        const distance = Math.abs(index - cursor);
        (node as HTMLElement).style.opacity = String(Math.max(0.2, 1 - distance * 0.34));
      });
    };

    const build = () => {
      trigger?.kill();
      trigger = null;
      paint(reduced.matches ? 0.35 : 0);
      if (reduced.matches || compact.matches) return;

      trigger = ScrollTrigger.create({
        trigger: root,
        start: "top top",
        end: () => `+=${window.innerHeight * works.length * 0.48}`,
        pin: stage,
        scrub: 0.6,
        anticipatePin: 1,
        onUpdate: (self) => {
          paint(self.progress);
          const next = Math.round(self.progress * (works.length - 1));
          if (next !== activeRef.current) {
            activeRef.current = next;
            setActive(next);
          }
        },
      });
    };

    build();
    reduced.addEventListener("change", build);
    compact.addEventListener("change", build);
    return () => {
      trigger?.kill();
      reduced.removeEventListener("change", build);
      compact.removeEventListener("change", build);
    };
  }, []);

  const select = (index: number) => {
    activeRef.current = index;
    setActive(index);
    const root = rootRef.current;
    if (!root || prefersReducedMotion() || isCompactLayout()) return;
    const pin = ScrollTrigger.getAll().find((item) => item.trigger === root);
    if (!pin) return;
    const progress = works.length === 1 ? 0 : index / (works.length - 1);
    const y = pin.start + (pin.end - pin.start) * progress;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  const work = works[active];

  return (
    <section id="projects" ref={rootRef} className={home.projects} aria-labelledby="projects-title">
      <div ref={stageRef} className={home.projectStage}>
        <svg className={home.arc} viewBox="0 0 640 1000" preserveAspectRatio="none" aria-hidden="true">
          <path ref={lineRef} d="M70 1080C250 820 260 640 130 470C20 320 30 160 110 -40" />
        </svg>
        <div className={home.projectCopy}>
          <h2 id="projects-title" className={site.srOnly}>
            Projects
          </h2>
          <p className={home.kicker} aria-hidden="true">
            Projects
          </p>
          <ul ref={listRef} className={home.list}>
            {works.map((item, index) => {
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    className={home.rowButton}
                    aria-current={index === active ? "true" : undefined}
                    onClick={() => select(index)}
                  >
                    {index === active ? (
                      <span className={home.count}>({String(index + 1).padStart(2, "0")})</span>
                    ) : null}
                    <strong>{item.title}</strong>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
        <article className={home.preview} aria-live="polite">
          <div className={home.previewMeta}>
            <span>{work.year}</span>
            <span>Preview</span>
          </div>
          <div className={home.previewCard} key={work.id}>
            <Poster seed={active + 1} title={work.title} kicker={work.poster} bare />
          </div>
        </article>
      </div>
    </section>
  );
}
