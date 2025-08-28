// /src/app/roadmap/page.tsx
import React from "react";

type Sect = { emoji: string; title: string; items: string[] };

const SECTIONS: Sect[] = [
  {
    emoji: "🧱",
    title: "Q3 2025 – Genesis Surge",
    items: [
      "Mint the Collection: Launch of 4444 Angry Whales – each one unique and ready to conquer the deep.",
      "Pod Formation: Building a strong, loyal, and engaged community from day one.",
      "Role System & Holder Access: Private zones unlocked for holders: alpha chats, sneak peeks, exclusive perks.",
    ],
  },
  {
    emoji: "🌊",
    title: "Q4 2025 – Abyss Expansion",
    items: [
      "Start Creating Value for Holders: Exploring revenue mechanics (royalty sharing, raffles).",
      "Strategic Web3 Partnerships: Partnering with solid NFT projects to expand the ecosystem.",
    ],
  },
  {
    emoji: "🧩",
    title: "Q1–Q2 2026 – Brand Awakening",
    items: [
      "Physical Brand Launch: The Angry Whales real-world market goes live (merch, collectibles, IRL experiences).",
      "Holder Ecosystem Activation: Exclusive drops, passive revenue streams, spin-off access.",
      "Web3 x IRL Collaborations: Bridging digital and real: events, pop-ups, artist collabs.",
    ],
  },
  {
    emoji: "👑",
    title: "Long-Term Vision – The Ocean Empire",
    items: [
      "Not just a project — a cultural brand.",
      "Real power & value to our holders.",
      "Angry Whales becomes a legendary pod in Web3 history.",
    ],
  },
];

export default function RoadmapPage() {
  return (
    <section className="mx-auto max-w-4xl px-4 sm:px-6 py-10 sm:py-14">
      {/* Logo centré */}
      <div className="flex justify-center mb-4 sm:mb-6">
        <img
          src="/aw-logo-yellow.png"
          alt="Angry Whales"
          className="h-12 sm:h-16 md:h-20 w-auto"
        />
      </div>

      {/* Titre principal (fluide) */}
      <h1
        className="text-center font-extrabold mb-8 sm:mb-10"
        style={{
          color: "#facc15",
          fontSize: "clamp(26px, 5.6vw, 52px)",
          lineHeight: "1.2",
        }}
      >
        Angry Whales — Roadmap
      </h1>

      {/* Colonne centrée */}
      <div className="mx-auto max-w-2xl space-y-10">
        {SECTIONS.map((s) => (
          <Section key={s.title} {...s} />
        ))}
      </div>
    </section>
  );
}

function Section({ emoji, title, items }: Sect) {
  return (
    <div className="w-full">
      {/* Ligne de titre */}
      <div className="flex items-center justify-center gap-3">
        <span
          className="select-none leading-none"
          style={{ fontSize: "clamp(20px, 3.2vw, 28px)" }}
          aria-hidden
        >
          {emoji}
        </span>
        <h2
          className="font-extrabold text-center"
          style={{
            color: "rgba(239,246,255,0.95)",
            fontSize: "clamp(18px, 3.2vw, 28px)",
            lineHeight: "1.25",
          }}
        >
          {title}
        </h2>
      </div>

      {/* Puces centrées */}
      <div className="mt-3 flex justify-center">
        <ul
          className="list-disc list-inside text-center space-y-2"
          style={{
            color: "rgba(239,246,255,0.9)",
            fontSize: "clamp(14px, 3.4vw, 17px)",
            lineHeight: "1.7",
            wordBreak: "break-word",
          }}
        >
          {items.map((it, i) => (
            <li key={i}>{it}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
