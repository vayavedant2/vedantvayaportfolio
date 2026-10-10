import {
  availability,
  contactLinks,
  contactPageCopy,
  contactPrompts,
  profile,
} from "@/data/profile";
import { Poster } from "./Poster";
import { HoverLink } from "./HoverLink";
import { Grain } from "./Rail";
import pages from "./pages.module.css";
import site from "./site.module.css";

export function ContactView() {
  return (
    <>
      <Grain />
      <div className={site.wash} aria-hidden="true" />
      <div className={pages.backdrop} aria-hidden="true">
        <Poster seed={5} title={profile.name} monogram quiet bare />
      </div>
      <main id="content" className={site.page} tabIndex={-1}>
        <header className={site.pageHead}>
          <h1>Contact</h1>
          <HoverLink href="/" className={site.back}>
            Back
          </HoverLink>
        </header>
        <div className={pages.introCard}>
          <h2>{contactPageCopy.kicker}</h2>
          <p>{contactPageCopy.lede}</p>
        </div>
        <div className={pages.facts}>
          <p className={pages.fact}>
            <span>Based in</span>
            <span>{profile.location}</span>
          </p>
          <p className={pages.fact}>
            <span>Status</span>
            <span>{availability.status}</span>
          </p>
          <p className={pages.fact}>
            <span>Avg. response</span>
            <span>{availability.response}</span>
          </p>
        </div>
        <div className={pages.aboutBlock}>
          <p className={pages.eyebrow}>Contact</p>
          <h2 className={pages.display}>{contactPageCopy.title}</h2>
          <p className={pages.role}>{contactPageCopy.role}</p>
          <p className={pages.body}>{contactPageCopy.body}</p>
          <a className={pages.mail} href={`mailto:${profile.contact.email}`}>
            {profile.contact.email}
          </a>
          <nav className={pages.links} aria-label="Contact links">
            {contactLinks.map((item) => (
              <HoverLink key={item.label} href={item.href}>
                {item.label}
              </HoverLink>
            ))}
          </nav>
          <p className={pages.available}>{contactPageCopy.available}</p>
        </div>
        <ul className={pages.prompts}>
          {contactPrompts.map((prompt) => (
            <li key={prompt}>{prompt}</li>
          ))}
        </ul>
      </main>
    </>
  );
}
