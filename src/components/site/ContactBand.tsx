"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { contactBlocks, profile, socials } from "@/data/profile";
import { HoverLink } from "./HoverLink";
import { gsap, ScrollTrigger } from "./motion";
import { RichText } from "./RichText";
import home from "./home.module.css";
import site from "./site.module.css";

const contactSocials = socials.filter((item) => item.label !== "Email");

function FrameCorners() {
  return (
    <>
      <span className={`${site.mark} ${site.tl}`} aria-hidden="true" />
      <span className={`${site.mark} ${site.tr}`} aria-hidden="true" />
      <span className={`${site.mark} ${site.bl}`} aria-hidden="true" />
      <span className={`${site.mark} ${site.br}`} aria-hidden="true" />
    </>
  );
}

export function ContactBand() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const blobWrapRef = useRef<HTMLDivElement>(null);
  const blobRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const socialsRef = useRef<HTMLElement>(null);
  const mailRef = useRef<HTMLAnchorElement>(null);
  const dispoRef = useRef<HTMLDivElement>(null);
  const dispo2Ref = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const frameImgRef = useRef<HTMLDivElement>(null);
  const frame2Ref = useRef<HTMLDivElement>(null);
  const frameImg2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const blobWrap = blobWrapRef.current;
    const blob = blobRef.current;
    const bg = bgRef.current;
    const title = titleRef.current;
    const socialsEl = socialsRef.current;
    const mailEl = mailRef.current;
    const dispo = dispoRef.current;
    const frame = frameRef.current;
    const frameImg = frameImgRef.current;
    const dispo2 = dispo2Ref.current;
    const frame2 = frame2Ref.current;
    const frameImg2 = frameImg2Ref.current;
    if (
      !section ||
      !blobWrap ||
      !blob ||
      !bg ||
      !title ||
      !socialsEl ||
      !mailEl ||
      !dispo ||
      !frame ||
      !frameImg ||
      !dispo2 ||
      !frame2 ||
      !frameImg2
    ) {
      return;
    }

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const compact = window.matchMedia("(max-width: 900px)");
    const triggers: ScrollTrigger[] = [];
    let timeline: gsap.core.Timeline | null = null;

    const setVisible = (visible: boolean) => {
      blobWrap.style.visibility = visible ? "visible" : "hidden";
      bg.style.display = visible ? "block" : "none";
    };

    const paintStatic = () => {
      gsap.set(blob, { scale: 1, xPercent: -50, yPercent: 0 });
      gsap.set(title, { x: 0, clearProps: "transform" });
      gsap.set([socialsEl, mailEl], { clipPath: "inset(0 0 0% 0)" });
      gsap.set([dispo, dispo2], {
        yPercent: -50,
        y: 0,
        opacity: 1,
        clipPath: "inset(0% 0 0% 0)",
        clearProps: compact.matches ? "transform" : "",
      });
      gsap.set([frame, frame2], { yPercent: -50, y: 0, clearProps: "transform" });
      gsap.set([frameImg, frameImg2], { yPercent: -20 });
      setVisible(true);
    };

    const build = () => {
      timeline?.scrollTrigger?.kill();
      timeline?.kill();
      timeline = null;
      triggers.forEach((item) => item.kill());
      triggers.length = 0;

      gsap.set(blob, { scale: 0, xPercent: -50, yPercent: 50, clearProps: "x,y" });
      setVisible(false);

      if (reduced.matches) {
        paintStatic();
        return;
      }

      triggers.push(
        ScrollTrigger.create({
          trigger: section,
          start: "top bottom",
          end: "bottom bottom",
          onEnter: () => setVisible(true),
          onLeave: () => setVisible(false),
          onEnterBack: () => setVisible(true),
          onLeaveBack: () => setVisible(false),
        }),
      );

      timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom bottom",
          scrub: true,
        },
      });

      timeline.fromTo(blob, { scale: 0 }, { scale: 1, duration: 0.6, ease: "none" }, 0);

      if (compact.matches) {
        // Mobile CSS centers the title with translateX(-50%) !important —
        // skip the desktop x-slide so GSAP doesn't fight that.
        gsap.set(title, { clearProps: "transform,x" });
      } else {
        gsap.set(title, {
          x: () => window.innerWidth * 1.1,
        });
        timeline.to(title, { x: 0, duration: 0.3, ease: "power3.out" }, 0.18);
      }

      timeline.fromTo(
        socialsEl,
        { clipPath: "inset(0 0 100% 0)" },
        { clipPath: "inset(0 0 0% 0)", duration: 0.2, ease: "none" },
        0.28,
      );
      timeline.fromTo(
        mailEl,
        { clipPath: "inset(0 0 100% 0)" },
        { clipPath: "inset(0 0 0% 0)", duration: 0.2, ease: "none" },
        0.36,
      );

      if (compact.matches) {
        gsap.set([dispo, dispo2], {
          yPercent: 0,
          y: 0,
          opacity: 1,
          clipPath: "inset(0% 0 0% 0)",
          clearProps: "transform",
        });
        return;
      }

      const pairStart = 0.22;
      const frameDur = 0.65;
      const frameY = () => window.innerHeight * 1.1;
      const frameYEnd = () => -window.innerHeight * 1.4;
      const dispoY = () => window.innerHeight * 1.1;
      const dispoYEnd = () => -window.innerHeight * 1.65;

      gsap.set(frame, { yPercent: -50, y: frameY });
      gsap.set(frameImg, { yPercent: -30 });
      timeline.to(frame, { y: frameYEnd, duration: frameDur, ease: "none" }, pairStart);
      timeline.to(frameImg, { yPercent: 30, duration: frameDur, ease: "none" }, pairStart);

      gsap.set(dispo, {
        yPercent: -50,
        y: dispoY,
        opacity: 1,
        clipPath: "inset(0% 0 0% 0)",
      });
      timeline.to(dispo, { y: dispoYEnd, duration: frameDur, ease: "none" }, pairStart);
      timeline.to(
        dispo,
        { opacity: 0, clipPath: "inset(100% 0 0% 0)", duration: 0.15, ease: "power2.in" },
        pairStart + 0.45,
      );

      gsap.set(frame2, { yPercent: -50, y: () => window.innerHeight * 1.3 });
      gsap.set(frameImg2, { yPercent: -30 });
      timeline.to(frame2, { y: frameYEnd, duration: frameDur, ease: "none" }, pairStart + 0.07);
      timeline.to(frameImg2, { yPercent: 30, duration: frameDur, ease: "none" }, pairStart + 0.07);

      gsap.set(dispo2, {
        yPercent: -50,
        y: frameY,
        opacity: 1,
        clipPath: "inset(0% 0 0% 0)",
      });
      timeline.to(dispo2, { y: frameYEnd, duration: frameDur, ease: "none" }, pairStart);
      timeline.to(
        dispo2,
        { opacity: 0, clipPath: "inset(100% 0 0% 0)", duration: 0.15, ease: "power2.in" },
        pairStart + 0.45,
      );
    };

    build();
    reduced.addEventListener("change", build);
    compact.addEventListener("change", build);
    window.addEventListener("resize", build);

    return () => {
      timeline?.scrollTrigger?.kill();
      timeline?.kill();
      triggers.forEach((item) => item.kill());
      reduced.removeEventListener("change", build);
      compact.removeEventListener("change", build);
      window.removeEventListener("resize", build);
    };
  }, []);

  return (
    <>
      <div ref={bgRef} className={home.contactBg} aria-hidden="true" />
      <div ref={blobWrapRef} className={home.contactBlobWrap} aria-hidden="true">
        <div ref={blobRef} className={home.contactBlob} />
      </div>
      <section
        id="contact"
        ref={sectionRef}
        className={home.contact}
        aria-labelledby="contact-title"
      >
        <div className={home.contactPin}>
          <h2 id="contact-title" ref={titleRef} className={home.contactTitle}>
            Contact
          </h2>

          <div ref={dispoRef} className={`${home.contactDispo} ${home.contactDispoOne}`}>
            <p>
              <RichText parts={contactBlocks[0]} italicClass={site.italic} />
            </p>
          </div>

          <div ref={frameRef} className={home.contactFrame} aria-hidden="true">
            <div ref={frameImgRef} className={home.contactFrameMedia}>
              <Image
                src="/images/contact/frame-1.png"
                alt=""
                width={1400}
                height={1920}
                className={home.contactFrameImg}
                sizes="25vw"
              />
            </div>
            <FrameCorners />
          </div>

          <div ref={dispo2Ref} className={`${home.contactDispo} ${home.contactDispoTwo}`}>
            <p>
              <RichText parts={contactBlocks[1]} italicClass={site.italic} />
            </p>
          </div>

          <div
            ref={frame2Ref}
            className={`${home.contactFrame} ${home.contactFrameTwo}`}
            aria-hidden="true"
          >
            <div ref={frameImg2Ref} className={home.contactFrameMedia}>
              <Image
                src="/images/contact/frame-2.png"
                alt=""
                width={1400}
                height={1920}
                className={home.contactFrameImg}
                sizes="25vw"
              />
            </div>
            <FrameCorners />
          </div>

          <div className={home.contactBottom}>
            <nav ref={socialsRef} className={home.contactSocials} aria-label="Social">
              {contactSocials.map((item) => (
                <HoverLink key={item.label} href={item.href} onLight>
                  {item.label}
                </HoverLink>
              ))}
            </nav>
            <a
              ref={mailRef}
              className={home.contactMail}
              href={`mailto:${profile.contact.email}`}
            >
              {profile.contact.email}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
