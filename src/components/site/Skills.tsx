"use client";

import { useState } from "react";
import { skillsLead } from "@/data/profile";
import { skillGroups } from "@/data/skills";
import { HoverLink } from "./HoverLink";
import home from "./home.module.css";

export function Skills() {
  const [open, setOpen] = useState(skillGroups[0]?.id ?? "");

  return (
    <section id="skills" className={home.skills} aria-labelledby="skills-title">
      <div>
        <p id="skills-title" className={home.skillsLabel}>
          Skills
        </p>
        <p className={home.lead}>{skillsLead}</p>
        <div className={home.skillsLink}>
          <HoverLink href="/contact">Contact me</HoverLink>
          <span aria-hidden="true">✦</span>
        </div>
        <div className={home.wedge} aria-hidden="true" />
      </div>
      <div className={home.groups}>
        {skillGroups.map((group) => {
          const isOpen = group.id === open;
          return (
            <div key={group.id} className={isOpen ? `${home.group} ${home.groupOpen}` : home.group}>
              <h3>
                <button
                  type="button"
                  className={home.groupHeader}
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? "" : group.id)}
                >
                  {group.label}
                  <span className={home.sign} aria-hidden="true">
                    {isOpen ? "–" : "+"}
                  </span>
                </button>
              </h3>
              <div className={home.bodyWrap}>
                <div className={home.body}>
                  <ul className={home.items}>
                    {group.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
