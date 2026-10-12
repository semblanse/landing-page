"use client";
import { useEffect, useRef, type ReactNode } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import {
  motion,
  MotionConfig,
  useInView,
  useReducedMotion,
} from "motion/react";

export const ease = [0.16, 1, 0.3, 1] as const;
export function ScrollProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    let lenis: Lenis | undefined;
    const update = () => {
      lenis?.destroy();
      lenis = query.matches
        ? undefined
        : new Lenis({
            autoRaf: true,
            anchors: { offset: -24 },
            duration: 1.1,
            smoothWheel: true,
            syncTouch: false,
          });
    };
    update();
    query.addEventListener("change", update);
    return () => {
      query.removeEventListener("change", update);
      lenis?.destroy();
    };
  }, []);
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
export function Reveal({
  children,
  className = "",
  delay = 0,
  kind = "rise",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  kind?: "rise" | "wipe" | "scale";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, margin: "0px 0px -40px 0px" });
  const reduce = useReducedMotion();
  const active = seen && !reduce;
  // Keep the SSR/default state visible, including without JavaScript.
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={false}
      animate={
        active
          ? kind === "wipe"
            ? { clipPath: ["inset(0 100% 0 0)", "inset(0 0% 0 0)"] }
            : kind === "scale"
              ? { scale: [0.96, 1] }
              : { y: [28, 0] }
          : { y: 0, scale: 1 }
      }
      transition={{ duration: 1, delay, ease }}
    >
      {children}
    </motion.div>
  );
}
export function Headline({
  lines,
  className = "",
  hero = false,
}: {
  lines: string[];
  className?: string;
  hero?: boolean;
}) {
  const reduce = useReducedMotion();
  return (
    <h1 className={className} aria-label={lines.join(" ")}>
      {lines.map((line, i) => (
        <span className="headline-mask" key={line}>
          <motion.span
            initial={false}
            animate={hero && !reduce ? { y: ["105%", "0%"] } : { y: 0 }}
            transition={{ duration: 1.1, delay: 0.12 + i * 0.12, ease }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </h1>
  );
}
