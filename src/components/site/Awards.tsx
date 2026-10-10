"use client";

import { useEffect, useRef } from "react";
import { awards } from "@/data/profile";
import home from "./home.module.css";

export function Awards() {
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const rows = [...list.querySelectorAll<HTMLLIElement>("li")];

    const update = () => {
      const mid = window.innerHeight * 0.52;
      let best = 0;
      let bestDistance = Number.POSITIVE_INFINITY;
      rows.forEach((row, index) => {
        const box = row.getBoundingClientRect();
        const distance = Math.abs(box.top + box.height / 2 - mid);
        if (distance < bestDistance) {
          bestDistance = distance;
          best = index;
        }
      });
      rows.forEach((row, index) => {
        row.classList.toggle(home.awardOn, index === best);
      });
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <section className={home.awards} aria-labelledby="awards-title">
      <h2 id="awards-title" className={home.awardsTitle}>
        Awards & Misc
      </h2>
      <ul ref={listRef} className={home.awardList}>
        {awards.map((award, index) => (
          <li key={`${award.outlet}-${award.label}-${index}`} className={home.awardRow}>
            <span>{award.outlet}</span>
            <span>{award.subject}</span>
            <span className={home.awardLabel}>{award.label}</span>
            <span>{award.date}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
