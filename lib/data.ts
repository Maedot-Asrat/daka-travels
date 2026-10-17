// All copy here comes from the Daka Travels business overview deck.

export const contact = {
  address: "Bisrate Gebriel, Shimeket Bldg, Addis Ababa",
  phone: "+251 925 754 141",
  phoneHref: "tel:+251925754141",
  email: "aaronkamil4@gmail.com",
};

export type Vehicle = {
  id: "starex" | "hiace" | "landcruiser";
  name: string;
  year: string;
  nickname: string;
  tagline: string;
  cutout: string;
  photo: string;
  seats: [number, number];
  terrain: { road: number; gravel: number; offroad: number }; // 0–3
  features: { title: string; text: string }[];
  bestFor: string[];
  color: string;
};

export const fleet: Vehicle[] = [
  {
    id: "starex",
    name: "Hyundai Grand Starex",
    year: "2012",
    nickname: "The Family Cruiser",
    tagline:
      "Refined, modern passenger van configured for luxury family transport, highway cruises and city runs.",
    cutout: "/images/starex-cut.webp",
    photo: "/images/starex.jpg",
    seats: [8, 10],
    terrain: { road: 3, gravel: 1, offroad: 0 },
    features: [
      { title: "Sized for groups", text: "Seats 8 to 10 travellers in real comfort." },
      { title: "Climate controlled", text: "Dual front and rear air conditioning." },
      { title: "Flexible cabin", text: "Rotatable, reclining plush seats." },
    ],
    bestFor: ["Langano resorts", "City tours", "Wondo Genet", "Airport transfers"],
    color: "var(--gold)",
  },
  {
    id: "hiace",
    name: "Toyota Hiace Shark",
    year: "2010",
    nickname: "The Ethiopian Workhorse",
    tagline:
      "Ethiopia's favourite group travel legend. Reliable, fuel-efficient and roomy for medium-sized parties.",
    cutout: "/images/hiace-cut.webp",
    photo: "/images/hiace.jpg",
    seats: [4, 6],
    terrain: { road: 3, gravel: 2, offroad: 0 },
    features: [
      { title: "Spacious storage", text: "Up to 6 passengers with dedicated luggage space." },
      { title: "High-roof canopy", text: "Generous headroom, never cramped on long drives." },
      { title: "Group economy", text: "Smooth highway pacing and great running costs." },
    ],
    bestFor: ["Arba Minch express", "Family trips", "Highway & smooth gravel"],
    color: "var(--coral)",
  },
  {
    id: "landcruiser",
    name: "Toyota Land Cruiser Hardtop",
    year: "2008",
    nickname: "The Off-Road Might",
    tagline:
      "When the paved road ends, the Land Cruiser takes the lead. Heavy-duty 4x4 built to tame the highlands.",
    cutout: "/images/landcruiser-cut.webp",
    photo: "/images/landcruiser.jpg",
    seats: [5, 7],
    terrain: { road: 2, gravel: 3, offroad: 3 },
    features: [
      { title: "Heavy-duty 4x4", text: "High-clearance mountain driving." },
      { title: "Extreme durability", text: "Dual fuel tanks and heavy steel suspension." },
      { title: "Wilderness explorer", text: "Made for long, rugged terrain." },
    ],
    bestFor: ["Wenchi crater trails", "Mountain safaris", "Mud & steep slopes"],
    color: "var(--green)",
  },
];

export type Destination = {
  id: string;
  name: string;
  km: number;
  kicker: string;
  blurb: string;
  photo: string;
  highlights: string[];
  ride: Vehicle["id"];
};

export const destinations: Destination[] = [
  {
    id: "wenchi",
    name: "Wenchi Crater",
    km: 155,
    kicker: "Volcanic eco-paradise",
    blurb:
      "Climb into a massive, lush caldera with cool alpine air. A UNWTO Best Tourism Village and a community-run forest sanctuary.",
    photo: "/images/wenchi.jpg",
    highlights: [
      "Boat crossing to the 13th-century Wenchi Chirkos island monastery",
      "Guided pony treks and horseback rides",
      "Valley waterfall walks and warm springs",
    ],
    ride: "landcruiser",
  },
  {
    id: "langano",
    name: "Lake Langano",
    km: 200,
    kicker: "Rift Valley sandy oasis",
    blurb:
      "Warm brown-sand beaches down the southern highway. Langano's waters are bilharzia-free, so the swimming is safe.",
    photo: "/images/langano.jpg",
    highlights: [
      "Swimming, water skiing and sunbathing",
      "Partnered lakeside eco-resorts",
      "Acacia forests full of birdlife",
    ],
    ride: "starex",
  },
  {
    id: "wondo",
    name: "Wondo Genet",
    km: 270,
    kicker: "Thermal baths & forest canopy",
    blurb:
      "Famous for its healing hot springs, first established as an imperial family retreat, wrapped in dense montane forest.",
    photo: "/images/wondo.jpg",
    highlights: [
      "Swim in warm, therapeutic mountain waters",
      "Birding and hiking among colobus monkeys",
      "Sugarcane and tea fields all around",
    ],
    ride: "starex",
  },
  {
    id: "arbaminch",
    name: "Arba Minch",
    km: 450,
    kicker: "Gateway to the southern Rift",
    blurb:
      "\"Forty Springs\" sits on the ridge between Lakes Abaya and Chamo, a genuinely wild retreat at the end of the road.",
    photo: "/images/arbaminch.jpg",
    highlights: [
      "Lake Chamo boat safari: giant Nile crocodiles and hippos",
      "Dorze highland village and its beehive houses",
      "Nechisar plains with zebras and endemic birds",
    ],
    ride: "hiace",
  },
];

export const steps = [
  {
    title: "Select services",
    text: "Pick a group tour itinerary or book a vehicle from our fleet.",
  },
  {
    title: "Custom plan",
    text: "Adjust the schedule, choose your lodging tier and set driver preferences.",
  },
  {
    title: "Instant booking",
    text: "Lock in your dates with a local digital transfer and a formal service agreement.",
  },
  {
    title: "Depart & enjoy",
    text: "Hit the road with 24/7 roadside support and local guides along the way.",
  },
];
