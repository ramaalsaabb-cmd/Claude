"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import "./black-cat.css";

type Expression = "normal" | "happy" | "curious" | "sleepy";

type Props = {
  label: string;
  messages: string[];
  className?: string;
};

type Heart = { id: number; x: number; drift: number };

/**
 * The portfolio's signature black cat.
 * Pure SVG + CSS, animated with a single rAF loop that only runs while visible.
 * - eyes & head follow the pointer
 * - blinks, ear twitches, tail swish, occasional stretch + yawn
 * - gets sleepy when idle, curious when the pointer comes close
 * - click / tap / Enter: heart, happy eyes, paw wave and a short message
 * Respects prefers-reduced-motion (no tracking or idle motion, reactions stay).
 */
export default function BlackCat({ label, messages, className = "" }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const target = useRef({ x: 0, y: 0, active: false });
  const lastMove = useRef(0);
  const msgIndex = useRef(0);
  const heartId = useRef(0);
  const msgTimer = useRef<number | undefined>(undefined);

  const [expression, setExpression] = useState<Expression>("normal");
  const [blinking, setBlinking] = useState(false);
  const [stretching, setStretching] = useState(false);
  const [earTwitch, setEarTwitch] = useState(false);
  const [waving, setWaving] = useState(false);
  const [hearts, setHearts] = useState<Heart[]>([]);
  const [message, setMessage] = useState<{ text: string; id: number } | null>(null);
  const [reduced, setReduced] = useState(false);

  const happyUntil = useRef(0);
  const exprRef = useRef<Expression>("normal");
  const stretchingRef = useRef(false);

  const setExpr = useCallback((e: Expression) => {
    if (exprRef.current !== e) {
      exprRef.current = e;
      setExpression(e);
    }
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Pointer tracking + rAF loop (paused when off-screen or reduced motion)
  useEffect(() => {
    if (reduced) return;
    const svg = svgRef.current;
    const wrap = wrapRef.current;
    if (!svg || !wrap) return;

    let raf = 0;
    let visible = true;
    const cur = { hx: 0, hy: 0, hr: 0, px: 0, py: 0 };
    lastMove.current = performance.now();

    const onMove = (e: PointerEvent) => {
      target.current = { x: e.clientX, y: e.clientY, active: true };
      lastMove.current = performance.now();
    };
    const onLeave = () => {
      target.current.active = false;
    };

    const tick = () => {
      const rect = svg.getBoundingClientRect();
      // head centre in viewport coordinates (head sits ~31% down the drawing)
      const cx = rect.left + rect.width * 0.5;
      const cy = rect.top + rect.height * 0.31;
      let tx = 0,
        ty = 0,
        tr = 0,
        tpx = 0,
        tpy = 0;
      const now = performance.now();

      if (target.current.active && !stretchingRef.current) {
        const dx = target.current.x - cx;
        const dy = target.current.y - cy;
        const dist = Math.hypot(dx, dy) || 1;
        const reach = Math.min(dist / 420, 1);
        const nx = dx / dist;
        const ny = dy / dist;
        tx = nx * 7 * reach;
        ty = ny * 5 * reach;
        tr = nx * 7 * reach;
        tpx = nx * 3.6 * Math.min(dist / 160, 1);
        tpy = ny * 3 * Math.min(dist / 160, 1);

        if (now > happyUntil.current) {
          const idle = now - lastMove.current > 14000;
          setExpr(idle ? "sleepy" : dist < rect.width * 0.55 ? "curious" : "normal");
        }
      } else if (now > happyUntil.current && !stretchingRef.current) {
        setExpr(now - lastMove.current > 14000 ? "sleepy" : "normal");
      }

      const k = 0.09;
      cur.hx += (tx - cur.hx) * k;
      cur.hy += (ty - cur.hy) * k;
      cur.hr += (tr - cur.hr) * k;
      cur.px += (tpx - cur.px) * 0.16;
      cur.py += (tpy - cur.py) * 0.16;

      svg.style.setProperty("--hx", `${cur.hx.toFixed(2)}px`);
      svg.style.setProperty("--hy", `${cur.hy.toFixed(2)}px`);
      svg.style.setProperty("--hr", `${cur.hr.toFixed(2)}deg`);
      svg.style.setProperty("--px", `${cur.px.toFixed(2)}px`);
      svg.style.setProperty("--py", `${cur.py.toFixed(2)}px`);

      if (visible) raf = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(([entry]) => {
      const was = visible;
      visible = entry.isIntersecting;
      if (visible && !was) raf = requestAnimationFrame(tick);
      if (!visible) cancelAnimationFrame(raf);
    });
    io.observe(wrap);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [reduced, setExpr]);

  // Blinking (also runs in reduced motion as a state change, but very rarely)
  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    const loop = () => {
      t = setTimeout(
        () => {
          setBlinking(true);
          setTimeout(() => setBlinking(false), 160);
          // occasional double blink
          if (Math.random() < 0.25) {
            setTimeout(() => setBlinking(true), 320);
            setTimeout(() => setBlinking(false), 480);
          }
          loop();
        },
        reduced ? 9000 : 2600 + Math.random() * 3800,
      );
    };
    loop();
    return () => clearTimeout(t);
  }, [reduced]);

  // Ear twitches and the occasional stretch
  useEffect(() => {
    if (reduced) return;
    const ear = setInterval(() => {
      if (Math.random() < 0.5) {
        setEarTwitch(true);
        setTimeout(() => setEarTwitch(false), 420);
      }
    }, 4200);
    const stretch = setInterval(() => {
      if (document.hidden || stretchingRef.current) return;
      stretchingRef.current = true;
      setStretching(true);
      setTimeout(() => {
        setStretching(false);
        stretchingRef.current = false;
      }, 2400);
    }, 26000);
    return () => {
      clearInterval(ear);
      clearInterval(stretch);
    };
  }, [reduced]);

  const react = useCallback(() => {
    const now = performance.now();
    lastMove.current = now;
    happyUntil.current = now + 1400;
    setExpr("happy");

    const id = ++heartId.current;
    setHearts((h) => [...h.slice(-4), { id, x: (Math.random() - 0.5) * 50, drift: (Math.random() - 0.5) * 40 }]);
    setTimeout(() => setHearts((h) => h.filter((x) => x.id !== id)), 1600);

    if (id % 2 === 0 && !reduced) {
      setWaving(true);
      setTimeout(() => setWaving(false), 900);
    }

    const msg = messages[msgIndex.current % messages.length];
    msgIndex.current += 1;
    setMessage({ text: msg, id: msgIndex.current });
    window.clearTimeout(msgTimer.current);
    msgTimer.current = window.setTimeout(() => setMessage(null), 2200);
  }, [messages, reduced, setExpr]);

  const rootClass = [
    "bc-cat",
    reduced ? "bc-reduced" : "",
    blinking ? "bc-blink" : "",
    stretching ? "bc-stretch" : "",
    earTwitch ? "bc-twitch" : "",
    waving ? "bc-wave" : "",
    `bc-${expression}`,
  ].join(" ");

  return (
    <div ref={wrapRef} className={`relative select-none ${className}`}>
      {/* speech bubble */}
      <div className="bc-bubbleWrap" aria-live="polite">
        {message && (
          <span key={message.id} className="bc-bubble">
            {message.text}
          </span>
        )}
      </div>

      {/* floating hearts */}
      <div className="bc-hearts" aria-hidden="true">
        {hearts.map((h) => (
          <svg
            key={h.id}
            viewBox="0 0 24 22"
            className="bc-heart"
            style={{ "--x": `${h.x}px`, "--drift": `${h.drift}px` } as React.CSSProperties}
          >
            <path d="M12 21s-8.5-5.3-10.6-10C-.1 6.6 2.6 2 7 2c2.2 0 3.8 1.2 5 3 1.2-1.8 2.8-3 5-3 4.4 0 7.1 4.6 5.6 9-2.1 4.7-10.6 10-10.6 10Z" />
          </svg>
        ))}
      </div>

      <button
        type="button"
        onClick={react}
        aria-label={label}
        data-cursor="paw"
        className="block w-full rounded-[40%] focus-visible:outline-offset-8"
      >
        <svg ref={svgRef} viewBox="0 0 260 320" className={rootClass} role="img" aria-hidden="true">
          <defs>
            <radialGradient id="cat-body" cx="38%" cy="30%" r="80%">
              <stop offset="0" stopColor="#2e2828" />
              <stop offset="0.55" stopColor="#1a1616" />
              <stop offset="1" stopColor="#0f0c0c" />
            </radialGradient>
            <radialGradient id="cat-eye" cx="45%" cy="40%" r="70%">
              <stop offset="0" stopColor="#f2d48a" />
              <stop offset="1" stopColor="#c8923c" />
            </radialGradient>
          </defs>

          {/* ground shadow */}
          <ellipse cx="132" cy="304" rx="92" ry="8" fill="#1e1b1b" opacity="0.12" />

          {/* tail */}
          <g className="bc-tail">
            <path
              d="M184 296 C 226 300, 246 276, 238 240 C 232 214, 244 194, 258 188"
              fill="none"
              stroke="#151212"
              strokeWidth="15"
              strokeLinecap="round"
            />
          </g>

          {/* body */}
          <g className="bc-body">
            <path
              d="M130 118 C 102 118, 90 152, 88 190 C 85 230, 60 258, 63 286 C 66 306, 194 306, 197 286 C 200 258, 175 230, 172 190 C 170 152, 158 118, 130 118 Z"
              fill="url(#cat-body)"
            />
            {/* haunch + leg contours */}
            <path d="M176 250 C 190 262, 192 282, 182 296" fill="none" stroke="#2f2929" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
            <path d="M84 250 C 70 262, 68 282, 78 296" fill="none" stroke="#2f2929" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
            <path d="M122 232 C 120 262, 117 280, 115 296" fill="none" stroke="#2f2929" strokeWidth="2" strokeLinecap="round" />
            <path d="M138 232 C 140 262, 143 280, 145 296" fill="none" stroke="#2f2929" strokeWidth="2" strokeLinecap="round" />
            <ellipse cx="110" cy="297" rx="15" ry="8" fill="#171313" />
            <g className="bc-paw">
              <ellipse cx="150" cy="297" rx="15" ry="8" fill="#171313" />
              <path d="M144 296 v3 M150 295.5 v3.5 M156 296 v3" stroke="#2f2929" strokeWidth="1.4" strokeLinecap="round" />
            </g>
            {/* collar + heart charm */}
            <path d="M100 138 Q 130 156 160 138" fill="none" stroke="#882a2a" strokeWidth="6" strokeLinecap="round" />
            <path
              d="M130 162s-6-3.7-7.4-7c-1-3 .9-6 4-6 1.5 0 2.6.8 3.4 2 .8-1.2 1.9-2 3.4-2 3.1 0 5 3 4 6-1.4 3.3-7.4 7-7.4 7Z"
              fill="#a3343a"
            />
          </g>

          {/* head */}
          <g className="bc-head">
            <g className="bc-earL">
              <path d="M92 84 L 93 30 L 124 62 Z" fill="#171313" stroke="#171313" strokeWidth="8" strokeLinejoin="round" />
              <path d="M99 72 L 99.5 44 L 116 62 Z" fill="#4b2a2e" />
            </g>
            <g className="bc-earR">
              <path d="M168 84 L 167 30 L 136 62 Z" fill="#171313" stroke="#171313" strokeWidth="8" strokeLinejoin="round" />
              <path d="M161 72 L 160.5 44 L 144 62 Z" fill="#4b2a2e" />
            </g>
            <path
              d="M82 104 C 82 72, 104 56, 130 56 C 156 56, 178 72, 178 104 C 178 132, 158 146, 130 146 C 102 146, 82 132, 82 104 Z"
              fill="url(#cat-body)"
            />

            {/* open eyes */}
            <g className="bc-eyes">
              {[111, 149].map((cx) => (
                <g key={cx} className="bc-eye">
                  <path
                    d={`M${cx - 12} 102 Q ${cx} 88 ${cx + 12} 102 Q ${cx} 114 ${cx - 12} 102 Z`}
                    fill="url(#cat-eye)"
                  />
                  <g className="bc-pupil">
                    <ellipse cx={cx} cy="101.5" rx="3.2" ry="8" className="bc-pupilShape" fill="#120f0f" />
                    <circle cx={cx + 3} cy="97" r="1.7" fill="#fff" opacity="0.9" />
                  </g>
                </g>
              ))}
            </g>

            {/* happy / closed eyes */}
            <g className="bc-happyEyes" fill="none" stroke="#e3b862" strokeWidth="3" strokeLinecap="round">
              <path d="M100 104 Q 111 93 122 104" />
              <path d="M138 104 Q 149 93 160 104" />
            </g>

            {/* whiskers */}
            <g stroke="#8a7873" strokeWidth="1" strokeLinecap="round" opacity="0.6">
              <path d="M100 119 L 66 112" />
              <path d="M100 124 L 64 125" />
              <path d="M160 119 L 194 112" />
              <path d="M160 124 L 196 125" />
            </g>

            {/* nose + mouth */}
            <path d="M125.5 115 h9 l-4.5 5.5 Z" fill="#a3474c" strokeLinejoin="round" />
            <path
              d="M130 120.5 q 0 5 -5.5 6 M130 120.5 q 0 5 5.5 6"
              fill="none"
              stroke="#5b4949"
              strokeWidth="1.5"
              strokeLinecap="round"
              className="bc-mouth"
            />
            <ellipse cx="130" cy="129" rx="5" ry="6.5" fill="#6f1f1f" className="bc-yawn" />
            {/* blush on happy */}
            <g className="bc-blush" fill="#a3474c">
              <ellipse cx="98" cy="118" rx="6" ry="3" />
              <ellipse cx="162" cy="118" rx="6" ry="3" />
            </g>
          </g>
        </svg>
      </button>
    </div>
  );
}
