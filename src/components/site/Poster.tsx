import styles from "./site.module.css";

const shapes = [
  "M24 108C48 28 96 18 168 72",
  "M30 30h64v80H30z",
  "M150 28a40 40 0 1 1 0 80",
  "M20 96 70 28l52 40 48-52",
  "M28 40h90M28 70h140M28 100h70",
];

export function Poster({
  seed,
  title,
  kicker,
  monogram = false,
  quiet = false,
  bare = false,
}: {
  seed: number;
  title: string;
  kicker?: string;
  monogram?: boolean;
  quiet?: boolean;
  bare?: boolean;
}) {
  const shift = (seed % 5) * 16;
  const shape = shapes[seed % shapes.length];

  return (
    <div
      className={`${styles.poster} ${monogram ? styles.posterMono : ""} ${bare ? styles.posterBare : ""}`}
      style={{ ["--shift" as string]: `${shift}%` }}
    >
      <div className={styles.posterWash} />
      <svg className={styles.posterShape} viewBox="0 0 200 140" aria-hidden="true">
        <path d={shape} />
      </svg>
      <div className={styles.posterNoise} />
      {quiet ? null : (
        <div className={styles.posterCopy}>
          {kicker ? <span className={styles.posterKicker}>{kicker}</span> : null}
          <strong className={styles.posterTitle}>{monogram ? "Vv" : title}</strong>
        </div>
      )}
    </div>
  );
}

export function Frame({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={[styles.frame, className].filter(Boolean).join(" ")}>
      <span className={`${styles.mark} ${styles.tl}`} />
      <span className={`${styles.mark} ${styles.tr}`} />
      <span className={`${styles.mark} ${styles.bl}`} />
      <span className={`${styles.mark} ${styles.br}`} />
      {children}
    </div>
  );
}
