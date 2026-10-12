"use client";

import { useEffect, useRef } from "react";
import { galleryStatement, type RichPart } from "@/data/profile";
import { galleryWorks } from "@/data/projects";
import { useMouseTextGlow } from "./MouseTextGlow";
import { ScrollTrigger } from "./motion";
import { onReady } from "./ready";
import home from "./home.module.css";
import site from "./site.module.css";

const SLICES = 10;
const STAGGER = 0.09;

type Pos = { x: number; y: number; z: number; rotY: number };

function getPos(t: number, vw: number, rx: number, rz: number, tiltY: number): Pos {
  const entryAngle = Math.PI / 2;
  const offX = vw * 0.85;

  if (t <= 0.12) {
    const p = t / 0.12;
    return { x: -offX * (1 - p), y: tiltY, z: rz * p, rotY: 0 };
  }
  if (t <= 0.88) {
    const p = (t - 0.12) / 0.76;
    const angle = entryAngle - p * Math.PI * 2;
    const x = Math.cos(angle) * rx;
    const z = Math.sin(angle) * rz;
    return { x, y: (z / rz) * tiltY, z, rotY: p * Math.PI * 2 };
  }
  const p = (t - 0.88) / 0.12;
  return { x: offX * p, y: tiltY, z: rz * (1 - p), rotY: Math.PI * 2 };
}

function phraseWords(parts: RichPart[]) {
  const words: { text: string; italic?: boolean }[] = [];
  for (const part of parts) {
    for (const token of part.text.split(/(\s+)/)) {
      if (!token || /^\s+$/.test(token)) continue;
      words.push({ text: token, italic: part.italic });
    }
  }
  return words;
}

function buildSlices(card: HTMLElement, cover: string, vw: number) {
  const imgW = Math.min(Math.max(120, vw * 0.14), 210);
  const imgH = (imgW * 2) / 3;
  const orbitR = (vw * 0.34 + 500) / 2;
  const bendRad = imgW / orbitR;
  const sliceW = imgW / SLICES;
  const totalBendDeg = (bendRad * 180) / Math.PI;
  const stepDeg = totalBendDeg / SLICES;
  const src = cover.replace(/\?v=\d+$/, "");

  card.style.width = `${imgW}px`;
  card.replaceChildren();
  for (let s = 0; s < SLICES; s++) {
    const sl = document.createElement("div");
    sl.className = home.cgSlice;
    sl.setAttribute("aria-hidden", "true");
    const displayW = sliceW + 1.5;
    sl.style.width = `${displayW.toFixed(1)}px`;
    sl.style.left = "50%";
    sl.style.marginLeft = `${(-displayW / 2).toFixed(1)}px`;
    sl.style.backgroundImage = `url("${src}")`;
    sl.style.backgroundSize = `${imgW.toFixed(1)}px ${imgH.toFixed(1)}px`;
    sl.style.backgroundPosition = `${(-s * sliceW).toFixed(1)}px 0`;
    sl.style.transformOrigin = `50% 50% ${(-orbitR).toFixed(1)}px`;
    const angle = (s - (SLICES - 1) / 2) * stepDeg;
    sl.style.transform = `rotateY(${angle.toFixed(2)}deg)`;
    card.appendChild(sl);
  }
}

const words = phraseWords(galleryStatement);

export function Gallery() {
  const rootRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const phraseRef = useRef<HTMLParagraphElement>(null);
  const wordRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const itemRefs = useRef<Array<HTMLDivElement | null>>([]);

  useMouseTextGlow(phraseRef, phraseRef, {
    animateGlow: true,
    glowStartColor: "#FFFFFF",
    glowBlur: 14,
    glowOpacity: 0.28,
    softGlowBlur: 10,
    softGlowOpacity: 0.18,
  });

  useEffect(() => {
    const root = rootRef.current;
    const stage = stageRef.current;
    const phrase = phraseRef.current;
    if (!root || !stage || !phrase) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const compact = window.matchMedia("(max-width: 900px)");
    let trigger: ScrollTrigger | null = null;
    const count = galleryWorks.length;
    const totalRange = 1 + STAGGER * Math.max(0, count - 1);

    const paintPhrase = (progress: number, forceVisible: boolean) => {
      const phraseStart = 0.25;
      const phraseEnd = 0.75;
      const travelY = 200;

      if (forceVisible) {
        phrase.style.opacity = "1";
        phrase.style.transform = "translateY(0px)";
        wordRefs.current.forEach((w) => {
          if (!w) return;
          w.style.opacity = "1";
          w.style.filter = "blur(0px)";
        });
        return;
      }

      if (progress < phraseStart || progress > phraseEnd) {
        phrase.style.opacity = "0";
        return;
      }

      const globalP = (progress - phraseStart) / (phraseEnd - phraseStart);
      phrase.style.transform = `translateY(${(travelY * (0.5 - globalP)).toFixed(1)}px)`;

      const revealEnd = 0.4;
      wordRefs.current.forEach((w, wi) => {
        if (!w) return;
        if (globalP < revealEnd) {
          const revealP = globalP / revealEnd;
          const wordT = revealP * (words.length + 4) - wi;
          const wP = Math.max(0, Math.min(1, wordT / 3));
          w.style.opacity = String(wP);
          w.style.filter = `blur(${(8 * (1 - wP)).toFixed(1)}px)`;
        } else {
          w.style.opacity = "1";
          w.style.filter = "blur(0px)";
        }
      });

      let alpha = 1;
      if (globalP < 0.1) alpha = globalP / 0.1;
      else if (globalP > 0.75) alpha = (1 - globalP) / 0.25;
      phrase.style.opacity = String(alpha);
    };

    const place = (progress: number, interactive: boolean) => {
      const vw = window.innerWidth;
      const rx = vw * 0.34;
      const rz = 500;
      const tiltY = vw <= 768 ? 80 : 180;

      itemRefs.current.forEach((img, i) => {
        if (!img) return;
        const imgT = progress * totalRange - i * STAGGER;
        const href = galleryWorks[i]?.href;

        if (imgT <= 0 || imgT >= 1) {
          img.style.opacity = "0";
          img.style.pointerEvents = "none";
          img.dataset.clickable = "0";
          return;
        }

        let alpha = 1;
        if (imgT < 0.06) alpha = imgT / 0.06;
        else if (imgT > 0.94) alpha = (1 - imgT) / 0.06;

        const pos = getPos(imgT, vw, rx, rz, tiltY);
        const rotDeg = ((pos.rotY * 180) / Math.PI).toFixed(1);
        // Match lukebaffait.fr: translate3d only — pin is flex-centered, no left/top offset
        img.style.transform =
          `translate3d(${pos.x.toFixed(1)}px,${pos.y.toFixed(1)}px,${pos.z.toFixed(1)}px)` +
          ` rotateY(${rotDeg}deg)`;
        img.style.opacity = String(alpha);
        img.style.zIndex = String(Math.round(pos.z + 600));

        const canClick =
          interactive && Boolean(href) && imgT > 0.06 && imgT < 0.94 && alpha > 0.85;
        img.style.pointerEvents = canClick ? "auto" : "none";
        img.dataset.clickable = canClick ? "1" : "0";
        img.style.cursor = canClick ? "pointer" : "default";
      });
    };

    const onCardClick = (event: MouseEvent) => {
      const card = (event.currentTarget as HTMLElement);
      if (card.dataset.clickable !== "1") return;
      const href = card.dataset.href;
      if (!href) return;
      window.open(href, "_blank", "noopener,noreferrer");
    };

    const rebuildSlices = () => {
      const vw = window.innerWidth;
      itemRefs.current.forEach((card, i) => {
        if (!card) return;
        buildSlices(card, galleryWorks[i].cover, vw);
      });
    };

    const build = () => {
      trigger?.kill();
      trigger = null;

      if (compact.matches) {
        itemRefs.current.forEach((img) => {
          if (!img) return;
          img.style.opacity = "0";
          img.style.pointerEvents = "none";
          img.style.transform = "";
          img.dataset.clickable = "0";
        });
        paintPhrase(0.5, true);
        return;
      }

      rebuildSlices();

      if (reduced.matches) {
        place(0.42, true);
        paintPhrase(0.5, true);
        return;
      }

      place(0, false);
      paintPhrase(0, false);

      trigger = ScrollTrigger.create({
        trigger: root,
        start: "top top",
        end: "bottom bottom",
        pin: stage,
        scrub: true,
        anticipatePin: 1,
        onUpdate: (self) => {
          place(self.progress, true);
          paintPhrase(self.progress, false);
        },
      });
    };

    itemRefs.current.forEach((card) => {
      card?.addEventListener("click", onCardClick);
    });

    const stopReady = onReady(() => {
      build();
      ScrollTrigger.refresh();
    });
    reduced.addEventListener("change", build);
    compact.addEventListener("change", build);
    window.addEventListener("resize", build);
    return () => {
      stopReady();
      trigger?.kill();
      itemRefs.current.forEach((card) => {
        card?.removeEventListener("click", onCardClick);
      });
      reduced.removeEventListener("change", build);
      compact.removeEventListener("change", build);
      window.removeEventListener("resize", build);
    };
  }, []);

  return (
    <section id="gallery" ref={rootRef} className={home.gallery} aria-labelledby="gallery-title">
      <div ref={stageRef} className={home.galleryPin}>
        <h2 id="gallery-title" className={site.srOnly}>
          Gallery
        </h2>
        {galleryWorks.map((work, index) => (
          <div
            key={work.id}
            ref={(node) => {
              itemRefs.current[index] = node;
            }}
            className={home.cgCard}
            data-href={work.href ?? ""}
            role={work.href ? "link" : undefined}
            tabIndex={work.href ? -1 : undefined}
            aria-label={work.href ? `Open ${work.title}` : undefined}
            style={{ opacity: 0 }}
          />
        ))}
        <p ref={phraseRef} className={home.phrase} aria-hidden="true">
          {words.map((word, index) => (
            <span key={`${word.text}-${index}`}>
              {index > 0 ? " " : null}
              <span
                ref={(node) => {
                  wordRefs.current[index] = node;
                }}
                className={`${home.phraseWord}${word.italic ? ` ${site.italic}` : ""}`}
              >
                {word.text}
              </span>
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
