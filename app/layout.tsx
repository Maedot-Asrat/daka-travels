import type { Metadata, Viewport } from "next";
import "@fontsource-variable/bricolage-grotesque";
import "@fontsource/caveat/600.css";
import "@fontsource/caveat/700.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Daka Travels | Car Rentals & Group Tours in Ethiopia",
  description:
    "Comfortable car rentals and handpicked group vacation packages to Wenchi Crater, Lake Langano, Wondo Genet and Arba Minch, from Addis Ababa.",
  openGraph: {
    title: "Daka Travels",
    description: "Pack light. Ride easy. See Ethiopia.",
    images: ["/images/wenchi.jpg"],
  },
};

export const viewport: Viewport = { themeColor: "#2b2f5c" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
