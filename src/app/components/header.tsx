"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const active = (href: string) =>
    pathname === href ? "font-extrabold text-yellow-400" : "";

  return (
    <>
      {/* Burger : on l’affiche seulement si le menu n’est PAS ouvert */}
      {!open && (
        <button
          aria-label="Ouvrir le menu"
          className="aw-burger"
          onClick={() => setOpen(true)}
        >
          <span />
          <span />
          <span />
        </button>
      )}

      {/* Backdrop */}
      <div
        className={`aw-backdrop ${open ? "open" : ""}`}
        onClick={() => setOpen(false)}
        aria-hidden={!open}
      />

      {/* Panneau latéral */}
      <aside
        className={`aw-menu ${open ? "open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Menu Angry Whales"
      >
        <header>
          <h2>Angry Whales</h2>
          <button
            className="close"
            aria-label="Fermer le menu"
            onClick={() => setOpen(false)}
          >
            ×
          </button>
        </header>

        <nav>
          <Link href="/" scroll={false} className={active("/")}>
            Home
          </Link>
          <Link href="/about" scroll={false} className={active("/about")}>
            About
          </Link>
          <Link href="/roadmap" scroll={false} className={active("/roadmap")}>
            Roadmap
          </Link>

          <div style={{ marginTop: 12, paddingTop: 10, borderTop: "1px dashed rgba(255,255,255,.12)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <span className="aw-mint">Mint</span>
              <span className="aw-badge aw-badge-dark">Not live yet</span>
              <button className="aw-btn-disabled" disabled>
                Mint Soon
              </button>
            </div>
          </div>
        </nav>
      </aside>
    </>
  );
}
