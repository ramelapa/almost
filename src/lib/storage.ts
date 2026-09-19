import { MuseumItem, MuseumSummary, FeedItem } from "@/packages/schemas";

const MUSEUM_STORAGE_KEY = "almost_museum_items_v1";
const SESSION_STORAGE_KEY = "almost_session_id_v1";

const initialDemoItems: MuseumItem[] = [
  {
    id: "demo-1",
    sessionId: "demo",
    experienceId: "exp-demo-1",
    experienceType: "zero-cart",
    title: "Aurelius X9 Hypercar",
    subtitle: "Carbon monocoque with dual quantum turbos",
    fictionalPrice: 241300,
    avoidedAmount: 241300,
    imageUrl: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=1200&auto=format&fit=crop",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    reflectionQuote: "Money spent: $0. Garage space used: 0 sq ft. Regret: $0.",
    stats: [
      { label: "Garage space", value: "0 sq ft" },
      { label: "Insurance", value: "$0/mo" },
    ],
    tags: ["automotive", "luxury"],
  },
  {
    id: "demo-2",
    sessionId: "demo",
    experienceId: "exp-demo-2",
    experienceType: "dream-trip",
    title: "7-Day Alpine Cloud Expedition",
    subtitle: "Washington (IAD) → Zurich & Lake Lucerne",
    fictionalPrice: 28400,
    avoidedAmount: 28400,
    imageUrl: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?q=80&w=1200&auto=format&fit=crop",
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    reflectionQuote: "Traveled across the Atlantic in a thought. Jetlag: zero hours.",
    stats: [
      { label: "Security wait", value: "0 mins" },
      { label: "Cost", value: "$0.00" },
    ],
    tags: ["travel", "alps"],
  },
  {
    id: "demo-3",
    sessionId: "demo",
    experienceId: "exp-demo-3",
    experienceType: "five-minute-escape",
    title: "Kyoto Rain Café Interlude",
    subtitle: "Ceremonial Uji Matcha at the Window Seat",
    fictionalPrice: 8.5,
    avoidedAmount: 8.5,
    imageUrl: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=1200&auto=format&fit=crop",
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    reflectionQuote: "Your drink will never arrive. Your wallet saved $8.50. You gained five quiet minutes.",
    stats: [
      { label: "Quiet minutes", value: "5.0 mins" },
      { label: "Cost", value: "$0.00" },
    ],
    tags: ["peace", "sanctuary"],
  },
];

export function getSessionId(): string {
  if (typeof window === "undefined") return "server-session";
  let sessionId = localStorage.getItem(SESSION_STORAGE_KEY);
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    localStorage.setItem(SESSION_STORAGE_KEY, sessionId);
  }
  return sessionId;
}

export function getLocalMuseumItems(): MuseumItem[] {
  if (typeof window === "undefined") return initialDemoItems;
  try {
    const raw = localStorage.getItem(MUSEUM_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(MUSEUM_STORAGE_KEY, JSON.stringify(initialDemoItems));
      return initialDemoItems;
    }
    return JSON.parse(raw);
  } catch {
    return initialDemoItems;
  }
}

export function addLocalMuseumItem(item: MuseumItem): void {
  if (typeof window === "undefined") return;
  try {
    const current = getLocalMuseumItems();
    const updated = [item, ...current.filter((i) => i.id !== item.id)];
    localStorage.setItem(MUSEUM_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error("Failed to persist museum item locally", err);
  }
}

export function getLocalMuseumSummary(): MuseumSummary {
  const items = getLocalMuseumItems();
  const totalAvoided = items.reduce((sum, item) => sum + item.avoidedAmount, 0);
  return {
    thingsNotBoughtCount: items.length,
    imaginarySpendingAvoided: totalAvoided,
    curiosityMomentsExperienced: items.length * 2 + 14,
  };
}

export const initialFeedItems: FeedItem[] = [
  {
    id: "feed-1",
    location: "Someone in Tokyo",
    message: "just didn't buy a $7,200 Grand Seiko Tourbillon.",
    experienceType: "zero-cart",
    avoidedAmount: 7200,
    meTooCount: 42,
    timestamp: "2 mins ago",
    isDemo: true,
  },
  {
    id: "feed-2",
    location: "Someone in London",
    message: "is taking a five-minute rain break at a Kyoto café.",
    experienceType: "five-minute-escape",
    avoidedAmount: 8.5,
    meTooCount: 129,
    timestamp: "5 mins ago",
    isDemo: true,
  },
  {
    id: "feed-3",
    location: "Someone in Zurich",
    message: "just spent an imaginary $843 million on islands and lunar biodomes.",
    experienceType: "billion-dollar",
    avoidedAmount: 843000000,
    meTooCount: 88,
    timestamp: "12 mins ago",
    isDemo: true,
  },
  {
    id: "feed-4",
    location: "Someone in Melbourne",
    message: "walked away from a $2,199 espresso machine checkout.",
    experienceType: "quit-cart",
    avoidedAmount: 2199,
    meTooCount: 64,
    timestamp: "18 mins ago",
    isDemo: true,
  },
  {
    id: "feed-5",
    location: "Someone in Toronto",
    message: "designed a cliffside estate overlooking the Swiss Alps.",
    experienceType: "dream-trip",
    avoidedAmount: 28400,
    meTooCount: 31,
    timestamp: "25 mins ago",
    isDemo: true,
  },
];
