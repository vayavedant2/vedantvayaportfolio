import Link from "next/link";
import { linkProps } from "@/lib/linkProps";
import styles from "./site.module.css";

export function HoverLink({
  href,
  children,
  className,
  onLight = false,
}: {
  href: string;
  children: string;
  className?: string;
  onLight?: boolean;
}) {
  const classNames = [styles.hover, onLight ? styles.onLight : null, className]
    .filter(Boolean)
    .join(" ");
  const visual = (
    <span aria-hidden="true">
      {Array.from(children).map((char, index) =>
        char === " " ? (
          <span key={`space-${index}`} className={styles.charSpace} />
        ) : (
          <span
            key={`${char}-${index}`}
            className={styles.char}
            style={{ ["--i" as string]: index }}
          >
            <span className={styles.pair}>
              <span>{char}</span>
              <span>{char}</span>
            </span>
          </span>
        ),
      )}
    </span>
  );

  if (href.startsWith("/")) {
    return (
      <Link href={href} aria-label={children} className={classNames}>
        {visual}
      </Link>
    );
  }

  return (
    <a href={href} aria-label={children} className={classNames} {...linkProps(href)}>
      {visual}
    </a>
  );
}
