"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import assets from "@/lib/figma-assets.json";
export function asset(key: keyof typeof assets) {
  return assets[key];
}
export function Brand({
  light = false,
  markOnly = false,
}: {
  light?: boolean;
  markOnly?: boolean;
}) {
  return (
    <Link
      href="/"
      className={`brand ${light ? "brand-light" : ""}`}
      aria-label="Semblanse home"
    >
      <span className="brand-mark" aria-hidden="true">
        <img
          src={asset(light ? "549:2780/imgProfileMark" : "549:3403/imgIcon")}
          alt=""
        />
        {!light && <img src={asset("549:3403/imgIcon1")} alt="" />}
      </span>
      {light && (
        <span className="brand-mark brand-mobile-symbol" aria-hidden="true">
          <img src={asset("554:2846/imgIcon")} alt="" />
          <img src={asset("554:2846/imgIcon1")} alt="" />
        </span>
      )}
      {!markOnly && <span>semblanse</span>}
    </Link>
  );
}
export function Action({
  href,
  children,
  variant = "default",
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "default" | "secondary" | "cream";
  className?: string;
}) {
  return (
    <Button
      variant={variant}
      size="lg"
      nativeButton={false}
      role="link"
      render={<Link href={href} />}
      className={`brand-action action-${variant} ${className}`}
    >
      {children}
    </Button>
  );
}
