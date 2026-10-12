"use client";

import { useEffect, useRef, useState } from "react";
import { scrollFeel } from "@/data/motion";
import { works } from "@/data/projects";
import { Poster } from "./Poster";
import { scrollToTarget, setLerp } from "./lenis";
import { gsap, isCompactLayout, prefersReducedMotion, ScrollTrigger } from "./motion";
import { onReady } from "./ready";
import home from "./home.module.css";
import site from "./site.module.css";

function coverSrc(work: (typeof works)[number]) {
  return work.cover?.replace(/\?v=\d+$/, "") ?? "";
}

function ProjectCover({ work, seed }: { work: (typeof works)[number]; seed: number }) {
  if (work.cover) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        className={home.previewCover}
        src={coverSrc(work)}
        alt=""
        width={1200}
        height={800}
        loading="eager"
        decoding="async"
        aria-hidden="true"
      />
    );
  }

  return (
    <div className={home.previewFallback}>
      <Poster seed={seed} title={work.title} kicker={work.poster} bare />
    </div>
  );
}

export function Projects() {
  const rootRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<SVGPathElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const activeRef = useRef(-1);
  const [active, setActive] = useState(0);
  const [previewVisible, setPreviewVisible] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    const list = listRef.current;
    const preview = previewRef.current;
    const card = cardRef.current;
    if (!root || !list || !preview || !card) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const compact = window.matchMedia("(max-width: 900px)");
    const triggers: ScrollTrigger[] = [];
    const quickX: Array<((v: number) => void) | null> = [];
    let tiltRY = 0;
    let tiltRX = 0;
    let tiltTargetRY = 0;
    let tiltTargetRX = 0;
    let ticker: gsap.TickerCallback | null = null;

    const setActiveIndex = (index: number) => {
      if (index === activeRef.current) return;
      activeRef.current = index;
      setActive(index);
    };

    const paintLine = (progress: number) => {
      const line = lineRef.current;
      if (!line) return;
      const length = line.getTotalLength();
      if (length <= 0) return;
      const drawn = reduced.matches ? 1 : Math.max(0, Math.min(1, progress));
      line.style.strokeDasharray = `${length}`;
      line.style.strokeDashoffset = `${length * (1 - drawn)}`;
    };

    const syncFromScroll = () => {
      const cy = window.innerHeight / 2;
      const halfH = window.innerHeight / 2;
      const spread = compact.matches ? Math.min(window.innerWidth * 0.2, 72) : 80;
      let closestIdx = -1;
      let closestDist = Infinity;

      itemRefs.current.forEach((item, i) => {
        if (!item) return;
        const rect = item.getBoundingClientRect();
        const itemCy = rect.top + rect.height / 2;
        const dist = Math.abs(itemCy - cy);
        const x = reduced.matches ? 0 : Math.min(dist / halfH, 1) * spread;
        const qx = quickX[i];
        if (qx) qx(x);
        else item.style.transform = `translateX(${x}px)`;
        if (dist < closestDist) {
          closestDist = dist;
          closestIdx = i;
        }
      });

      if (closestIdx >= 0 && closestDist < window.innerHeight * 0.45) {
        setActiveIndex(closestIdx);
      }
    };

    const build = () => {
      triggers.splice(0).forEach((t) => t.kill());
      quickX.length = 0;
      if (ticker) {
        gsap.ticker.remove(ticker);
        ticker = null;
      }
      card.style.transform = "";
      tiltRY = tiltRX = tiltTargetRY = tiltTargetRX = 0;
      itemRefs.current.forEach((item) => {
        if (item) gsap.set(item, { x: 0 });
      });

      itemRefs.current.forEach((item) => {
        if (!item || reduced.matches) {
          quickX.push(null);
          return;
        }
        quickX.push(gsap.quickTo(item, "x", { duration: 0.6, ease: "power2.out" }));
      });

      if (compact.matches) {
        setPreviewVisible(true);
      } else {
        triggers.push(
          ScrollTrigger.create({
            trigger: root,
            start: "top 80%",
            end: "bottom 20%",
            onEnter: () => setPreviewVisible(true),
            onLeave: () => setPreviewVisible(false),
            onEnterBack: () => setPreviewVisible(true),
            onLeaveBack: () => setPreviewVisible(false),
          }),
        );
      }

      triggers.push(
        ScrollTrigger.create({
          trigger: root,
          start: "top 70%",
          end: "bottom 20%",
          scrub: 1,
          onUpdate: (self) => paintLine(self.progress),
        }),
      );

      triggers.push(
        ScrollTrigger.create({
          trigger: root,
          start: "top bottom",
          end: "bottom top",
          onUpdate: syncFromScroll,
          onRefresh: syncFromScroll,
        }),
      );

      if (!reduced.matches && !compact.matches) {
        itemRefs.current.forEach((item) => {
          if (!item) return;
          triggers.push(
            ScrollTrigger.create({
              trigger: item,
              start: "top 52%",
              end: "bottom 48%",
              onEnter: () => setLerp(scrollFeel.focusLerp),
              onLeave: () => setLerp(scrollFeel.lerp),
              onEnterBack: () => setLerp(scrollFeel.focusLerp),
              onLeaveBack: () => setLerp(scrollFeel.lerp),
            }),
          );
        });

        ticker = () => {
          if (!preview.classList.contains(home.previewVisible)) return;
          tiltRY += (tiltTargetRY - tiltRY) * 0.12;
          tiltRX += (tiltTargetRX - tiltRX) * 0.12;
          card.style.transform =
            `rotateY(${tiltRY.toFixed(2)}deg) rotateX(${tiltRX.toFixed(2)}deg)`;
        };
        gsap.ticker.add(ticker);
      }

      paintLine(compact.matches && reduced.matches ? 1 : 0);
      syncFromScroll();
      ScrollTrigger.refresh();
    };

    const onMove = (event: MouseEvent) => {
      if (compact.matches || reduced.matches || !preview.classList.contains(home.previewVisible)) {
        return;
      }
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const ry = Math.max(-1, Math.min(1, (event.clientX - cx) / (rect.width / 2 || 1)));
      const rx = Math.max(-1, Math.min(1, (event.clientY - cy) / (rect.height / 2 || 1)));
      tiltTargetRY = ry * 6;
      tiltTargetRX = -rx * 5;
    };

    const stopReady = onReady(() => {
      build();
      ScrollTrigger.refresh();
    });
    window.addEventListener("mousemove", onMove);
    reduced.addEventListener("change", build);
    compact.addEventListener("change", build);

    return () => {
      stopReady();
      triggers.splice(0).forEach((t) => t.kill());
      setLerp(scrollFeel.lerp);
      if (ticker) gsap.ticker.remove(ticker);
      window.removeEventListener("mousemove", onMove);
      reduced.removeEventListener("change", build);
      compact.removeEventListener("change", build);
    };
  }, []);

  const select = (index: number) => {
    activeRef.current = index;
    setActive(index);
    const item = itemRefs.current[index];
    if (!item || prefersReducedMotion() || isCompactLayout()) return;
    const top = item.getBoundingClientRect().top + window.scrollY;
    const y = top - window.innerHeight / 2 + item.offsetHeight / 2;
    scrollToTarget(y, { duration: scrollFeel.scrollToDuration });
  };

  const work = works[active] ?? works[0];

  return (
    <section id="projects" ref={rootRef} className={home.projects} aria-labelledby="projects-title">
      <svg
        className={home.arc}
        viewBox="0 0 1400 1400"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <path
          ref={lineRef}
          d="M -80,0 C 300,-20 600,150 540,400 C 490,650 0,655 300,1050 C 600,1385 650,1250 850,1200 C 1050,1150 1350,1250 1540,1300"
        />
      </svg>

      <div className={home.projectsInner}>
        <div ref={listRef} className={home.projectsList}>
          <h2 id="projects-title" className={site.srOnly}>
            Projects
          </h2>
          <p className={home.kicker} aria-hidden="true">
            Projects
          </p>
          {works.map((item, index) => (
            <button
              key={item.id}
              type="button"
              ref={(node) => {
                itemRefs.current[index] = node;
              }}
              className={`${home.projItem}${index === active ? ` ${home.projItemActive}` : ""}`}
              aria-current={index === active ? "true" : undefined}
              onClick={() => select(index)}
            >
              {item.title}
            </button>
          ))}
        </div>
      </div>

      <div
        ref={previewRef}
        className={`${home.projPreview}${previewVisible ? ` ${home.previewVisible}` : ""}`}
        aria-hidden={!previewVisible}
      >
        <div ref={cardRef} className={home.projCard}>
          <div className={home.previewMeta}>
            <span>{work.year}</span>
            <span>{work.href ? "Site" : "Preview"}</span>
          </div>
          <div className={home.previewMedia} key={work.id}>
            <ProjectCover work={work} seed={active + 1} />
            {work.href ? (
              <a
                className={home.previewVisit}
                href={work.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className={site.srOnly}>Open {work.title}</span>
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
