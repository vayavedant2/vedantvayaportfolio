const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const siteUrl = rawSiteUrl.replace(/\/$/, "");

export const site = {
  url: siteUrl,
  name: "Vedant Vaya",
  title: "Vedant Vaya — Full Stack Web Developer",
  description:
    "Vedant Vaya, Full Stack Web Developer building production web apps with TypeScript, React, Next.js, Node.js, and FastAPI.",
};

export function buildJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${siteUrl}/#person`,
        name: "Vedant Vaya",
        jobTitle: "Full Stack Web Developer",
        email: "vayavedant2@gmail.com",
        telephone: "+91-94601-83250",
        url: siteUrl,
        address: {
          "@type": "PostalAddress",
          addressLocality: "Jaipur",
          addressRegion: "Rajasthan",
          addressCountry: "IN",
        },
        sameAs: [
          "https://github.com/vayavedant2",
          "https://www.linkedin.com/in/vedant-vaya-902991212",
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        name: "Vedant Vaya",
        url: siteUrl,
        description: site.description,
        publisher: { "@id": `${siteUrl}/#person` },
      },
    ],
  };
}
