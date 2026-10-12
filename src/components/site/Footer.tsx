"use client";

import dynamic from "next/dynamic";
import { pageLinks, profile, socials } from "@/data/profile";
import { HoverLink } from "./HoverLink";
import home from "./home.module.css";
import site from "./site.module.css";

const Globe = dynamic(() => import("./Globe").then((mod) => mod.Globe), {
  ssr: false,
});

export function Footer() {
  return (
    <footer className={home.footer} id="footer">
      <h2 className={site.srOnly}>Contact and globe</h2>
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

      <div className={home.globeWrap}>
        <Globe />
      </div>

      <p className={home.footerName}>
        <span>{profile.givenName}</span>
        <span className={home.family}>{profile.familyName}</span>
        <span className={home.dot} />
      </p>
    </footer>
  );
}
