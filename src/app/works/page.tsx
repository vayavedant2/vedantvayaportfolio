import type { Metadata } from "next";
import { WorksView } from "@/components/site/WorksView";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Selected production work by Vedant Vaya: client web apps, a TypeScript dashboard, RAG retrieval, and LangChain agents.",
  alternates: { canonical: "/works" },
};

export default function WorkPage() {
  return <WorksView />;
}
