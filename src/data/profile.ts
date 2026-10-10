export const profile = {
  name: "Vedant Vaya",
  givenName: "Vedant",
  familyName: "Vaya",
  monogram: "VV",
  role: "Full Stack Web Developer",
  location: "Jaipur, India",
  locationLong: "Jaipur, Rajasthan, India",
  about:
    "Full Stack Web Developer with hands-on production experience in TypeScript, React, Next.js, Node.js, and FastAPI. Delivered commercial web applications for 5+ client brands following MVC architecture and Agile sprint workflows. Strong communicator and collaborative team player with a proven ability to problem-solve under deadlines. Built RESTful APIs with JWT/OAuth 2.0 authentication, CI/CD pipelines with Docker, and LLM-powered RAG systems using LangChain. Passionate about writing clean, maintainable code and continuously learning new technologies.",
  contact: {
    phoneDisplay: "+91 94601 83250",
    phone: "+919460183250",
    email: "vayavedant2@gmail.com",
    github: "https://github.com/vayavedant2",
    githubLabel: "github.com/vayavedant2",
    linkedin: "https://www.linkedin.com/in/vedant-vaya-902991212",
    linkedinLabel: "linkedin.com/in/vedant-vaya-902991212",
  },
  education: {
    degree: "Bachelor of Technology (B.Tech)",
    field: "Computer Science Engineering",
    institution: "JECRC University",
    location: "Jaipur, Rajasthan",
    dates: "2022 – 2026",
    start: "2022",
    end: "2026",
  },
};

export const versionLabel = "V1.0";

export const availability = {
  status: "Open to work",
  response: "—",
  year: "2026",
};

export type RichPart = {
  text: string;
  italic?: boolean;
  break?: boolean;
};

export const heroTagline: RichPart[] = [
  { text: "Full-stack developer, " },
  { text: "building production systems", italic: true },
  { text: ",", break: true },
  { text: "through type, APIs and care." },
];

export const aboutStatement: RichPart[] = [
  { text: "As a full-stack developer, I build " },
  { text: "production web apps", italic: true },
  { text: ", blending clean architecture and " },
  { text: "delivery", italic: true },
  { text: "." },
];

export const aboutSub =
  "My name is Vedant. A full-stack developer based in Jaipur, I ship production web apps and the systems behind them, from React and Next.js to APIs, auth, and LangChain.";

export const galleryStatement: RichPart[] = [
  { text: "Each build is a chance to " },
  { text: "learn, ship", italic: true },
  { text: " and push the system further." },
];

export const skillsLead =
  "Full stack web developer in Jaipur, building production web apps, APIs, and AI systems.";

export const contactBlocks: RichPart[][] = [
  [
    { text: "Open to work", italic: true },
    {
      text: ". I build production web apps and the systems behind them, and I'm glad to talk about a role or a collaboration.",
    },
  ],
  [
    { text: "Available for " },
    { text: "freelance work", italic: true },
    { text: " and product collaborations, on ambitious web apps, APIs, and AI systems." },
  ],
];

export const contactPageCopy = {
  kicker: "Let's talk about your project.",
  lede: "I respond to role conversations, freelance work, and collaborations around production web apps.",
  title: "Let's build together.",
  role: "Full-stack developer, focused on production web apps, APIs, and AI systems.",
  body: "If you have a project in mind, I'd be glad to talk it through and see how I can help.",
  available: "Available 2026",
};

export const contactPrompts = [
  "Product goal",
  "Target deadline",
  "Tech stack",
  "Expected deliverables",
];

export const pageLinks = [
  { label: "Work", href: "/works" },
  { label: "Info", href: "/info" },
  { label: "Contact", href: "/contact" },
] as const;

export const socials = [
  { label: "Email", href: `mailto:${profile.contact.email}` },
  { label: "LinkedIn", href: profile.contact.linkedin },
  { label: "GitHub", href: profile.contact.github },
] as const;

export const contactLinks = [
  { label: "Email", href: `mailto:${profile.contact.email}` },
  { label: "LinkedIn", href: profile.contact.linkedin },
  { label: "GitHub", href: profile.contact.github },
  { label: "Phone", href: `tel:${profile.contact.phone}` },
] as const;

export const railSections = [
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "gallery", label: "Gallery" },
  { id: "skills", label: "Skills" },
  { id: "contact", label: "Contact" },
] as const;

/**
 * Neutral stand-ins for the awards row. Replace any line in place.
 * These are not honors.
 */
export const awards = [
  { outlet: "Studio", subject: "Portfolio", label: "Selected work", date: "2026" },
  { outlet: "Practice", subject: "Client work", label: "In production", date: "2026" },
  { outlet: "Availability", subject: "Roles", label: "Open to work", date: "2026" },
  { outlet: "Archive", subject: "Notes", label: "Placeholder", date: "2026" },
  { outlet: "Archive", subject: "Notes", label: "Placeholder", date: "2026" },
] as const;
