import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";

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

// The profile silhouette. Every echo is this one outline at a different size.
const PROFILE =
  "M59.2815 355H0L0.17749 0H124.243L177.49 70.9999V142L204.468 177.5L186.364 195.25V221.875L177.49 239.625V266.25H118.563L59.2815 355Z";

// The row of eight from Figma (593:3606), on a 1020 by 408 stage.
const ROW = [
  { x: 30, y: 89, w: 132, h: 230, tone: "a", soft: true },
  { x: 123, y: 55, w: 172, h: 299, tone: "b" },
  { x: 246, y: 9, w: 225, h: 391, tone: "c" },
  { x: 369, y: 40, w: 189, h: 328, tone: "a", soft: true },
  { x: 492, y: 0, w: 235, h: 408, tone: "d" },
  { x: 615, y: 49, w: 179, h: 311, tone: "c" },
  { x: 738, y: 20, w: 212, h: 368, tone: "a", soft: true },
  { x: 861, y: 66, w: 159, h: 276, tone: "b" },
] as const;

/**
 * The row of profile echoes. `tones` recolours it for the page it sits on:
 * a is the repeated accent, b the cream pair, c the second pair, d the centre.
 * `missing` draws the centre profile as a dashed outline, for the 404 page.
 */
export function ProfileRow({
  tones = {},
  missing = false,
  className = "",
}: {
  tones?: Partial<Record<"a" | "b" | "c" | "d", string>>;
  missing?: boolean;
  className?: string;
}) {
  const colour = {
    a: "var(--green)",
    b: "var(--cream)",
    c: "var(--lilac)",
    d: "#fff",
    ...tones,
  };
  return (
    <div className={`sp-profile-row ${className}`} aria-hidden="true">
      <div>
        {ROW.map((echo, i) => (
          <svg
            key={i}
            viewBox="0 0 204.468 355"
            preserveAspectRatio="none"
            style={
              {
                left: `${(echo.x / 1020) * 100}%`,
                top: `${(echo.y / 408) * 100}%`,
                width: `${(echo.w / 1020) * 100}%`,
                height: `${(echo.h / 408) * 100}%`,
                opacity: "soft" in echo ? 0.82 : undefined,
              } as CSSProperties
            }
          >
            {missing && i === 4 ? (
              <path
                d={PROFILE}
                fill="none"
                stroke="#18231bb3"
                strokeWidth="3"
                strokeDasharray="12 10"
                vectorEffect="non-scaling-stroke"
              />
            ) : (
              <path d={PROFILE} fill={colour[echo.tone]} />
            )}
          </svg>
        ))}
      </div>
    </div>
  );
}

/** The three overlapping profiles beside the pilot overview heading. */
export function ProfileTrio() {
  return (
    <div className="sp-profile-trio" aria-hidden="true">
      {[
        { fill: "var(--lilac)", h: 233, y: 10 },
        { fill: "#fff", h: 243, y: 0 },
        { fill: "var(--green)", h: 219, y: 24, soft: true },
      ].map((echo, i) => (
        <svg
          key={i}
          viewBox="0 0 204.468 355"
          preserveAspectRatio="none"
          style={{
            height: `${(echo.h / 243) * 100}%`,
            marginTop: `${(echo.y / 243) * 68}%`,
            opacity: echo.soft ? 0.82 : undefined,
          }}
        >
          <path d={PROFILE} fill={echo.fill} />
        </svg>
      ))}
    </div>
  );
}

/**
 * The full-colour page used for confirmations and the 404: a large heading,
 * a line of copy, actions, and the profile row along the bottom edge.
 */
export function PosterPage({
  tone,
  title,
  children,
  actions,
  note,
  after,
  profiles,
}: {
  tone: "ink" | "green" | "lilac" | "sage";
  title: string;
  children: ReactNode;
  actions: ReactNode;
  note?: ReactNode;
  after?: ReactNode;
  profiles: ReactNode;
}) {
  return (
    <section className={`sp-poster sp-${tone}`} tabIndex={-1}>
      <div className="sp-poster-copy">
        <h1 className="sp-display">{title}</h1>
        <p className="sp-lead">{children}</p>
        <div className="sp-actions">{actions}</div>
        {after}
        {note && <p className="sp-preview-note">{note}</p>}
      </div>
      {profiles}
    </section>
  );
}
