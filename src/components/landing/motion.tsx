"use client";
/*
Motion follows the Figma prototype guide (504:2870, page 468:2470).
Entrances are CSS transitions switched on by one IntersectionObserver, so
content stays visible without JavaScript and nothing flashes on hydration.
Scroll-linked movement uses Motion values driven by scroll progress.
Everything eases on the prototype curve, cubic-bezier(0.22, 1, 0.36, 1).
*/
import {
  useCallback,
  useEffect,
  useRef,
  useSyncExternalStore,
  type CSSProperties,
  type ReactNode,
  type Ref,
  type RefObject,
} from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import {
  MotionConfig,
  useReducedMotion,
  useScroll,
  useSpring,
  type MotionValue,
} from "motion/react";

export const ease = [0.22, 1, 0.36, 1] as const;

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
            lerp: 0.11,
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

let observer: IntersectionObserver | undefined;
function watch(element: Element) {
  observer ??= new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        // Also settle anything already above the fold line, such as after a
        // reload part way down the page.
        const passed =
          entry.boundingClientRect.top < (entry.rootBounds?.bottom ?? 0);
        if (entry.isIntersecting || passed) {
          entry.target.classList.add("in");
          observer?.unobserve(entry.target);
        }
      }
    },
    { rootMargin: "0px 0px -12% 0px" },
  );
  observer.observe(element);
  return () => observer?.unobserve(element);
}

type RevealKind = "rise" | "fade" | "wipe" | "wipe-left" | "scale";

/** Enters once when it scrolls into view. `delay` is in seconds. */
export function Reveal({
  children,
  className = "",
  delay = 0,
  kind = "rise",
  as = "div",
  ...rest
}: {
  children?: ReactNode;
  className?: string;
  delay?: number;
  kind?: RevealKind;
  as?: "div" | "p" | "article" | "section" | "small" | "aside" | "li";
  id?: string;
} & Record<`aria-${string}`, string | undefined>) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => (ref.current ? watch(ref.current) : undefined), []);
  const Tag = as;
  // A wipe starts fully clipped, and a fully clipped element never counts
  // as in view. An unclipped host is watched in its place.
  if (kind === "wipe" || kind === "wipe-left")
    return (
      <Tag ref={ref as Ref<never>} className="reveal-host" {...rest}>
        <div
          className={className}
          data-reveal={kind}
          style={delay ? ({ "--d": `${delay}s` } as CSSProperties) : undefined}
        >
          {children}
        </div>
      </Tag>
    );
  return (
    <Tag
      ref={ref as Ref<never>}
      className={className}
      data-reveal={kind}
      style={delay ? ({ "--d": `${delay}s` } as CSSProperties) : undefined}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/** A heading whose lines rise through masks, staggered by line. */
export function Lines({
  lines,
  as = "h2",
  className = "",
  delay = 0,
  onLoad = false,
}: {
  lines: ReactNode[];
  as?: "h1" | "h2" | "h3" | "blockquote" | "p";
  className?: string;
  delay?: number;
  /** Play on page load instead of on scroll. Used above the fold. */
  onLoad?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  useEffect(
    () => (ref.current && !onLoad ? watch(ref.current) : undefined),
    [onLoad],
  );
  const Tag = as;
  return (
    <Tag
      ref={ref as Ref<never>}
      className={className}
      data-lines={onLoad ? "load" : "scroll"}
      style={delay ? ({ "--d": `${delay}s` } as CSSProperties) : undefined}
    >
      {lines.map((line, i) => (
        <span className="line-mask" key={i}>
          <span style={{ "--i": i } as CSSProperties}>{line}</span>
          {/* Keeps the words apart for screen readers and when lines reflow. */}
          {i < lines.length - 1 ? " " : null}
        </span>
      ))}
    </Tag>
  );
}

/**
 * Scroll progress for an element, lightly sprung. `enabled` is false until
 * the page has mounted and whenever the visitor prefers reduced motion, so
 * server output and no-script pages show the settled layout.
 */
export function useScrollProgress(
  target: RefObject<HTMLElement | null>,
  offset: NonNullable<Parameters<typeof useScroll>[0]>["offset"],
): { progress: MotionValue<number>; enabled: boolean } {
  const reduce = useReducedMotion();
  const mounted = useSyncExternalStore(
    noSubscription,
    () => true,
    () => false,
  );
  const { scrollYProgress } = useScroll({ target, offset });
  const progress = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 32,
    mass: 0.4,
  });
  return { progress, enabled: mounted && !reduce };
}

const noSubscription = () => () => undefined;

export function useMediaQuery(query: string) {
  const subscribe = useCallback(
    (notify: () => void) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", notify);
      return () => list.removeEventListener("change", notify);
    },
    [query],
  );
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}

let probe: HTMLDivElement | undefined;
/**
 * The height of the screen with the browser's toolbars showing. Phone
 * browsers resize the viewport as their toolbars slide away, so a
 * `min-height` media query flips mid-scroll there, and reports far less
 * than the device height. This value holds still.
 */
export function useSmallViewportHeight() {
  const subscribe = useCallback((notify: () => void) => {
    window.addEventListener("orientationchange", notify);
    return () => window.removeEventListener("orientationchange", notify);
  }, []);
  return useSyncExternalStore(
    subscribe,
    () => {
      if (!probe) {
        probe = document.createElement("div");
        probe.style.cssText =
          "position:fixed;top:0;width:0;height:100vh;height:100svh;visibility:hidden;pointer-events:none";
        document.body.appendChild(probe);
      }
      return probe.offsetHeight;
    },
    () => 0,
  );
}
