import type { Metadata } from "next";
import { ContactView } from "@/components/site/ContactView";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Vedant Vaya about roles, freelance work, and production web apps.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return <ContactView />;
}
