"use client";

import { useEffect, useRef } from "react";
import { galleryStatement } from "@/data/profile";
import { works } from "@/data/projects";
import { Poster } from "./Poster";
import { ScrollTrigger } from "./motion";
import { RichText } from "./RichText";
import home from "./home.module.css";
import site from "./site.module.css";

export function Gallery() {
  const rootRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    const root = rootRef.current;
    const stage = stageRef.current;
    if (!root || !stage) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const compact = window.matchMedia("(max-width: 900px)");
    let trigger: ScrollTrigger | null = null;

    const place = (progress: number) => {
      const width = stage.clientWidth;
      const height = stage.clientHeight;
      const tight = compact.matches;
      const radiusX = width * (tight ? 0.36 : 0.4);
      const radiusY = height * (tight ? 0.28 : 0.34);
      const yawAmp = tight ? 48 : 78;
      itemRefs.current.forEach((node, index) => {
        if (!node) return;
        const angle = (index / works.length) * Math.PI * 2 + progress * Math.PI * 1.55 - Math.PI / 2;
        const x = Math.cos(angle) * radiusX;
        const y = Math.sin(angle) * radiusY;
        const depth = (Math.sin(angle) + 1) / 2;
        const scale = (tight ? 0.5 : 0.38) + depth * (tight ? 0.85 : 1.2);
        const yaw = -Math.cos(angle) * yawAmp;
        node.style.zIndex = String(Math.round(depth * 40));
        node.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px) rotateY(${yaw}deg) scale(${scale})`;
      });
    };

    const build = () => {
      trigger?.kill();
      trigger = null;
      place(reduced.matches ? 0.15 : 0);
      if (reduced.matches) return;
      trigger = ScrollTrigger.create({
        trigger: root,
        start: "top top",
        end: () => `+=${window.innerHeight * (compact.matches ? 1.1 : 2.1)}`,
        pin: stage,
        scrub: 0.7,
        anticipatePin: 1,
        onUpdate: (self) => place(self.progress),
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

  return (
    <section id="gallery" ref={rootRef} aria-labelledby="gallery-title">
      <div ref={stageRef} className={home.gallery}>
        <h2 id="gallery-title" className={site.srOnly}>
          Gallery
        </h2>
        <p className={home.kicker} aria-hidden="true">
          Gallery
        </p>
        <p className={home.phrase}>
          <span>
            <RichText parts={galleryStatement} italicClass={site.italic} />
          </span>
        </p>
        {works.map((work, index) => (
          <div
            key={work.id}
            ref={(node) => {
              itemRefs.current[index] = node;
            }}
            className={home.orbit}
            aria-hidden="true"
          >
            <Poster seed={index + 3} title={work.title} kicker={work.poster} bare />
          </div>
        ))}
      </div>
    </section>
  );
}
