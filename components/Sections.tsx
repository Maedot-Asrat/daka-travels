"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import type { ReactNode } from "react";
import { Check, KeyDoodle, Squiggle, TentDoodle } from "./Doodles";

export function Reveal({ children, delay = 0, y = 40, className }: { children: ReactNode; delay?: number; y?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, rotate: 1.5 }}
      whileInView={{ opacity: 1, y: 0, rotate: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ type: "spring", stiffness: 90, damping: 16, delay }}
    >
      {children}
    </motion.div>
  );
}

const rowA = ["Wenchi Crater", "Lake Langano", "Wondo Genet", "Arba Minch"];
const rowB = ["Bilingual drivers", "24/7 roadside support", "Vetted lodges", "Guided hikes", "Eco-adventures"];

function Track({ items, sep }: { items: string[]; sep: string }) {
  return (
    <div className="marquee-track" aria-hidden>
      {items.map((t) => (
        <span className="marquee-item" key={t}>
          {t} <span className="hand">{sep}</span>
        </span>
      ))}
    </div>
  );
}

export function Marquee() {
  return (
    <div className="marquee-wrap" role="presentation">
      <div className="marquee">
        <Track items={rowA} sep="✦" />
        <Track items={rowA} sep="✦" />
        <Track items={rowA} sep="✦" />
      </div>
      <div className="marquee alt">
        <Track items={rowB} sep="~" />
        <Track items={rowB} sep="~" />
        <Track items={rowB} sep="~" />
      </div>
    </div>
  );
}

function TiltCard({ children }: { children: ReactNode }) {
  const rx = useSpring(useMotionValue(0), { stiffness: 150, damping: 15 });
  const ry = useSpring(useMotionValue(0), { stiffness: 150, damping: 15 });
  return (
    <motion.article
      className="service-card"
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 900 }}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        ry.set(((e.clientX - r.left) / r.width - 0.5) * 8);
        rx.set(-((e.clientY - r.top) / r.height - 0.5) * 8);
      }}
      onPointerLeave={() => {
        rx.set(0);
        ry.set(0);
      }}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ type: "spring", stiffness: 80, damping: 15 }}
    >
      {children}
    </motion.article>
  );
}

export function Services() {
  return (
    <section className="section" id="services">
      <div className="container">
        <div className="services-head">
          <Reveal>
            <span className="eyebrow">01 · what we do</span>
            <h2 className="section-title">
              Two ways to <br />
              <span className="highlight">
                hit the road
                <Squiggle />
              </span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="section-lead">
              We bridge the gap between convenience and adventure: a reliable, maintained fleet paired with
              custom-crafted tours, for safe and authentic Ethiopian memories.
            </p>
          </Reveal>
        </div>

        <div className="services-grid">
          <TiltCard>
            <KeyDoodle />
            <span className="num">no. 1</span>
            <h3>Premium car rentals</h3>
            <p className="muted">
              Built for city commutes and rural exploration across Ethiopia&apos;s rugged landscapes.
            </p>
            <ul>
              <li><Check color="var(--gold)" /> Experienced, safety-certified bilingual drivers</li>
              <li><Check color="var(--gold)" /> Deep local knowledge of highways and mountain paths</li>
              <li><Check color="var(--gold)" /> Secure, hassle-free transit, door to door</li>
            </ul>
            <a href="#fleet" className="btn" style={{ marginTop: 18 }}>
              Pick a ride <span className="arrow">→</span>
            </a>
          </TiltCard>
          <TiltCard>
            <TentDoodle />
            <span className="num">no. 2</span>
            <h3>Curated group travel</h3>
            <p className="muted">
              All-inclusive getaways made for families and groups of friends who want high-quality leisure.
            </p>
            <ul>
              <li><Check color="var(--gold)" /> Comfortable transport the whole way</li>
              <li><Check color="var(--gold)" /> Vetted lodges and lakeside resorts</li>
              <li><Check color="var(--gold)" /> Guided hiking and local eco-adventures</li>
            </ul>
            <a href="#destinations" className="btn ghost" style={{ marginTop: 18 }}>
              See destinations <span className="arrow">→</span>
            </a>
          </TiltCard>
        </div>
      </div>
    </section>
  );
}
