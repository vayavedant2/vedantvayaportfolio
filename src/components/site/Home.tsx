"use client";

import { About } from "./About";
import { Awards } from "./Awards";
import { ContactBand } from "./ContactBand";
import { Footer } from "./Footer";
import { Gallery } from "./Gallery";
import { Hero } from "./Hero";
import { Intro } from "./Intro";
import { Projects } from "./Projects";
import { Grain } from "./Rail";
import { Skills } from "./Skills";
import { SmoothScroll } from "./SmoothScroll";

export function Home() {
  return (
    <SmoothScroll>
      <Grain />
      <Intro />
      <main id="content" tabIndex={-1}>
        <Hero />
        <About />
        <Projects />
        <Gallery />
        <Skills />
        <Awards />
        <ContactBand />
        <Footer />
      </main>
    </SmoothScroll>
  );
}
