"use client";

import { useEffect, useRef, useState } from "react";
import { scrollFeel } from "@/data/motion";
import { works } from "@/data/projects";
import { Grain } from "./Rail";
import { HoverLink } from "./HoverLink";
import { scrollToTarget } from "./lenis";
import { isCompactLayout, prefersReducedMotion, ScrollTrigger } from "./motion";
import { Poster } from "./Poster";
import pages from "./pages.module.css";
import site from "./site.module.css";

const STEP = 360 / works.length;

export function WorksView() {
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const cubeRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [flat, setFlat] = useState(false);
  const indexRef = useRef(0);

  useEffect(() => {
    const root = rootRef.current;
    const stage = stageRef.current;
    const viewport = viewportRef.current;
    const cube = cubeRef.current;
    if (!root || !stage || !viewport || !cube) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const compact = window.matchMedia("(max-width: 900px)");
    let trigger: ScrollTrigger | null = null;

    const turn = (progress: number, depth: number) => {
      const angle = progress * (works.length - 1) * STEP;
      cube.style.transform = `translateZ(${-depth}px) rotateX(${-angle}deg)`;
    };

    const build = () => {
      trigger?.kill();
      trigger = null;
      const isFlat = reduced.matches || compact.matches;
      setFlat(isFlat);
      const depth = (viewport.clientHeight / 2) / Math.tan(Math.PI / works.length);
      cube.style.setProperty("--depth", `${depth}px`);
      if (isFlat) {
        cube.style.transform = "";
        return;
      }
      turn(0, depth);
      trigger = ScrollTrigger.create({
        trigger: root,
        start: "top top",
        end: () => `+=${window.innerHeight * works.length * 0.55}`,
        pin: stage,
        scrub: 0.55,
        anticipatePin: 1,
        onUpdate: (self) => {
          turn(self.progress, depth);
          const next = Math.round(self.progress * (works.length - 1));
          if (next !== indexRef.current) {
            indexRef.current = next;
            setIndex(next);
          }
        },
      });
    };

    build();
    reduced.addEventListener("change", build);
    compact.addEventListener("change", build);
    window.addEventListener("resize", build);
    return () => {
      trigger?.kill();
      reduced.removeEventListener("change", build);
      compact.removeEventListener("change", build);
      window.removeEventListener("resize", build);
    };
  }, []);

  const select = (next: number) => {
    indexRef.current = next;
    setIndex(next);
    const root = rootRef.current;
    if (!root || prefersReducedMotion() || isCompactLayout()) return;
    const pin = ScrollTrigger.getAll().find((item) => item.trigger === root);
    if (!pin) return;
    const progress = works.length === 1 ? 0 : next / (works.length - 1);
    scrollToTarget(pin.start + (pin.end - pin.start) * progress, {
      duration: scrollFeel.scrollToDuration,
    });
  };

  return (
    <>
      <Grain />
      <div className={site.wash} aria-hidden="true" />
      <main id="content" tabIndex={-1}>
        <h1 className={site.srOnly}>Selected work by Vedant Vaya</h1>
        <div ref={rootRef} className={pages.stageWrap}>
          <div ref={stageRef} className={pages.stage}>
            <header className={`${site.pageHead} ${pages.workHead}`}>
              <p className={pages.workTitle}>Work</p>
              <HoverLink href="/" className={site.back}>
                Back
              </HoverLink>
            </header>
            <div ref={viewportRef} className={pages.viewport}>
              <div className={pages.scene}>
                <div ref={cubeRef} className={`${pages.cube} ${flat ? pages.cubeFlat : ""}`}>
                  {works.map((work, itemIndex) => (
                    <article
                      key={work.id}
                      aria-hidden={itemIndex === index ? undefined : true}
                      className={`${pages.face} ${flat && itemIndex === index ? pages.faceOn : ""}`}
                      style={
                        flat
                          ? undefined
                          : {
                              transform: `rotateX(${itemIndex * STEP}deg) translateZ(var(--depth))`,
                            }
                      }
                    >
                      <div className={pages.faceCover}>
                        <Poster seed={itemIndex + 2} title={work.title} kicker={work.poster} quiet bare />
                        <h2 className={pages.faceTitle}>{work.title}</h2>
                      </div>
                      <div className={pages.faceInfo}>
                        <p className={pages.category}>{work.category}</p>
                        <p className={pages.year}>{work.year}</p>
                        <p className={pages.summary}>{work.summary}</p>
                        <ul className={pages.pills}>
                          {work.stack.map((item) => (
                            <li key={item} className={pages.pill}>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>
            <ol className={pages.index}>
              {works.map((item, itemIndex) => (
                <li key={item.id}>
                  <button
                    type="button"
                    aria-current={itemIndex === index ? "true" : undefined}
                    onClick={() => select(itemIndex)}
                  >
                    / {String(itemIndex + 1).padStart(2, "0")}
                  </button>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </main>
    </>
  );
}
