"use client";

import { useEffect, useRef, useState } from "react";
import { railSections } from "@/data/profile";
import styles from "./site.module.css";

export function Rail() {
  const [active, setActive] = useState<(typeof railSections)[number]["id"]>(railSections[0].id);
  const progressRef = useRef<HTMLParagraphElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? window.scrollY / max : 0;
      if (progressRef.current) {
        progressRef.current.textContent = `(${String(Math.round(progress * 100)).padStart(2, "0")})`;
      }
      if (fillRef.current) fillRef.current.style.height = `${progress * 100}%`;

      const mark = window.innerHeight * 0.42;
      let current: (typeof railSections)[number]["id"] = railSections[0].id;
      for (const section of railSections) {
        const node = document.getElementById(section.id);
        if (!node) continue;
        if (node.getBoundingClientRect().top <= mark) current = section.id;
      }
      setActive((previous) => (previous === current ? previous : current));
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
    <>
      <p ref={progressRef} className={styles.progress} aria-hidden="true">
        (00)
      </p>
      <nav className={styles.rail} aria-label="Sections">
        <span className={styles.railLine}>
          <span ref={fillRef} className={styles.railFill} />
        </span>
        {railSections.map((section, index) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            className={section.id === active ? styles.railLabelOn : styles.railLabel}
            style={{ top: `${((index + 0.5) / railSections.length) * 100}%` }}
          >
            {section.label}
          </a>
        ))}
      </nav>
    </>
  );
}

export function Grain() {
  return <div className={styles.grain} aria-hidden="true" />;
}
