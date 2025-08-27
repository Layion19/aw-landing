// src/app/layout.tsx
import "./globals.css";
import type { Metadata, Viewport } from "next";
import Header from "./components/header"; // respecte la majuscule du fichier
import { Nosifer, Poppins } from "next/font/google";

export const metadata: Metadata = {
  title: "Angry Whales | Landing",
  description: "Landing page minimaliste pour Angry Whales",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

// polices (identique à avant)
const nosifer = Nosifer({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-nosifer",
});
const poppins = Poppins({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${nosifer.variable} ${poppins.variable}`}>
      <body>
        {/* Header fixé en haut */}
        <Header />

        {/* Contenu de page.
            NB: #app-content reçoit une marge-top égale à la hauteur du header
            et une min-height calculée pour permettre le centrage parfait de la Home. */}
        <div id="app-content">{children}</div>
      </body>
    </html>
  );
}
