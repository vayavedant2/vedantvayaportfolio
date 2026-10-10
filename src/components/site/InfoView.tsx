import { availability, profile, versionLabel } from "@/data/profile";
import { skillGroups } from "@/data/skills";
import { Frame, Poster } from "./Poster";
import { HoverLink } from "./HoverLink";
import { Grain } from "./Rail";
import pages from "./pages.module.css";
import site from "./site.module.css";

export function InfoView() {
  return (
    <>
      <Grain />
      <div className={site.wash} aria-hidden="true" />
      <div className={pages.backdrop} aria-hidden="true">
        <Poster seed={2} title={profile.name} monogram quiet bare />
      </div>
      <main id="content" className={site.page} tabIndex={-1}>
        <header className={site.pageHead}>
          <h1>Info</h1>
          <HoverLink href="/" className={site.back}>
            Back
          </HoverLink>
        </header>
        <Frame className={pages.portrait}>
          <Poster seed={1} title={profile.name} kicker={profile.location} monogram quiet />
        </Frame>
        <div className={pages.facts}>
          <p className={pages.fact}>
            <span>Based in</span>
            <span>{profile.location}</span>
          </p>
          <p className={pages.fact}>
            <span>Status</span>
            <span>{availability.status}</span>
          </p>
        </div>
        <div className={pages.aboutBlock}>
          <p className={pages.eyebrow}>About</p>
          <h2 className={pages.display}>{profile.name}.</h2>
          <p className={pages.role}>
            {profile.role}, building production web apps, APIs, and AI systems.
          </p>
          <a className={pages.mail} href={`mailto:${profile.contact.email}`}>
            {profile.contact.email}
          </a>
          <p className={pages.body}>{profile.about}</p>
          <p className={pages.versionRow}>→ {versionLabel}</p>
        </div>
        <div className={pages.columns}>
          {skillGroups.map((group) => (
            <section key={group.id} aria-labelledby={`info-${group.id}`}>
              <h2 id={`info-${group.id}`}>{group.label}</h2>
              <ul>
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </main>
    </>
  );
}
