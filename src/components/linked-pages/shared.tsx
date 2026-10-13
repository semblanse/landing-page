import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { DitherImage } from "@/components/landing/dither";

/** A text link with a rule beneath it and a trailing arrow. */
export function TextLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link className="sp-link" href={href}>
      {children} <span aria-hidden="true">→</span>
    </Link>
  );
}

/** The delay, in seconds, for an entrance that reads `--d`. */
export const delay = (seconds: number) =>
  ({ "--d": `${seconds}s` }) as CSSProperties;

/** Brand artwork in `public/artwork`, by name. */
export const art = (name: string) => `/artwork/${name}.webp`;

/** A label, and a link for every level above the current page. */
export type Crumb = [label: string, href?: string];

/**
 * The strip under the header that says where the page sits. A phone shows the
 * last two levels of a long trail.
 */
export function Breadcrumbs({ trail }: { trail: Crumb[] }) {
  const long = trail.length > 3;
  return (
    <nav className="sp-crumbs" aria-label="Breadcrumb" data-hero>
      <ol data-long={long || undefined}>
        {trail.map(([label, href], i) => (
          <li
            key={label}
            data-early={long && i < trail.length - 2 ? "" : undefined}
          >
            {href ? (
              <Link href={href}>{label}</Link>
            ) : (
              <span aria-current="page">{label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/**
 * Artwork that is on screen when the page opens. It wipes open once while the
 * dither resolves from coarse blocks, as the landing hero does.
 */
export function LoadArt({
  name,
  className = "",
  position,
  from = "left",
}: {
  name: string;
  className?: string;
  position?: [number, number];
  from?: "left" | "right";
}) {
  return (
    <div className={`sp-load-art ${className}`} data-from={from}>
      <DitherImage src={art(name)} alt="" position={position} priority intro />
    </div>
  );
}

/**
 * A page opening on cream: copy on one side, artwork cut by the page edge on
 * the other. Used by Trust & Safety, the legal pages and the confirmations.
 */
export function SplitHero({
  artwork,
  side = "right",
  position,
  className = "",
  children,
}: {
  artwork: string;
  side?: "left" | "right";
  position?: [number, number];
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      className={`sp-split-hero sp-art-${side} ${className}`}
      tabIndex={-1}
    >
      <LoadArt
        name={artwork}
        className="sp-split-hero-art"
        position={position}
        from={side}
      />
      <div className="sp-split-hero-copy">{children}</div>
    </section>
  );
}
