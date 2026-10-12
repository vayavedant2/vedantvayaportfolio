export type Work = {
  id: string;
  title: string;
  category: string;
  year: string;
  summary: string;
  stack: string[];
  poster: string;
  href?: string;
  embed?: boolean;
  cover?: string;
};

export const works: Work[] = [
  {
    id: "petz",
    title: "Petz",
    category: "Client site",
    year: "2026",
    summary:
      "AI-powered preventive pet-health assessment — personalized profiles, risk signals, and clear next steps for pet parents.",
    stack: ["React", "Next.js", "TypeScript"],
    poster: "Client",
    href: "https://petz.love/",
    cover: "/images/gallery/petz.webp",
  },
  {
    id: "healia",
    title: "Healia",
    category: "Client site",
    year: "2026",
    summary:
      "Cellular health platform UI — lab intelligence, biomarker storytelling, and membership conversion flows.",
    stack: ["React", "Next.js", "TypeScript", "Vercel"],
    poster: "Health",
    href: "https://healia-frontend.vercel.app/",
    cover: "/images/gallery/healia.webp",
  },
  {
    id: "dharwin-one",
    title: "Dharwin One",
    category: "Product",
    year: "2026",
    summary:
      "AI workspace uniting projects, tasks, files, and agents — human-in-the-loop collaboration for faster team delivery.",
    stack: ["React", "Next.js", "TypeScript", "AI"],
    poster: "Product",
    href: "https://dharwinone.ai/",
    cover: "/images/gallery/dharwin-one.webp",
  },
  {
    id: "first-round",
    title: "First Round",
    category: "Product",
    year: "2026",
    summary:
      "Waitlist landing for a curated discovery and real-world meetup app — dark UI, glass card, and phone mockups.",
    stack: ["React", "Next.js", "TypeScript"],
    poster: "Product",
    cover: "/images/gallery/first-round.webp",
  },
  {
    id: "labexpert",
    title: "LabExpert",
    category: "Client site",
    year: "2026",
    summary:
      "Production web app for LabExpert, delivered with MVC structure and reusable interface components.",
    stack: ["React", "Next.js", "TypeScript", "MVC"],
    poster: "Product",
  },
  {
    id: "bois",
    title: "Bois & Chiffon",
    category: "SEO / AI",
    year: "2026",
    summary:
      "AI-powered SEO content tool using LLM prompt engineering, built to support technical SEO and organic growth.",
    stack: ["TypeScript", "Prompt Engineering", "Technical SEO", "LLM"],
    poster: "SEO",
    href: "https://www.boisetchiffons.fr/",
    embed: false,
    cover: "/images/gallery/bois.webp",
  },
  {
    id: "dharwin",
    title: "DharwinBusinessSolutions",
    category: "Client site",
    year: "2026",
    summary:
      "Production web app for DharwinBusinessSolutions, delivered on schedule with Agile sprints and a maintainable component structure.",
    stack: ["React", "Next.js", "TypeScript", "PHP"],
    poster: "Client",
    href: "https://dharwinbusinesssolutions.com/",
    cover: "/images/gallery/dharwin.webp",
  },
  {
    id: "techdossier",
    title: "TechDossier",
    category: "Editorial",
    year: "2026",
    summary:
      "Technology news and analysis site covering AI, startups, cybersecurity, and funding — built for speed and readable editorial layouts.",
    stack: ["Next.js", "React", "TypeScript", "CMS"],
    poster: "Editorial",
    href: "https://techdossier.org/",
    cover: "/images/gallery/techdossier.webp",
  },
  {
    id: "lagom",
    title: "Studio Lagom Design",
    category: "Branding",
    year: "2026",
    summary:
      "Branding-focused studio site for strategic identities, packaging, and digital experiences with a calm, intentional presence.",
    stack: ["Next.js", "React", "TypeScript", "GSAP"],
    poster: "Studio",
    href: "https://studiolagomdesign.com/",
    cover: "/images/gallery/lagom.webp",
  },
  {
    id: "arya-heights",
    title: "Arya Heights",
    category: "Client site",
    year: "2026",
    summary:
      "Project marketing site for Arya Heights — 3 & 4 BHK residences in Hapur — with amenities, floor plans, and enquiry flows.",
    stack: ["Next.js", "React", "TypeScript"],
    poster: "Real estate",
    href: "https://arya-heights.divyanshindia.com/",
    cover: "/images/gallery/arya-heights.webp",
  },
  {
    id: "divyansh",
    title: "Divyansh India",
    category: "Client site",
    year: "2026",
    summary:
      "Developer corporate site for Divyansh India showcasing Delhi NCR residential projects, trust signals, and enquiry conversion.",
    stack: ["Next.js", "React", "TypeScript"],
    poster: "Real estate",
    href: "https://divyanshindia.com/",
  },
  {
    id: "madhavam",
    title: "Madhavam",
    category: "Client site",
    year: "2026",
    summary:
      "Luxury plotted development site for Madhavam in Rajnagar Extension — gallery, site plans, connectivity, and lead capture.",
    stack: ["Next.js", "React", "TypeScript", "Vercel"],
    poster: "Real estate",
    href: "https://madhvamtype2.vercel.app/",
    cover: "/images/gallery/madhavam.webp",
  },
  {
    id: "veda-recycling",
    title: "Veda Recycling",
    category: "Client site",
    year: "2026",
    summary:
      "Industrial manufacturing site for refined lead and lead alloys — process storytelling, products, and global presence.",
    stack: ["Next.js", "React", "TypeScript"],
    poster: "Industrial",
    href: "https://vedarecycling.com/",
    cover: "/images/gallery/veda-recycling.webp",
  },
  {
    id: "rag",
    title: "RAG Document Retrieval",
    category: "AI system",
    year: "2026",
    summary:
      "Document retrieval over PDF and text, using LangChain with PostgreSQL and pgvector for semantic search.",
    stack: ["Python", "LangChain", "PostgreSQL", "pgvector"],
    poster: "Retrieval",
  },
];

export const galleryWorks = works.filter(
  (work): work is Work & { cover: string } => Boolean(work.cover),
);
