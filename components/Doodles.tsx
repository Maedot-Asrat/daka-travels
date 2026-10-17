"use client";

import { motion } from "framer-motion";
import { useEffect } from "react";

const ink = "var(--ink)";

/** Cycles the global --boil filter so doodles "line-boil" like a hand-drawn animatic. */
export function BoilFilters() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let i = 0;
    const id = window.setInterval(() => {
      i = (i + 1) % 3;
      document.documentElement.style.setProperty("--boil", `url(#boil-${i})`);
    }, 140);
    return () => window.clearInterval(id);
  }, []);
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden>
      {[3, 17, 41].map((seed, i) => (
        <filter id={`boil-${i}`} key={seed}>
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed={seed} result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="3.2" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      ))}
    </svg>
  );
}

export function HatLogo({ size = 44, color = ink, accent = "var(--gold)" }: { size?: number; color?: string; accent?: string }) {
  return (
    <svg width={size} height={size * 0.72} viewBox="0 0 100 72" fill="none" aria-hidden className="boil">
      <path d="M8 40c6 14 26 20 42 20s36-6 42-20c-8 6-20 9-42 9S16 46 8 40Z" fill={accent} stroke={color} strokeWidth="4.5" strokeLinejoin="round" />
      <path d="M28 46c-1-12 2-24 6-30 5 4 10 4 16 0 6 4 11 4 16 0 4 6 7 18 6 30" fill="var(--card)" stroke={color} strokeWidth="4.5" strokeLinejoin="round" />
      <path d="M33 24l7-8 5 6 6-10 6 9 5-5 6 8" stroke={color} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M30 40c12 3 28 3 40 0" stroke={color} strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

export function Squiggle({ color = "var(--gold)", delay = 0.6 }: { color?: string; delay?: number }) {
  return (
    <svg viewBox="0 0 300 26" preserveAspectRatio="none" aria-hidden>
      <motion.path
        d="M4 16C40 6 70 22 104 13s60-8 92 1 70 4 100-6"
        stroke={color}
        strokeWidth="7"
        strokeLinecap="round"
        fill="none"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, delay, ease: "easeInOut" }}
      />
    </svg>
  );
}

export function Sun({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 120 120" className={className} style={style} aria-hidden>
      <g className="spin" style={{ transformOrigin: "60px 60px" }}>
        {Array.from({ length: 12 }).map((_, i) => (
          <path key={i} d="M60 6v14" stroke={ink} strokeWidth="4.5" strokeLinecap="round" transform={`rotate(${i * 30} 60 60)`} />
        ))}
      </g>
      <g className="boil">
        <circle cx="60" cy="60" r="30" fill="var(--gold)" stroke={ink} strokeWidth="4.5" />
        <path d="M48 58c2 3 5 3 7 0M65 58c2 3 5 3 7 0M51 70c5 5 13 5 18 0" stroke={ink} strokeWidth="3.5" strokeLinecap="round" fill="none" />
      </g>
    </svg>
  );
}

export function Cloud({ className, style, fill = "var(--card)" }: { className?: string; style?: React.CSSProperties; fill?: string }) {
  return (
    <svg viewBox="0 0 160 80" className={className} style={style} aria-hidden>
      <path className="boil" d="M26 66c-14 0-20-16-10-24 0-14 18-20 26-10 6-16 30-20 40-4 12-8 30 0 30 14 16 0 22 22 6 24H26Z" fill={fill} stroke={ink} strokeWidth="4" strokeLinejoin="round" />
    </svg>
  );
}

export function Birds({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 120 60" className={className} style={style} aria-hidden fill="none">
      <path className="flap" d="M10 30c6-8 12-8 16 0 4-8 10-8 16 0" stroke={ink} strokeWidth="4" strokeLinecap="round" />
      <path className="flap" style={{ animationDelay: ".2s" }} d="M64 16c5-6 10-6 13 0 3-6 8-6 13 0" stroke={ink} strokeWidth="3.5" strokeLinecap="round" />
      <path className="flap" style={{ animationDelay: ".1s" }} d="M78 44c4-5 8-5 11 0 3-5 7-5 11 0" stroke={ink} strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

/** Paper plane on a looping dashed trail that draws itself in. */
export function PlaneTrail({ className }: { className?: string }) {
  const d = "M10 150C70 60 150 210 210 120S300 10 380 60";
  return (
    <svg viewBox="0 0 420 220" className={className} fill="none" aria-hidden>
      <motion.path
        d={d}
        stroke={ink}
        strokeWidth="3"
        strokeDasharray="2 12"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 2, delay: 1.4, ease: "easeInOut" }}
      />
      <motion.g
        initial={{ opacity: 0, x: -20, y: 20 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ delay: 3.1, type: "spring", stiffness: 160, damping: 12 }}
      >
        <g transform="translate(372 30) rotate(18)" className="boil">
          <path d="M0 22 44 0 30 40 20 28Z" fill="var(--card)" stroke={ink} strokeWidth="3.5" strokeLinejoin="round" />
          <path d="M44 0 20 28l-2 14 8-10" fill="var(--sky)" stroke={ink} strokeWidth="3.5" strokeLinejoin="round" />
        </g>
      </motion.g>
    </svg>
  );
}

export function Check({ color = "var(--green)", size = 26 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 30 30" aria-hidden className="boil">
      <circle cx="15" cy="15" r="12" fill={color} stroke={ink} strokeWidth="2.5" />
      <path d="M9 15.5l4 4 8-9" stroke="var(--paper)" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Seat({ filled }: { filled: boolean }) {
  return (
    <svg width="26" height="30" viewBox="0 0 26 30" aria-hidden>
      <path d="M6 3h11a3 3 0 0 1 3 3v12H4V5a2 2 0 0 1 2-2Z M2 18h21v5H2Z M6 23v5M19 23v5" fill={filled ? "var(--gold)" : "transparent"} stroke={filled ? ink : "rgba(43,47,92,.35)"} strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

export function KeyDoodle() {
  return (
    <svg viewBox="0 0 120 120" className="service-icon wiggle" aria-hidden fill="none">
      <g className="boil">
        <circle cx="38" cy="44" r="22" fill="var(--gold)" stroke={ink} strokeWidth="5" />
        <circle cx="38" cy="44" r="8" fill="var(--card)" stroke={ink} strokeWidth="4" />
        <path d="M54 60l40 40M80 86l10-10M70 76l8-8" stroke={ink} strokeWidth="6" strokeLinecap="round" />
      </g>
    </svg>
  );
}

export function TentDoodle() {
  return (
    <svg viewBox="0 0 120 120" className="service-icon wiggle" aria-hidden fill="none">
      <g className="boil">
        <path d="M14 98 60 22l46 76Z" fill="var(--gold)" stroke="var(--paper)" strokeWidth="5" strokeLinejoin="round" />
        <path d="M60 22 44 98h32Z" fill="var(--coral)" stroke="var(--paper)" strokeWidth="5" strokeLinejoin="round" />
        <path d="M6 98h108" stroke="var(--paper)" strokeWidth="5" strokeLinecap="round" />
        <path d="M86 18l4 8 8 1-6 6 2 8-8-4-7 4 2-8-6-6 8-1Z" fill="var(--paper)" />
      </g>
    </svg>
  );
}

export function Arrow({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 120 80" className={className} style={style} fill="none" aria-hidden>
      <motion.path
        d="M8 14c30-10 70 0 86 40"
        stroke={ink}
        strokeWidth="4"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      />
      <motion.path
        d="M80 50l14 6 4-16"
        stroke={ink}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.3, delay: 0.75 }}
      />
    </svg>
  );
}
