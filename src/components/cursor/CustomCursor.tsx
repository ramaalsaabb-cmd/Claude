"use client";

import { useEffect, useRef, useState } from "react";

type CursorState = "default" | "link" | "project" | "paw" | "play" | "text" | "hidden";

type Props = { labels: { viewProject: string; play: string } };

const INTERACTIVE = "[data-cursor], a, button, [role='button'], input, textarea, select, summary, label[for], iframe, video";

function stateFor(el: Element | null): { state: CursorState; label?: string } {
  if (!el) return { state: "default" };
  const target = el.closest(INTERACTIVE);
  if (!target) return { state: "default" };
  const explicit = target.getAttribute("data-cursor") as CursorState | null;
  const label = target.getAttribute("data-cursor-label") ?? undefined;
  if (explicit) return { state: explicit, label };
  const tag = target.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return { state: "text" };
  if (tag === "IFRAME") return { state: "hidden" };
  if (tag === "BUTTON" || target.getAttribute("role") === "button") return { state: "paw" };
  return { state: "link" };
}

/**
 * Signature cursor: a charcoal dot with a red heart-point, plus a trailing ring
 * that morphs into VIEW PROJECT / paw / PLAY states.
 * - Decorative only: pointer-events none, aria-hidden.
 * - Enabled only for fine pointers with hover (never on touch-only devices).
 * - Native text cursor is kept for form fields; focus outlines are untouched.
 */
export default function CustomCursor({ labels }: Props) {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [state, setState] = useState<CursorState>("hidden");
  const [label, setLabel] = useState<string | undefined>();
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setEnabled(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!enabled) {
      document.documentElement.classList.remove("has-custom-cursor");
      return;
    }
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pos = { x: -100, y: -100 };
    const ring = { x: -100, y: -100 };
    let raf = 0;
    let shown = false;

    const loop = () => {
      const k = reduced ? 1 : 0.2;
      ring.x += (pos.x - ring.x) * k;
      ring.y += (pos.y - ring.y) * k;
      if (dotRef.current) dotRef.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
      if (ringRef.current) ringRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0)`;
      raf = requestAnimationFrame(loop);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" && e.pointerType !== "pen") return;
      pos.x = e.clientX;
      pos.y = e.clientY;
      if (!shown) {
        shown = true;
        ring.x = pos.x;
        ring.y = pos.y;
        document.documentElement.classList.add("has-custom-cursor");
        const s = stateFor(e.target as Element);
        setState(s.state);
        setLabel(s.label);
      }
    };
    const onOver = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" && e.pointerType !== "pen") return;
      const s = stateFor(e.target as Element);
      setState(s.state);
      setLabel(s.label);
    };
    const onLeaveWindow = (e: MouseEvent) => {
      if (!e.relatedTarget) setState("hidden");
    };
    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);
    const onBlur = () => setState("hidden");

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    document.addEventListener("mouseout", onLeaveWindow);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("blur", onBlur);
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("mouseout", onLeaveWindow);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("blur", onBlur);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, [enabled]);

  if (!enabled) return null;

  const ringText =
    state === "project" ? label ?? labels.viewProject : state === "play" ? label ?? labels.play : null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[100]" data-cursor-state={state}>
      <div ref={ringRef} className="absolute left-0 top-0 will-change-transform">
        <div
          className={[
            "flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full transition-[width,height,background-color,border-color,opacity,scale] duration-300 ease-[cubic-bezier(.22,1,.36,1)]",
            pressed ? "scale-[0.82]" : "scale-100",
            state === "hidden" || state === "text" ? "opacity-0" : "opacity-100",
            state === "default" && "h-9 w-9 border border-charcoal/35 shadow-[0_0_0_1px_rgba(244,238,233,.35)]",
            state === "link" && "h-14 w-14 border border-wine/50 bg-wine/10",
            state === "paw" && "h-14 w-14 border border-wine/60 bg-cream/80 backdrop-blur-[2px]",
            state === "project" && "h-28 w-28 bg-charcoal text-cream shadow-[0_18px_40px_-18px_rgba(30,27,27,.6)]",
            state === "play" && "h-24 w-24 bg-wine text-cream shadow-[0_18px_40px_-18px_rgba(136,42,42,.7)]",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {ringText && (
            <span className="px-3 text-center font-sans text-[10px] font-semibold uppercase leading-tight tracking-[0.2em]">
              {ringText}
              {state === "project" ? " ↗" : " ▶"}
            </span>
          )}
          {state === "paw" && (
            <svg viewBox="0 0 24 24" className="h-6 w-6 fill-wine">
              <ellipse cx="12" cy="16" rx="5" ry="4.2" />
              <ellipse cx="5.5" cy="10.5" rx="2.2" ry="2.8" />
              <ellipse cx="9.5" cy="6.5" rx="2.2" ry="2.9" />
              <ellipse cx="14.5" cy="6.5" rx="2.2" ry="2.9" />
              <ellipse cx="18.5" cy="10.5" rx="2.2" ry="2.8" />
            </svg>
          )}
        </div>
      </div>
      <div ref={dotRef} className="absolute left-0 top-0 will-change-transform">
        <div
          className={[
            "relative -translate-x-1/2 -translate-y-1/2 rounded-full bg-charcoal shadow-[0_0_0_1.5px_rgba(244,238,233,.85)] transition-[width,height,opacity] duration-200",
            state === "default" || state === "link" ? "h-2.5 w-2.5 opacity-100" : "h-1.5 w-1.5 opacity-0",
          ].join(" ")}
        >
          <span className="absolute left-1/2 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-wine" />
        </div>
      </div>
    </div>
  );
}
