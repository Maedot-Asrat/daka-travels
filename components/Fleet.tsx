"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { fleet } from "@/lib/data";
import { Seat, Squiggle } from "./Doodles";
import { Reveal } from "./Sections";

function Meter({ level, color }: { level: number; color: string }) {
  return (
    <div className="meter" style={{ ["--c" as string]: color }}>
      {[1, 2, 3].map((n) => (
        <motion.i
          key={n}
          className={n <= level ? "on" : ""}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.15 + n * 0.08 }}
          style={{ originX: 0 }}
        />
      ))}
    </div>
  );
}

function Dust() {
  return (
    <div style={{ position: "absolute", left: "8%", bottom: "12%", zIndex: 2 }} aria-hidden>
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          style={{
            position: "absolute",
            width: 26 - i * 5,
            height: 26 - i * 5,
            borderRadius: "50%",
            border: "2.5px solid var(--ink)",
            background: "var(--paper)",
          }}
          initial={{ x: 0, y: 0, opacity: 0, scale: 0.4 }}
          animate={{ x: -60 - i * 30, y: -10 - i * 8, opacity: [0, 1, 0], scale: 1.2 }}
          transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.3, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}

export default function Fleet() {
  const [idx, setIdx] = useState(0);
  const [dir, setDir] = useState(1);
  const v = fleet[idx];

  const pick = (i: number) => {
    if (i === idx) return;
    setDir(i > idx ? 1 : -1);
    setIdx(i);
  };

  return (
    <section className="section fleet" id="fleet">
      <div className="container">
        <Reveal>
          <span className="eyebrow">02 · the garage</span>
          <h2 className="section-title">
            A fleet for{" "}
            <span className="highlight">
              every road
              <Squiggle color="var(--green)" />
            </span>
          </h2>
          <p className="section-lead">
            From smooth highways to the dirt tracks of the highlands, every vehicle gets a mechanical check
            before it leaves the lot. Tap one to take it for a spin.
          </p>
        </Reveal>

        <div className="fleet-tabs" role="tablist" aria-label="Vehicles">
          {fleet.map((f, i) => (
            <button key={f.id} role="tab" aria-selected={i === idx} className="fleet-tab" onClick={() => pick(i)}>
              <span className="thumb">
                <Image src={f.cutout} alt="" width={80} height={56} />
              </span>
              {f.name.replace("Toyota ", "").replace("Hyundai ", "")}
            </button>
          ))}
        </div>

        <div className="garage" role="tabpanel">
          <div className="stage">
            <motion.div
              className="stage-blob"
              animate={{ backgroundColor: v.color, rotate: idx * 8 - 8 }}
              transition={{ type: "spring", stiffness: 60, damping: 14 }}
            />
            <svg className="stage-road" viewBox="0 0 100 8" preserveAspectRatio="none" aria-hidden>
              <path d="M0 4h100" stroke="var(--ink)" strokeWidth="1.2" strokeDasharray="4 3" />
            </svg>
            <AnimatePresence mode="popLayout" custom={dir} initial={false}>
              <motion.div
                key={v.id + "-year"}
                className="year-tag"
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: 1, rotate: -8 }}
                exit={{ scale: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
              >
                ’{v.year.slice(2)}
              </motion.div>
              <motion.div
                key={v.id + "-photo"}
                className="polaroid"
                initial={{ y: -40, opacity: 0, rotate: 20 }}
                animate={{ y: 0, opacity: 1, rotate: 6 }}
                exit={{ y: 30, opacity: 0, rotate: -10 }}
                transition={{ type: "spring", stiffness: 160, damping: 14, delay: 0.25 }}
              >
                <span className="tape" />
                <Image src={v.photo} alt={`${v.name} photo`} width={340} height={255} />
                <span>the real one!</span>
              </motion.div>
              <motion.div
                key={v.id}
                className="stage-car"
                custom={dir}
                variants={{
                  enter: (d: number) => ({ x: d > 0 ? "110%" : "-110%", rotate: d > 0 ? 4 : -4 }),
                  center: { x: 0, rotate: 0 },
                  exit: (d: number) => ({ x: d > 0 ? "-110%" : "110%", rotate: d > 0 ? -4 : 4 }),
                }}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: "spring", stiffness: 70, damping: 13 }}
              >
                <motion.img
                  src={v.cutout}
                  alt={`${v.name} ${v.year}`}
                  animate={{ y: [0, -3, 0] }}
                  transition={{ repeat: Infinity, duration: 0.5 }}
                />
              </motion.div>
            </AnimatePresence>
            <Dust />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={v.id}
              className="spec"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
            >
              <span className="nick">{v.nickname}</span>
              <h3>
                {v.name} {v.year}
              </h3>
              <p className="tagline">{v.tagline}</p>

              <div className="seats" aria-label={`Seats ${v.seats[0]} to ${v.seats[1]} passengers`}>
                <span className="label">
                  {v.seats[0]}–{v.seats[1]} passengers
                </span>
                {Array.from({ length: 10 }).map((_, i) => (
                  <motion.span
                    key={i}
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 + i * 0.04 }}
                  >
                    <Seat filled={i < v.seats[1]} />
                  </motion.span>
                ))}
              </div>

              <div className="terrain">
                <div className="terrain-row">Highway <Meter level={v.terrain.road} color={v.color} /></div>
                <div className="terrain-row">Gravel <Meter level={v.terrain.gravel} color={v.color} /></div>
                <div className="terrain-row">Off-road <Meter level={v.terrain.offroad} color={v.color} /></div>
              </div>

              <ul className="feature-list">
                {v.features.map((f) => (
                  <li key={f.title}>
                    <b>{f.title}</b>
                    {f.text}
                  </li>
                ))}
              </ul>
              <div className="chips">
                {v.bestFor.map((b) => (
                  <span className="chip" key={b}>{b}</span>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
