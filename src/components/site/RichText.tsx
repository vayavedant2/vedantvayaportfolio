import type { RichPart } from "@/data/profile";

export function RichText({
  parts,
  italicClass,
}: {
  parts: RichPart[];
  italicClass: string;
}) {
  return parts.map((part, index) => (
    <span key={`${part.text}-${index}`}>
      <span className={part.italic ? italicClass : undefined}>{part.text}</span>
      {part.break ? <br /> : null}
    </span>
  ));
}
