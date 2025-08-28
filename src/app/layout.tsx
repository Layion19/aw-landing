// src/app/layout.tsx
import "./globals.css";
import type { Metadata, Viewport } from "next";
import Header from "./components/header";
import { Nosifer, Poppins } from "next/font/google";

export const metadata: Metadata = {
  title: "Angry Whales | Landing",
  description: "Landing page minimaliste pour Angry Whales",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${nosifer.variable} ${poppins.variable}`}>
      <body className="min-h-screen overflow-x-hidden antialiased">
        <Header />
        <div id="app-content">{children}</div>
      </body>
    </html>
  );
}
