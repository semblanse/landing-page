import Link from "next/link";
import { Action } from "@/components/landing/brand";

export function PageTitle({ children }: { children: string }) {
  return (
    <h1 className="lp-title">
      {children.split("\n").map((line, i) => (
        <span key={line}>
          {i > 0 && " "}
          {line}
        </span>
      ))}
    </h1>
  );
}

export function PageActions({ cream = false }: { cream?: boolean }) {
  return (
    <div className="lp-actions">
      <Action href="/creator-pilot" variant={cream ? "cream" : "default"}>
        Apply as a creator
      </Action>
      <Action href="/brand-pilot" variant={cream ? "cream" : "default"}>
        Book a pilot call
      </Action>
    </div>
  );
}

export function ProfileAccent({
  full = false,
  contact = false,
}: {
  full?: boolean;
  contact?: boolean;
}) {
  const source = full ? "568-3309" : contact ? "570-3009" : "563-2975";
  const ids = full ? [1, 2, 3, 4, 5, 6, 7, 8] : [3, 5, 7];
  return (
    <div
      className={`lp-profiles ${full ? "lp-profiles-full" : "lp-profiles-accent"}`}
      aria-hidden="true"
    >
      {ids.map((id) => (
        <img
          key={id}
          src={`/linked-pages/${source}-imgProfileEcho${id}.svg`}
          alt=""
          className={`lp-profile-${id}`}
        />
      ))}
    </div>
  );
}

export function EditorialRows({
  texts,
  start = 0,
  bullets = false,
}: {
  texts: string[];
  start?: number;
  bullets?: boolean;
}) {
  const rows = texts.slice(start);
  return (
    <div className={`lp-editorial-rows ${bullets ? "lp-bullet-rows" : ""}`}>
      {Array.from({ length: Math.floor(rows.length / 2) }, (_, i) => (
        <article key={rows[i * 2]}>
          {bullets && (
            <img
              className="lp-dot"
              src="/linked-pages/563-2975-imgDot.svg"
              alt=""
            />
          )}
          <div>
            <h3>{rows[i * 2]}</h3>
            <p>{rows[i * 2 + 1]}</p>
          </div>
        </article>
      ))}
    </div>
  );
}

export function ArrowLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link className="lp-arrow-link" href={href}>
      <span>{children}</span>
      <span aria-hidden="true">→</span>
    </Link>
  );
}

export function ExampleLicence({ texts }: { texts: string[] }) {
  return (
    <div className="lp-licence-stage">
      <article className="lp-licence">
        <div className="lp-licence-brand">
          <img src="/linked-pages/568-2993-imgImage3.png" alt="" />
          <span>semblanse</span>
        </div>
        <h2>{texts[6]}</h2>
        <dl>
          {[7, 9, 11, 13].map((i) => (
            <div key={texts[i]}>
              <dt>{texts[i]}</dt>
              <dd>{texts[i + 1]}</dd>
            </div>
          ))}
        </dl>
        <div>
          <p className="lp-licence-label">{texts[15]}</p>
          <p className="lp-preserve-lines">{texts[16]}</p>
        </div>
        <p className="lp-licence-approval">{texts[17]}</p>
        <p className="lp-licence-note">{texts[18]}</p>
      </article>
    </div>
  );
}
