import {
  LakeCard,
  CatchCard,
  FeatureCard,
  ReportCard,
} from "@/types/landingData.types";

export const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Lakes", href: "#lakes" },
  { label: "BassPort", href: "#catches" },
  { label: "Reports", href: "#reports" },
  { label: "Contact", href: "#footer" },
];

export const heroStats = [
  { id: "1", value: "12+", label: "Premium Lakes" },
  { id: "2", value: "500+", label: "Catch Photos" },
  { id: "3", value: "1,200+", label: "Fishing Reports" },
  { id: "4", value: "5,000+", label: "Active Anglers" },
];

export const lakes: LakeCard[] = [
  {
    id: "guntersville",
    name: "Lake Guntersville",
    state: "Alabama",
    rating: 4.8,
    temp: "72F",
    weather: "Clear",
    wind: "4.2 mph",
    species: ["Largemouth Bass", "Smallmouth Bass"],
    image: "/images/404.jpg",
    color: "from-cyan-700/80 to-sky-900/80",
  },
  {
    id: "rayburn",
    name: "Sam Rayburn Reservoir",
    state: "Texas",
    rating: 4.8,
    temp: "80F",
    weather: "Breezy",
    wind: "3.1 mph",
    species: ["Crappie", "Spotted Bass"],
    image: "/icons/signin.png",
    color: "from-emerald-700/80 to-teal-900/80",
  },
  {
    id: "chickamauga",
    name: "Lake Chickamauga",
    state: "Tennessee",
    rating: 4.9,
    temp: "69F",
    weather: "Clear",
    wind: "6.0 mph",
    species: ["Largemouth Bass", "Smallmouth Bass"],
    image: "/icons/signup.png",
    color: "from-blue-700/80 to-cyan-900/80",
  },
  {
    id: "fork",
    name: "Lake Fork",
    state: "Texas",
    rating: 4.7,
    temp: "85F",
    weather: "Clear",
    wind: "5.2 mph",
    species: ["Crappie", "Catfish"],
    image: "/icons/reset-pass.svg",
    color: "from-emerald-800/80 to-green-950/80",
  },
  {
    id: "okeechobee",
    name: "Lake Okeechobee",
    state: "Florida",
    rating: 4.6,
    temp: "74F",
    weather: "Cloudy",
    wind: "4.5 mph",
    species: ["Peacock", "Alligator Gar"],
    image: "/icons/forgot-pass.svg",
    color: "from-slate-700/80 to-blue-950/80",
  },
  {
    id: "pickwick",
    name: "Pickwick Lake",
    state: "Alabama",
    rating: 4.5,
    temp: "68F",
    weather: "Clear",
    wind: "4.7 mph",
    species: ["Spotted Bass", "Bluegill"],
    image: "/icons/otp-verify.svg",
    color: "from-indigo-700/80 to-sky-900/80",
  },
];

export const catches: CatchCard[] = [
  {
    id: "c1",
    angler: "Jacob Sheff",
    lake: "Lake Fork",
    weight: "12.1 lbs",
    image: "/images/avatar.png",
  },
  {
    id: "c2",
    angler: "Chris Hocking",
    lake: "Sam Rayburn",
    weight: "11.3 lbs",
    image: "/images/avatar.png",
  },
  {
    id: "c3",
    angler: "Peter Lang",
    lake: "Guntersville",
    weight: "10.2 lbs",
    image: "/images/avatar.png",
  },
  {
    id: "c4",
    angler: "Chike Nwa",
    lake: "Okeechobee",
    weight: "9.4 lbs",
    image: "/images/avatar.png",
  },
];

export const features: FeatureCard[] = [
  {
    id: "f1",
    title: "Lake Intelligence",
    description:
      "Know fish activity windows, pressure swings, and local water behavior before launch.",
    icon: "map",
  },
  {
    id: "f2",
    title: "Expert Reports",
    description:
      "Detailed reports from experienced anglers with techniques, lures, and timing.",
    icon: "chart",
  },
  {
    id: "f3",
    title: "BassPort Gallery",
    description:
      "Share your trophy catches with the community and inspire your next trip.",
    icon: "camera",
  },
  {
    id: "f4",
    title: "Lake Reviews",
    description:
      "Read honest reviews from local anglers and rate your favorite fishing spots.",
    icon: "message",
  },
  {
    id: "f5",
    title: "Seasonal Patterns",
    description:
      "Understand migration paths and season-based behavior across major bass lakes.",
    icon: "calendar",
  },
  {
    id: "f6",
    title: "Record Tracking",
    description:
      "Track catches, personal bests, and compare historical performance metrics.",
    icon: "target",
  },
];

export const reports: ReportCard[] = [
  {
    id: "r1",
    angler: "TournamentPro",
    date: "2026-03-21",
    lake: "Florida",
    score: "72%",
    catches: "10 catches",
    text: "Strong bite in the grassline early morning. White spinnerbait and chatterbait produced best.",
    tags: ["early bite", "spinnerbait"],
  },
  {
    id: "r2",
    angler: "BigBassHunter",
    date: "2026-03-22",
    lake: "Texas",
    score: "90%",
    catches: "9 catches",
    text: "Pre-spawn movement to staging banks. Slower swimbait presentation worked after 10 AM.",
    tags: ["pre-spawn", "swimbait"],
  },
  {
    id: "r3",
    angler: "FloridaAngler",
    date: "2026-03-23",
    lake: "Lake Okeechobee",
    score: "74%",
    catches: "12 catches",
    text: "Big fish active near hydrilla edge. Flipping creature baits around isolated cover paid off.",
    tags: ["flipping", "hydrilla"],
  },
];

export const footerLinks = {
  quick: [
    "Home",
    "Lake Database",
    "BassPort Gallery",
    "Fishing Reports",
    "Contact Us",
  ],
  lakes: [
    "Lake Guntersville",
    "Lake Fork",
    "Sam Rayburn",
    "Lake Okeechobee",
    "Lake Chickamauga",
  ],
};
