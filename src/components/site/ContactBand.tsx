import { contactBlocks, profile, socials } from "@/data/profile";
import { Frame, Poster } from "./Poster";
import { HoverLink } from "./HoverLink";
import { RichText } from "./RichText";
import home from "./home.module.css";
import site from "./site.module.css";

export function ContactBand() {
  return (
    <section id="contact" className={home.contact} aria-labelledby="contact-title">
      <div className={home.sheet}>
        <div className={home.sheetGrid}>
          <h2 id="contact-title" className={home.contactTitle}>
            Contact
          </h2>
          <p className={`${home.block} ${home.blockTop}`}>
            <RichText parts={contactBlocks[0]} italicClass={site.italic} />
          </p>
          <Frame className={home.frameTop}>
            <Poster seed={4} title="Systems" kicker="Open" monogram />
          </Frame>
          <div className={home.sheetSocials}>
            {socials.map((item) => (
              <HoverLink key={item.label} href={item.href}>
                {item.label}
              </HoverLink>
            ))}
          </div>
          <Frame className={home.frameBottom}>
            <Poster seed={6} title="Jaipur" kicker="2026" />
          </Frame>
          <p className={`${home.block} ${home.blockBottom}`}>
            <RichText parts={contactBlocks[1]} italicClass={site.italic} />
          </p>
          <a className={home.mail} href={`mailto:${profile.contact.email}`}>
            {profile.contact.email}
          </a>
        </div>
      </div>
    </section>
  );
}
