export type SkillGroup = {
  id: string;
  label: string;
  items: string[];
};

export const skillGroups: SkillGroup[] = [
  {
    id: "frontend",
    label: "Frontend",
    items: ["React", "Next.js", "TypeScript", "JavaScript", "HTML5", "CSS3", "Responsive Design"],
  },
  {
    id: "backend",
    label: "Backend",
    items: ["Node.js", "FastAPI", "PHP", "REST APIs", "MVC"],
  },
  {
    id: "databases",
    label: "Databases",
    items: ["PostgreSQL", "MySQL", "Prisma ORM", "SQL"],
  },
  {
    id: "ai",
    label: "AI",
    items: ["Python", "LangChain", "RAG Pipelines", "Prompt Engineering", "pgvector"],
  },
  {
    id: "seo",
    label: "SEO",
    items: ["Technical SEO", "SEMrush"],
  },
  {
    id: "devops",
    label: "DevOps",
    items: ["Docker", "CI/CD", "Git Flow"],
  },
  {
    id: "auth",
    label: "Auth",
    items: ["JWT", "OAuth 2.0"],
  },
];
