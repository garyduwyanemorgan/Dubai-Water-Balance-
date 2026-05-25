import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Inversion — Reading the Subsurface | GDM Enviro Consulting",
  description:
    "An interactive demonstration of the Gulf water-quality inversion across four compartments, with scenario projection to 2040. GDM Enviro Consulting.",
  authors: [{ name: "Gary Morgan, GDM Enviro Consulting" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1c3d5a",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans">{children}</body>
    </html>
  );
}
