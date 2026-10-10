import type { Metadata } from "next";
import { InfoView } from "@/components/site/InfoView";

export const metadata: Metadata = {
  title: "Info",
  description:
    "Vedant Vaya is a full stack web developer in Jaipur, building production web apps, APIs, and AI systems.",
  alternates: { canonical: "/info" },
};

export default function InfoPage() {
  return <InfoView />;
}
