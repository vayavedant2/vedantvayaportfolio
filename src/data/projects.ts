export type Work = {
  id: string;
  title: string;
  category: string;
  year: string;
  summary: string;
  stack: string[];
  poster: string;
};

export const works: Work[] = [
  {
    id: "electric-ji",
    title: "Electric Ji",
    category: "Client site",
    year: "2026",
    summary:
      "Production web app for Electric Ji, shipped with React, Next.js, TypeScript, and PHP on an Agile sprint schedule.",
    stack: ["React", "Next.js", "TypeScript", "PHP"],
    poster: "Client",
  },
  {
    id: "petz",
    title: "Petz",
    category: "Client site",
    year: "2026",
    summary:
      "Production web app for Petz, built with React, Next.js, and TypeScript alongside the other client brands.",
    stack: ["React", "Next.js", "TypeScript", "PHP"],
    poster: "Client",
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
  },
  {
    id: "dashboard",
    title: "Client Dashboard",
    category: "Product",
    year: "2026",
    summary:
      "TypeScript dashboard with a reusable component library, a Prisma schema for MySQL, and JWT-secured REST endpoints.",
    stack: ["TypeScript", "React", "Prisma ORM", "MySQL", "JWT"],
    poster: "Dashboard",
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
  {
    id: "agents",
    title: "LangChain AI Agents",
    category: "Automation",
    year: "2026",
    summary:
      "Agents built with prompt templates, chains, and tool calling, connected to external REST APIs for live actions.",
    stack: ["Python", "LangChain", "REST APIs", "Tool Calling"],
    poster: "Agents",
  },
];
