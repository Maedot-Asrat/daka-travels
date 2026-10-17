"use client";

import Image from "next/image";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { contact, fleet, steps, type Vehicle } from "@/lib/data";
import { Arrow, Check, HatLogo, Squiggle } from "./Doodles";
import { Reveal } from "./Sections";

/* ---------------- Ride picker (from the fleet suitability matrix) ---------------- */

const trips = [
  { id: "city", label: "City & airport", ride: "starex" },
  { id: "langano", label: "Lake Langano", ride: "starex" },
  { id: "wondo", label: "Wondo Genet", ride: "starex" },
  { id: "arbaminch", label: "Arba Minch", ride: "hiace" },
  { id: "wenchi", label: "Wenchi crater trails", ride: "landcruiser" },
  { id: "mountain", label: "Mountain safari", ride: "landcruiser" },
] as const;

function recommend(tripRide: Vehicle["id"], people: number) {
  const base = fleet.find((f) => f.id === tripRide)!;
  if (people <= base.seats[1]) {
    return { vehicles: [base], note: base.tagline };
  }
  if (base.id !== "starex" && people <= 10) {
    const starex = fleet.find((f) => f.id === "starex")!;
    if (base.id === "hiace") {
      return { vehicles: [starex], note: "Too many for the Hiace, so we'd move you up to the Grand Starex, which seats up to 10." };
    }
    return {
      vehicles: [base, starex],
      note: "The Land Cruiser tackles the rough stretch; the Starex carries the rest of the crew in comfort on the paved legs.",
    };
  }
  const count = Math.ceil(people / 10);
  const starex = fleet.find((f) => f.id === "starex")!;
  return {
    vehicles: base.id === "landcruiser" ? [base, starex] : [starex],
    note: `A big group! We'd run a convoy of about ${count} vehicles. Get in touch and we'll plan it together.`,
  };
}

export function RidePicker() {
  const [trip, setTrip] = useState<(typeof trips)[number]>(trips[1]);
  const [people, setPeople] = useState(6);
  const rec = recommend(trip.ride, people);
  const key = rec.vehicles.map((v) => v.id).join("+");

  return (
    <section className="section picker" id="picker">
      <div className="container">
        <Reveal>
          <span className="eyebrow" style={{ color: "var(--gold)" }}>04 · ride matchmaker</span>
          <h2 className="section-title">Which ride for which road?</h2>
          <p className="section-lead">Tell us where you&apos;re headed and how many are coming. We&apos;ll match the right vehicle.</p>
        </Reveal>
        <div className="picker-grid">
          <div className="picker-panel">
            <h4>Where to?</h4>
            <div className="option-grid">
              {trips.map((t) => (
                <button key={t.id} className="option" aria-pressed={trip.id === t.id} onClick={() => setTrip(t)}>
                  {t.label}
                </button>
              ))}
            </div>
            <h4>How many travellers?</h4>
            <div className="stepper">
              <button aria-label="Fewer travellers" onClick={() => setPeople((p) => Math.max(1, p - 1))}>−</button>
              <output aria-live="polite">{people}</output>
              <button aria-label="More travellers" onClick={() => setPeople((p) => Math.min(30, p + 1))}>+</button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={key + trip.id}
              className="result-card"
              initial={{ rotate: -4, y: 30, opacity: 0 }}
              animate={{ rotate: 0, y: 0, opacity: 1 }}
              exit={{ rotate: 4, y: -20, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 18 }}
            >
              <span className="hand">we&apos;d send…</span>
              <h3>{rec.vehicles.map((v) => v.name.replace("Toyota ", "").replace("Hyundai ", "")).join(" + ")}</h3>
              <p>{rec.note}</p>
              <div style={{ display: "flex", gap: 10, alignItems: "end", marginTop: "auto" }}>
                {rec.vehicles.map((v, i) => (
                  <motion.div
                    key={v.id}
                    initial={{ x: 120, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 90, damping: 12, delay: 0.1 + i * 0.12 }}
                    style={{ flex: 1 }}
                  >
                    <Image src={v.cutout} alt={v.name} width={400} height={280} />
                  </motion.div>
                ))}
              </div>
              <a href="#book" className="btn dark" style={{ alignSelf: "start" }}>
                Book this ride <span className="arrow">→</span>
              </a>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Process ---------------- */

export function Process() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.8", "end 0.5"] });
  const draw = useTransform(scrollYProgress, [0, 1], [0, 1]);
  return (
    <section className="section" id="how">
      <div className="container">
        <Reveal>
          <span className="eyebrow">05 · how it works</span>
          <h2 className="section-title">
            Booking is a{" "}
            <span className="highlight">
              four-stop trip
              <Squiggle color="var(--green)" />
            </span>
          </h2>
          <p className="section-lead">A streamlined reservation process, built for total transparency and speed.</p>
        </Reveal>
        <div className="steps" ref={ref}>
          <svg className="steps-line" viewBox="0 0 1200 80" preserveAspectRatio="none" aria-hidden>
            <motion.path
              d="M40 40 C 200 120, 260 -20, 450 40 S 700 120, 760 40 S 1000 -20, 1160 60"
              stroke="var(--ink)"
              strokeWidth="3"
              strokeDasharray="10 10"
              fill="none"
              style={{ pathLength: draw }}
            />
          </svg>
          {steps.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.12} className="step">
              <motion.div
                className="step-num"
                style={{ background: ["var(--gold)", "var(--coral)", "var(--green)", "var(--sky)"][i], color: i === 2 ? "var(--paper)" : undefined }}
                whileHover={{ rotate: 12, scale: 1.08 }}
              >
                {i + 1}
              </motion.div>
              <div className="step-card">
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Safety ---------------- */

export function Safety() {
  return (
    <section className="section" style={{ background: "var(--paper-2)", borderBlock: "2.5px solid var(--ink)" }}>
      <div className="container safety-grid">
        <Reveal>
          <div className="big-num">
            <svg viewBox="0 0 400 300" preserveAspectRatio="none" aria-hidden>
              <motion.path
                d="M60 160C40 70 180 20 290 40s110 120 40 190-230 60-280-10C20 180 70 90 160 70"
                stroke="var(--coral)"
                strokeWidth="6"
                fill="none"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.4, ease: "easeInOut", delay: 0.3 }}
              />
            </svg>
            100%
            <small>peace of mind</small>
          </div>
        </Reveal>
        <div>
          <Reveal>
            <span className="eyebrow">06 · our promise</span>
            <h2 className="section-title">Safety rides shotgun</h2>
            <p className="section-lead">
              Group travel should be completely stress-free. That&apos;s why every vehicle in our fleet goes through a
              mechanical check before it&apos;s deployed.
            </p>
          </Reveal>
          <div className="checks">
            {[
              "Mechanical checkups before every deployment",
              "Safety-certified, bilingual drivers",
              "24/7 technical roadside support",
              "Planned fuel, refreshment and safety stops",
            ].map((c, i) => (
              <Reveal key={c} delay={i * 0.08} y={20}>
                <div className="check">
                  <Check size={30} /> {c}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Quote ---------------- */

const quote =
  "Travel is not about ticking off boxes. It is about discovering new perspectives, sharing stories with those we love, and exploring the boundless beauty of Ethiopia in absolute peace.";

export function Quote() {
  return (
    <section className="quote">
      <div className="container">
        <blockquote>
          {quote.split(" ").map((w, i) => (
            <motion.span
              key={i}
              className="word"
              initial={{ opacity: 0.12, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20% 0px -20% 0px" }}
              transition={{ delay: i * 0.035 }}
              style={["Ethiopia", "peace."].includes(w) ? { color: "var(--coral)" } : undefined}
            >
              {w}
            </motion.span>
          ))}
        </blockquote>
        <cite>— the Daka Travels philosophy</cite>
      </div>
    </section>
  );
}

/* ---------------- Contact / booking ---------------- */

export function Contact() {
  const [sent, setSent] = useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const body = [
      `Name: ${f.get("name")}`,
      `Phone: ${f.get("phone")}`,
      `Service: ${f.get("service")}`,
      `Destination: ${f.get("destination")}`,
      `Date: ${f.get("date")}`,
      `Travellers: ${f.get("people")}`,
      "",
      `${f.get("notes") ?? ""}`,
    ].join("\n");
    window.location.href = `mailto:${contact.email}?subject=${encodeURIComponent("Trip request: " + f.get("destination"))}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  return (
    <section className="section contact-wrap" id="book">
      <div className="container contact-grid">
        <Reveal>
          <span className="eyebrow" style={{ color: "var(--ink)" }}>07 · let&apos;s go</span>
          <h2 className="section-title">
            Let&apos;s plan
            <br /> your journey
          </h2>
          <p className="section-lead" style={{ color: "var(--ink)" }}>
            Tell us where and when. We&apos;ll come back with a plan, a vehicle and a driver who knows the way.
          </p>
          <Arrow className="float-slow" style={{ width: 120, marginTop: 20 }} />
          <div className="contact-info">
            <a href={contact.phoneHref}>
              <span aria-hidden>☎</span> {contact.phone}
            </a>
            <a href={`mailto:${contact.email}`}>
              <span aria-hidden>✉</span> {contact.email}
            </a>
            <div>
              <span aria-hidden>⌖</span> {contact.address}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <form className="form" onSubmit={onSubmit}>
            <h3>Request a booking</h3>
            <div className="row-2">
              <div className="field">
                <label htmlFor="name">Your name</label>
                <input id="name" name="name" required autoComplete="name" />
              </div>
              <div className="field">
                <label htmlFor="phone">Phone</label>
                <input id="phone" name="phone" type="tel" required autoComplete="tel" placeholder="+251…" />
              </div>
            </div>
            <div className="row-2">
              <div className="field">
                <label htmlFor="service">I need</label>
                <select id="service" name="service">
                  <option>A group tour package</option>
                  <option>A car rental with driver</option>
                  <option>Airport transfer</option>
                </select>
              </div>
              <div className="field">
                <label htmlFor="destination">Destination</label>
                <select id="destination" name="destination">
                  <option>Wenchi Crater</option>
                  <option>Lake Langano</option>
                  <option>Wondo Genet</option>
                  <option>Arba Minch</option>
                  <option>City / custom route</option>
                </select>
              </div>
            </div>
            <div className="row-2">
              <div className="field">
                <label htmlFor="date">Travel date</label>
                <input id="date" name="date" type="date" />
              </div>
              <div className="field">
                <label htmlFor="people">Travellers</label>
                <input id="people" name="people" type="number" min={1} defaultValue={4} />
              </div>
            </div>
            <div className="field">
              <label htmlFor="notes">Anything else?</label>
              <textarea id="notes" name="notes" rows={3} placeholder="Lodging preferences, pickup point, special requests…" />
            </div>
            <div className="form-actions">
              <button type="submit" className="btn">
                Send request <span className="arrow">→</span>
              </button>
              <a className="btn ghost" href={contact.phoneHref}>
                Call instead
              </a>
            </div>
            {sent && <p className="form-note">Your email app should be opening. Talk soon!</p>}
          </form>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- Footer ---------------- */

export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
          <HatLogo size={70} color="var(--paper)" />
          <span className="hand" style={{ fontSize: 22, color: "var(--gold)" }}>see you on the road</span>
        </div>
        <p className="footer-word">
          Daka<span>.</span>Travels
        </p>
        <div className="footer-road" aria-hidden>
          <div className="lane" />
          <img src="/images/hiace-cut.webp" alt="" style={{ scale: "-1 1" }} />
        </div>
        <div className="footer-row">
          <span>© {new Date().getFullYear()} Daka Travels · Addis Ababa, Ethiopia</span>
          <span style={{ display: "flex", gap: 18 }}>
            <a href="#services">Services</a>
            <a href="#fleet">Fleet</a>
            <a href="#destinations">Destinations</a>
            <a href="#book">Book</a>
          </span>
        </div>
      </div>
    </footer>
  );
}
