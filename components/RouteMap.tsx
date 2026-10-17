"use client";

import Image from "next/image";
import { motion, useMotionValueEvent, useScroll, useSpring } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { destinations, fleet } from "@/lib/data";
import { Check, Squiggle } from "./Doodles";
import { Reveal } from "./Sections";

const ROUTE =
  "M330 80 C 250 96, 140 140, 122 232 C 104 324, 296 300, 356 372 C 404 426, 474 452, 432 506 C 384 572, 252 604, 214 690";

const stops = [
  { id: "addis", name: "Addis Ababa", x: 330, y: 80, km: 0 },
  { id: "wenchi", name: "Wenchi Crater", x: 122, y: 232, km: 155 },
  { id: "langano", name: "Lake Langano", x: 356, y: 372, km: 200 },
  { id: "wondo", name: "Wondo Genet", x: 432, y: 506, km: 270 },
  { id: "arbaminch", name: "Arba Minch", x: 214, y: 690, km: 450 },
];

function Van() {
  return (
    <g>
      <rect x="-22" y="-16" width="42" height="22" rx="6" fill="var(--gold)" stroke="var(--ink)" strokeWidth="3" />
      <path d="M8 -16h6a6 6 0 0 1 6 6v6H8Z" fill="var(--sky)" stroke="var(--ink)" strokeWidth="2.5" strokeLinejoin="round" />
      <rect x="-16" y="-12" width="9" height="7" rx="2" fill="var(--sky)" stroke="var(--ink)" strokeWidth="2" />
      <rect x="-4" y="-12" width="9" height="7" rx="2" fill="var(--sky)" stroke="var(--ink)" strokeWidth="2" />
      <circle cx="-11" cy="7" r="5" fill="var(--ink)" />
      <circle cx="10" cy="7" r="5" fill="var(--ink)" />
      <circle cx="-11" cy="7" r="1.8" fill="var(--paper)" />
      <circle cx="10" cy="7" r="1.8" fill="var(--paper)" />
    </g>
  );
}

export default function RouteMap() {
  const section = useRef<HTMLElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const vanRef = useRef<SVGGElement>(null);
  const [marks, setMarks] = useState<number[]>([0, 0.25, 0.5, 0.7, 1]);
  const [reached, setReached] = useState(0);

  const { scrollYProgress } = useScroll({ target: section, offset: ["start 0.6", "end 0.9"] });
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 24, restDelta: 0.001 });

  // Work out where along the road each stop sits.
  useEffect(() => {
    const p = pathRef.current;
    if (!p) return;
    const total = p.getTotalLength();
    const found = stops.map((s) => {
      let best = 0;
      let bestD = Infinity;
      for (let i = 0; i <= 400; i++) {
        const pt = p.getPointAtLength((i / 400) * total);
        const d = (pt.x - s.x) ** 2 + (pt.y - s.y) ** 2;
        if (d < bestD) {
          bestD = d;
          best = i / 400;
        }
      }
      return best;
    });
    setMarks(found);
    placeVan(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const placeVan = (t: number) => {
    const p = pathRef.current;
    const g = vanRef.current;
    if (!p || !g) return;
    const total = p.getTotalLength();
    const l = Math.max(0.001, Math.min(1, t)) * total;
    const a = p.getPointAtLength(Math.max(0, l - 2));
    const b = p.getPointAtLength(Math.min(total, l + 2));
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const flip = dx < 0 ? -1 : 1;
    let ang = (Math.atan2(dy, Math.abs(dx)) * 180) / Math.PI;
    ang = Math.max(-28, Math.min(28, ang)) * flip;
    const pt = p.getPointAtLength(l);
    g.setAttribute("transform", `translate(${pt.x} ${pt.y - 10}) rotate(${ang}) scale(${flip} 1)`);
  };

  useMotionValueEvent(progress, "change", (t) => {
    placeVan(t);
    let r = 0;
    marks.forEach((m, i) => {
      if (t >= m - 0.01) r = i;
    });
    if (r !== reached) setReached(r);
  });

  return (
    <section className="section" id="destinations" ref={section}>
      <div className="container">
        <Reveal>
          <span className="eyebrow">03 · where we go</span>
          <h2 className="section-title">
            Four escapes,
            <br />
            <span className="highlight">
              one road trip
              <Squiggle />
            </span>
          </h2>
          <p className="section-lead" style={{ marginBottom: 60 }}>
            Seamless group travel to four of the country&apos;s most spectacular ecosystems. Scroll and watch
            the van drive south from Addis.
          </p>
        </Reveal>

        <div className="route-grid">
          <div className="map-sticky">
            <div className="map-card">
              <svg viewBox="0 0 560 760" role="img" aria-label="Illustrated route map from Addis Ababa to Wenchi, Langano, Wondo Genet and Arba Minch">
                {/* landscape doodles */}
                <g className="boil" fill="none" stroke="var(--ink)" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round">
                  <path d="M40 120l26-40 22 30 18-22 30 32" fill="var(--green-soft)" />
                  <path d="M430 230l30-46 34 46" fill="var(--green-soft)" />
                  <path d="M470 230l22-30 26 30" fill="var(--green-soft)" />
                  <ellipse cx="122" cy="232" rx="54" ry="38" fill="var(--sky)" />
                  <ellipse cx="128" cy="236" rx="10" ry="6" fill="var(--green-soft)" />
                  <path d="M318 360c10-24 70-28 88-4 10 18-20 40-52 36s-44-14-36-32Z" fill="var(--sky)" />
                  <path d="M150 640c-6-26 28-40 46-28 10 8 4 30-10 36s-32 6-36-8Z" fill="var(--sky)" />
                  <path d="M210 718c0-14 28-22 44-12 10 8 0 26-16 28s-28-4-28-16Z" fill="var(--sky)" />
                  {[
                    [470, 560], [500, 590], [452, 600], [70, 420], [96, 450], [60, 470],
                  ].map(([x, y]) => (
                    <g key={`${x}-${y}`}>
                      <path d={`M${x} ${y}l-12 22h24Z`} fill="var(--green)" />
                      <path d={`M${x} ${y + 22}v8`} />
                    </g>
                  ))}
                  {/* compass */}
                  <g transform="translate(480 90)">
                    <circle r="30" fill="var(--card)" />
                    <path d="M0-24 7 0 0 24-7 0Z" fill="var(--gold)" />
                    <text y="-34" textAnchor="middle" fontFamily="var(--font-hand)" fontSize="22" fill="var(--ink)" stroke="none">N</text>
                  </g>
                </g>

                {/* ghost road */}
                <path d={ROUTE} fill="none" stroke="var(--ink)" strokeOpacity=".18" strokeWidth="14" strokeLinecap="round" />
                <path d={ROUTE} fill="none" stroke="var(--paper-2)" strokeWidth="8" strokeLinecap="round" />
                {/* drawn road */}
                <motion.path
                  ref={pathRef}
                  d={ROUTE}
                  fill="none"
                  stroke="var(--coral)"
                  strokeWidth="6"
                  strokeLinecap="round"
                  style={{ pathLength: progress }}
                />
                <path d={ROUTE} fill="none" stroke="var(--paper)" strokeWidth="1.8" strokeDasharray="6 10" />

                {stops.map((s, i) => {
                  const on = reached >= i;
                  const left = s.x > 300;
                  return (
                    <g key={s.id} transform={`translate(${s.x} ${s.y})`}>
                      <motion.g
                        animate={{ scale: on ? 1 : 0.55, y: on ? 0 : 6 }}
                        transition={{ type: "spring", stiffness: 380, damping: 12 }}
                      >
                        <path
                          d="M0 0c-14-16-20-26-20-36a20 20 0 0 1 40 0c0 10-6 20-20 36Z"
                          fill={i === 0 ? "var(--ink)" : on ? "var(--gold)" : "var(--card)"}
                          stroke="var(--ink)"
                          strokeWidth="3"
                        />
                        <circle cy="-36" r="7" fill={i === 0 ? "var(--gold)" : "var(--card)"} stroke="var(--ink)" strokeWidth="2.5" />
                      </motion.g>
                      <motion.text
                        x={left ? -30 : s.id === "wenchi" ? 62 : 30}
                        y={-30}
                        textAnchor={left ? "end" : "start"}
                        fontFamily="var(--font-hand)"
                        fontWeight={700}
                        fontSize="30"
                        fill="var(--ink)"
                        animate={{ opacity: on ? 1 : 0.35 }}
                      >
                        {s.name}
                      </motion.text>
                      {s.km > 0 && (
                        <motion.text
                          x={left ? -30 : s.id === "wenchi" ? 62 : 30}
                          y={-6}
                          textAnchor={left ? "end" : "start"}
                          fontWeight={800}
                          fontSize="16"
                          fill="var(--coral)"
                          animate={{ opacity: on ? 1 : 0 }}
                        >
                          {s.km} km from Addis
                        </motion.text>
                      )}
                    </g>
                  );
                })}

                <g ref={vanRef}>
                  <Van />
                </g>
              </svg>
              <span className="map-note">not to scale, but full of love</span>
            </div>
          </div>

          <div className="dest-list">
            {destinations.map((d, i) => {
              const ride = fleet.find((f) => f.id === d.ride)!;
              return (
                <Reveal key={d.id} className="dest-card" delay={0.05}>
                  <motion.span
                    className="dest-km"
                    initial={{ scale: 0, rotate: -20 }}
                    whileInView={{ scale: 1, rotate: 6 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 300, damping: 12, delay: 0.3 }}
                  >
                    {d.km} km
                  </motion.span>
                  <div className="dest-photo" style={{ rotate: i % 2 ? "1.2deg" : "-1.2deg" }}>
                    <Image src={d.photo} alt={d.name} fill sizes="(max-width: 980px) 90vw, 560px" />
                  </div>
                  <div className="dest-body">
                    <span className="kicker">{d.kicker}</span>
                    <h3>{d.name}</h3>
                    <p>{d.blurb}</p>
                    <ul>
                      {d.highlights.map((h) => (
                        <li key={h}>
                          <Check size={22} /> {h}
                        </li>
                      ))}
                    </ul>
                    <span className="ride-pill">
                      <Image src={ride.cutout} alt="" width={60} height={40} />
                      Best ride: {ride.name.replace("Toyota ", "").replace("Hyundai ", "")}
                    </span>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
