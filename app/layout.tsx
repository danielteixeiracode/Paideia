import type { Metadata, Viewport } from "next";
import { EB_Garamond, Hanken_Grotesk } from "next/font/google";
import { PwaRegister } from "@/components/pwa-register";
import { AvisoProvider } from "@/components/ui/aviso";
import { SCRIPT_TEMA } from "@/lib/tema";
import "./globals.css";

// Títulos e algarismos romanos.
const display = EB_Garamond({
  subsets: ["latin"],
  weight: "variable",
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

// Interface e texto corrido.
const body = Hanken_Grotesk({
  subsets: ["latin"],
  weight: "variable",
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  // Cada rota dá o seu nome: "Obras – Paideia".
  title: { default: "Paideia", template: "%s – Paideia" },
  description:
    "Paideia — formação clássica com o mínimo de leitura e a máxima profundidade.",
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
  themeColor: "#11271F",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // O script do <head> põe data-theme no <html> antes da hidratação.
    <html lang="pt-BR" className={`${display.variable} ${body.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: SCRIPT_TEMA }} />
      </head>
      <body className="font-sans antialiased">
        <AvisoProvider>{children}</AvisoProvider>
        <PwaRegister />
      </body>
    </html>
  );
}
