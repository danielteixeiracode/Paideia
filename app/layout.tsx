import type { Metadata, Viewport } from "next";
import { Libre_Franklin } from "next/font/google";
import { PwaRegister } from "@/components/pwa-register";
import "./globals.css";

const display = Libre_Franklin({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const body = Libre_Franklin({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Paideia — Formação Clássica",
  description:
    "A arte milenar da autoformação integral. Trivium, Quadrivium e Diálogo Socrático numa única academia.",
  manifest: "/manifest.json",
  icons: {
    icon: "/icons/icon-192.png",
    apple: "/icons/icon-192.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Paideia",
  },
};

export const viewport: Viewport = {
  themeColor: "#0F2E1F",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${display.variable} ${body.variable}`}>
      <body className="font-sans antialiased">
        {children}
        <PwaRegister />
      </body>
    </html>
  );
}
