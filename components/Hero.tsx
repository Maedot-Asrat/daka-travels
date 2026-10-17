"use client";

import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { destinations, fleet } from "@/lib/data";
import { Cloud, HatLogo, Squiggle, Sun } from "./Doodles";

const START = 1.25; // after the intro curtain
const FLAP_LEN = Math.max(...destinations.map((d) => d.name.length));
const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const rideLabel: Record<string, string> = { starex: "VAN", hiace: "HIACE", landcruiser: "4×4" };

// Wobbly contour lines, like a topo map, drawn behind the postcards.
const topo = Array.from({ length: 9 }, (_, k) => {
  const r = 50 + k * 44;
  let d = "";
  for (let a = 0; a <= 72; a++) {
    const t = (a / 72) * Math.PI * 2;
    const rr = r + Math.sin(t * 3 + k * 0.7) * 14 + Math.cos(t * 5 + k) * 8;
    d += `${a ? "L" : "M"}${(500 + Math.cos(t) * rr * 1.35).toFixed(1)} ${(420 + Math.sin(t) * rr).toFixed(1)}`;
  }
  return d + "Z";
});

/** Split-flap text: letters scramble, then settle left to right. Re-runs when `trigger` changes. */
function Flap({ text, delay, trigger }: { text: string; delay: number; trigger: number }) {
  const target = text.toUpperCase().padEnd(FLAP_LEN, " ");
  const [shown, setShown] = useState(" ".repeat(FLAP_LEN));
  const first = useRef(true);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(target);
      return;
    }
    let frame = 0;
    let id: number | undefined;
    const start = window.setTimeout(
      () => {
        id = window.setInterval(() => {
          frame++;
          setShown(
            target
              .split("")
              .map((c, i) => (c === " " || frame > 3 + i ? c : LETTERS[(Math.random() * 26) | 0]))
              .join("")
          );
          if (frame > 4 + FLAP_LEN) window.clearInterval(id);
        }, 42);
      },
      first.current ? delay : 0
    );
    first.current = false;
    return () => {
      window.clearTimeout(start);
      window.clearInterval(id);
    };
  }, [target, delay, trigger]);

  return (
    <span className="flap" aria-label={text}>
      {shown.split("").map((c, i) => (
        <span key={i} aria-hidden className={target[i] === " " ? "blank" : ""}>
          {c}
        </span>
      ))}
    </span>
  );
}

function AddisClock() {
  const [now, setNow] = useState("");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Africa/Addis_Ababa" });
    const tick = () => setNow(fmt.format(new Date()));
    tick();
    const id = window.setInterval(tick, 10_000);
    return () => window.clearInterval(id);
  }, []);
  return <span className="board-clock">{now || "--:--"}</span>;
}

// Where each postcard sits, by how far it is from the front of the stack.
const stack = [
  { x: "0%", y: "0%", rotate: -3, scale: 1 },
  { x: "9%", y: "-5%", rotate: 6, scale: 0.93 },
  { x: "-8%", y: "-9%", rotate: -9, scale: 0.86 },
  { x: "4%", y: "-13%", rotate: 11, scale: 0.8 },
];

export default function Hero() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [flips, setFlips] = useState(0);
  const dest = destinations[active];

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 80, damping: 18 });
  const sy = useSpring(my, { stiffness: 80, damping: 18 });
  const far = { x: useTransform(sx, (v) => v * -12), y: useTransform(sy, (v) => v * -12) };
  const near = { x: useTransform(sx, (v) => v * 22), y: useTransform(sy, (v) => v * 14) };

  const choose = (i: number) => {
    if (i === active) return;
    setActive(i);
    setFlips((f) => f + 1);
  };

  useEffect(() => {
    if (paused) return;
    const t = window.setTimeout(() => choose((active + 1) % destinations.length), active === 0 && flips === 0 ? 6000 : 4500);
    return () => window.clearTimeout(t);
  });

  return (
    <section
      className="hero"
      id="top"
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        mx.set(e.clientX / window.innerWidth - 0.5);
        my.set(e.clientY / window.innerHeight - 0.5);
      }}
    >
      <div className="container hero-grid">
        <div className="hero-copy">
          <h1>
            {[
              <>Pack light.</>,
              <>
                Ride{" "}
                <span className="highlight">
                  easy.
                  <Squiggle color="var(--coral)" delay={START + 0.9} />
                </span>
              </>,
              <span className="gold">See Ethiopia.</span>,
            ].map((l, i) => (
              <span className="line" key={i}>
                <motion.span
                  initial={{ y: "110%", rotate: 6 }}
                  animate={{ y: "0%", rotate: 0 }}
                  transition={{ delay: START + 0.1 + i * 0.12, type: "spring", stiffness: 120, damping: 16 }}
                >
                  {l}
                </motion.span>
              </span>
            ))}
          </h1>
          <motion.p
            className="lead"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: START + 0.5 }}
          >
            Car rentals and group trips across Ethiopia.
          </motion.p>

          <motion.div
            className="board"
            initial={{ opacity: 0, y: 24, rotate: 1.5 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            transition={{ delay: START + 0.6, type: "spring", stiffness: 140, damping: 16 }}
            onPointerEnter={() => setPaused(true)}
            onPointerLeave={() => setPaused(false)}
          >
            <div className="board-head">
              <span>Departures · Addis Ababa</span>
              <AddisClock />
            </div>
            {destinations.map((d, i) => (
              <button
                key={d.id}
                className={`board-row${i === active ? " on" : ""}`}
                aria-pressed={i === active}
                onMouseEnter={() => choose(i)}
                onFocus={() => choose(i)}
                onClick={() => choose(i)}
              >
                <span className="board-num">0{i + 1}</span>
                <Flap text={d.name} delay={(START + 0.8) * 1000 + i * 180} trigger={i === active ? flips : 0} />
                <span className="board-km">{d.km} km</span>
                <span className="board-ride">{rideLabel[d.ride]}</span>
              </button>
            ))}
          </motion.div>

          <motion.div
            className="hero-ctas"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: START + 0.8 }}
          >
            <a className="btn" href="#book">
              Book {dest.name} <span className="arrow">→</span>
            </a>
            <a className="text-link" href="#fleet">
              Our cars
            </a>
          </motion.div>
        </div>

        <motion.div
          className="hero-art"
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: START, type: "spring", stiffness: 90, damping: 14 }}
          onPointerEnter={() => setPaused(true)}
          onPointerLeave={() => setPaused(false)}
        >
          <svg className="topo" viewBox="0 0 1000 840" aria-hidden>
            {topo.map((d, i) => (
              <path key={i} d={d} />
            ))}
          </svg>

          <motion.div style={{ ...far, position: "absolute", inset: 0, pointerEvents: "none" }}>
            <Sun className="hero-sun" />
            <Cloud className="hero-cloud drift" style={{ width: "26%", top: "4%", left: "-2%" }} />
          </motion.div>

          <div className="postcards">
            {destinations.map((d, i) => {
              const pos = (i - active + destinations.length) % destinations.length;
              return (
                <motion.button
                  key={d.id}
                  className={`postcard${pos === 0 ? " front" : ""}`}
                  aria-label={`Show ${d.name}`}
                  tabIndex={-1}
                  onClick={() => choose((active + 1) % destinations.length)}
                  initial={false}
                  animate={{ ...stack[pos], zIndex: destinations.length - pos }}
                  transition={{ type: "spring", stiffness: 160, damping: 20 }}
                >
                  <div className="pc-photo">
                    <Image src={d.photo} alt={d.name} fill sizes="(max-width: 980px) 80vw, 460px" priority={i === 0} />
                  </div>
                  <div className="pc-caption">
                    <span className="hand">{d.name}</span>
                  </div>
                  <span className="pc-stamp" aria-hidden>
                    <HatLogo size={34} />
                    <b>ETHIOPIA</b>
                  </span>
                  <span className="pc-postmark" aria-hidden>
                    ADDIS
                    <br />
                    {d.km}KM
                  </span>
                </motion.button>
              );
            })}
          </div>

          <div className="hero-road" aria-hidden />
          <motion.div className="hero-car" style={near}>
            <motion.div
              initial={{ x: "-130%", rotate: -4 }}
              animate={{ x: 0, rotate: 0 }}
              transition={{ delay: START + 0.35, type: "spring", stiffness: 70, damping: 11 }}
            >
              <motion.div
                animate={{ y: [0, -4, 0], rotate: [0, -0.6, 0] }}
                transition={{ repeat: Infinity, duration: 0.6, ease: "easeInOut" }}
              >
                <motion.div
                  key={dest.ride}
                  initial={{ x: -50, rotate: -4, scale: 0.92 }}
                  animate={{ x: 0, rotate: 0, scale: 1 }}
                  transition={{ type: "spring", stiffness: 180, damping: 14 }}
                >
                  <Image
                    src={fleet.find((v) => v.id === dest.ride)?.cutout ?? "/images/starex-cut.webp"}
                    alt="A Daka Travels vehicle"
                    width={900}
                    height={600}
                    priority
                  />
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
