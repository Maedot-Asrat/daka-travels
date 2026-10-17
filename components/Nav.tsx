"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring, useTransform } from "framer-motion";
import { useEffect, useState } from "react";
import { HatLogo } from "./Doodles";

const links = [
  { href: "#services", label: "Services" },
  { href: "#fleet", label: "Fleet" },
  { href: "#destinations", label: "Destinations" },
  { href: "#how", label: "How it works" },
];

export function Curtain() {
  const [show, setShow] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setShow(false), 1300);
    return () => clearTimeout(t);
  }, []);
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="curtain"
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          initial={{ clipPath: "inset(0 0 0% 0)" }}
          transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
        >
          <motion.div
            initial={{ scale: 0.6, rotate: -12, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 220, damping: 12 }}
            style={{ display: "grid", justifyItems: "center" }}
          >
            <HatLogo size={120} color="var(--paper)" />
            <div style={{ fontWeight: 800, fontSize: 34, letterSpacing: "-0.04em", lineHeight: 1 }}>Daka Travels</div>
            <div className="hand">packing the van…</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function MiniVan() {
  return (
    <svg width="30" height="18" viewBox="0 0 30 18" aria-hidden>
      <path d="M2 12V6.5C2 4.6 3.6 3 5.5 3H19c1.4 0 2.6.7 3.3 1.9L25 9.5l2.2 1c.5.2.8.7.8 1.3V12c0 .8-.7 1.5-1.5 1.5h-24C1.7 13.5 2 12.8 2 12Z" fill="var(--gold)" stroke="var(--ink)" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M6 5.5h5v4H5V6.5M13 5.5h5.5l2.5 4H13Z" fill="var(--sky)" stroke="var(--ink)" strokeWidth="1.4" strokeLinejoin="round" />
      <circle cx="8" cy="14" r="2.6" fill="var(--ink)" />
      <circle cx="22" cy="14" r="2.6" fill="var(--ink)" />
    </svg>
  );
}

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [current, setCurrent] = useState<string | null>(null);
  const { scrollY, scrollYProgress } = useScroll();
  const vanLeft = useTransform(useSpring(scrollYProgress, { stiffness: 120, damping: 24 }), (v) => `${v * 100}%`);

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(y > prev && y > 300 && !open);
  });

  // Track which section is on screen so the nav can mark it.
  useEffect(() => {
    const els = links.map((l) => document.querySelector(l.href)).filter(Boolean) as Element[];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setCurrent(`#${e.target.id}`);
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    els.forEach((el) => io.observe(el));
    const top = () => window.scrollY < 200 && setCurrent(null);
    window.addEventListener("scroll", top, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", top);
    };
  }, []);

  const marked = hovered ?? current;

  return (
    <motion.header
      className="nav"
      initial={{ y: -100 }}
      animate={{ y: hidden ? -130 : 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30, delay: hidden ? 0 : 0.1 }}
    >
      <div className="container">
        <nav className="nav-inner" aria-label="Main">
          <a href="#top" className="logo" aria-label="Daka Travels home">
            <motion.span whileHover={{ rotate: -12, y: -2 }} style={{ display: "inline-flex" }}>
              <HatLogo size={40} />
            </motion.span>
            <span>
              Daka<em>Travels</em>
            </span>
          </a>
          <ul className="nav-links" onMouseLeave={() => setHovered(null)}>
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} onMouseEnter={() => setHovered(l.href)} aria-current={current === l.href ? "location" : undefined}>
                  {marked === l.href && (
                    <motion.span className="nav-blob" layoutId="nav-blob" transition={{ type: "spring", stiffness: 420, damping: 32 }} />
                  )}
                  <span className="nav-label">{l.label}</span>
                </a>
              </li>
            ))}
          </ul>
          <a href="#book" className="ticket desktop">
            <span className="ticket-body">
              Book
              <span className="ticket-stub">→</span>
            </span>
          </a>
          <button className="burger" aria-label="Menu" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
            <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden>
              {open ? (
                <path d="M4 4l14 14M18 4 4 18" stroke="var(--ink)" strokeWidth="3" strokeLinecap="round" />
              ) : (
                <path d="M3 6h16M3 11h12M3 16h16" stroke="var(--ink)" strokeWidth="3" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </nav>
        <div className="nav-road" aria-hidden>
          <motion.span className="nav-van" style={{ left: vanLeft }}>
            <MiniVan />
          </motion.span>
        </div>
        <AnimatePresence>
          {open && (
            <motion.div
              className="mobile-menu"
              initial={{ opacity: 0, y: -14, rotate: -2 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              exit={{ opacity: 0, y: -14 }}
            >
              {[...links, { href: "#book", label: "Book a trip →" }].map((l, i) => (
                <motion.a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i }}
                >
                  <span className="hand">0{i + 1}</span> {l.label}
                </motion.a>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
