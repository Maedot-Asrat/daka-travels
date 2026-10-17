import { BoilFilters } from "@/components/Doodles";
import Fleet from "@/components/Fleet";
import Hero from "@/components/Hero";
import Nav, { Curtain } from "@/components/Nav";
import { Contact, Footer, Process, Quote, RidePicker, Safety } from "@/components/Planner";
import RouteMap from "@/components/RouteMap";
import { Marquee, Services } from "@/components/Sections";

export default function Home() {
  return (
    <>
      <BoilFilters />
      <Curtain />
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <Services />
        <Fleet />
        <RouteMap />
        <RidePicker />
        <Process />
        <Safety />
        <Quote />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
