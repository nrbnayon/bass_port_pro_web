export type LakeCard = {
  id: string;
  name: string;
  state: string;
  rating: number;
  temp: string;
  weather: string;
  wind: string;
  species: string[];
  image: string;
  color: string;
  size: number; // in acres or similar
  catchRate: number; // fish per hour
  recordBass: number; // in lbs
  description: string;
  condition: "Excellent" | "Good" | "Fair" | "Poor";
  clarity: "Clear" | "Stained" | "Muddy";
};

export type CatchCard = {
  id: string;
  angler: string;
  lake: string;
  weight: string;
  image: string;
  species: string;
  length: string;
  technique: string;
  date: string;
  likes: number;
  avatarImage: string;
  description: string;
};

export type FeatureCard = {
  id: string;
  title: string;
  description: string;
  icon: "map" | "chart" | "camera" | "message" | "calendar" | "target";
};

export type ReportCard = {
  id: string;
  angler: string;
  date: string;
  lake: string;
  score: string;
  temp: string;
  catches: string;
  text: string;
  tags: string[];
  avatarImage?: string;
  biggestCatch: string;
  weather: string;
  waterLevel: string;
};
