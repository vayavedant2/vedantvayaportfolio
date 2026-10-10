"use client";

import { pageLinks, profile, socials } from "@/data/profile";
import { HoverLink } from "./HoverLink";
import home from "./home.module.css";

const GLYPHS = " ·:;=+*";

function stipple() {
  const cols = 44;
  const rows = 24;
  const lines: string[] = [];
  for (let y = 0; y < rows; y += 1) {
    let line = "";
    for (let x = 0; x < cols; x += 1) {
      const nx = x / (cols - 1);
      const ny = y / (rows - 1);
      const headX = (nx - 0.34) / 0.15;
      const headY = (ny - 0.3) / 0.2;
      const head = Math.exp(-(headX * headX + headY * headY));
      const shoulderX = (nx - 0.36) / 0.38;
      const shoulderY = (ny - 0.78) / 0.3;
      const shoulders = ny > 0.46 ? Math.exp(-(shoulderX * shoulderX * 0.55 + shoulderY * shoulderY)) : 0;
      const fade = 1 - Math.max(0, (nx - 0.5) / 0.5);
      const shade = Math.min(1, (head * 1.2 + shoulders * 0.9) * fade);
      line += shade < 0.08 ? " " : GLYPHS[Math.min(GLYPHS.length - 1, Math.floor(shade * GLYPHS.length))];
    }
    lines.push(line);
  }
  return lines.join("\n");
}

const field = stipple();

export function Footer() {
  return (
    <footer className={home.footer}>
      <div className={home.footerTop}>
        <div>
          <a className={home.footerMail} href={`mailto:${profile.contact.email}`}>
            {profile.contact.email}
          </a>
          <p className={home.year}>© {new Date().getFullYear()}</p>
        </div>
        <nav className={home.footerCol} aria-label="Social">
          {socials.map((item) => (
            <HoverLink key={item.label} href={item.href}>
              {item.label}
            </HoverLink>
          ))}
        </nav>
        <nav className={home.footerCol} aria-label="Pages">
          {pageLinks.map((item) => (
            <HoverLink key={item.href} href={item.href}>
              {item.label}
            </HoverLink>
          ))}
        </nav>
      </div>
      <pre className={home.ascii} aria-hidden="true">{field}</pre>
      <p className={home.footerName}>
        <span>{profile.givenName}</span>
        <span className={home.family}>{profile.familyName}</span>
        <span className={home.dot} />
      </p>
    </footer>
  );
}
