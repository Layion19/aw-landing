// /src/app/about/page.tsx
import React from "react";

export default function AboutPage() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-14">
      {/* Logo centré */}
      <div className="flex justify-center mb-3">
        <img
          src="/aw-logo-yellow.png"
          alt="Angry Whales"
          className="h-16 md:h-20 w-auto"
        />
      </div>

      {/* Titre plus grand + JAUNE (forcé en inline pour éviter tout override) */}
      <h1
        className="text-center font-extrabold mb-8"
        style={{
          color: "#facc15",        // text-yellow-400
          fontSize: "56px",        // ~ text-5xl/6xl
          lineHeight: "1.1",
        }}
      >
        About Angry Whales
      </h1>

      {/* Texte bleu clair, mots-clés en JAUNE (inline) */}
      <div
        className="space-y-6 text-center"
        style={{
          color: "rgba(239, 246, 255, 0.9)", // bleu clair
          fontSize: "17px",
          lineHeight: "1.75",
        }}
      >
        <p>
          Angry Whales is more than just an NFT collection. It’s a bold{" "}
          <span style={{ color: "#facc15" }}>vision</span> — a Web3 movement
          powered by the ocean and its{" "}
          <span style={{ color: "#facc15" }}>community</span>.
        </p>

        <p>
          We’re not just launching 4444 unique pieces — we’re building a{" "}
          <span style={{ color: "#facc15" }}>brand</span>, an{" "}
          <span style={{ color: "#facc15" }}>ecosystem</span>, and a{" "}
          <span style={{ color: "#facc15" }}>universe</span> around the Angry
          Whales identity.
        </p>

        <p>
          Our mission is clear: unite an engaged{" "}
          <span style={{ color: "#facc15" }}>community</span>, bring real{" "}
          <span style={{ color: "#facc15" }}>value</span> to holders, and grow
          into a <span style={{ color: "#facc15" }}>long-term project</span>{" "}
          that goes far beyond the digital space.
        </p>

        <p>
          Through partnerships, exclusive drops, and both physical and digital
          activations, we’re laying the foundation for a strong, innovative
          brand deeply rooted in <span style={{ color: "#facc15" }}>Web3</span>.
        </p>

        <p>
          Joining Angry Whales means diving into a journey built to last — with{" "}
          <span style={{ color: "#facc15" }}>transparency</span>,{" "}
          <span style={{ color: "#facc15" }}>ambition</span>, and{" "}
          <span style={{ color: "#facc15" }}>power</span>.
        </p>
      </div>
    </section>
  );
}
