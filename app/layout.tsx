import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { siteUrl } from "@/lib/site";
import "maplibre-gl/dist/maplibre-gl.css";
import "./globals.css";
import "./topic-pages.css";
import "./home.css";
import "./map.css";
import "./radar-map.css";
import "./mobile-app.css";
import "./mobile-app-fixes.css";
import "./charts.css";
import "./history.css";
import "./cameras.css";
import "./lagoon-level.css";
import "./lagoon-layout-refinement.css";
import "./home-lagoon-card.css";
import "./hydrology.css";
import "./guaiba-card.css";
import "./embrapa-observation.css";
import "./footer.css";
import "./footer-resources.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "TEMPO Pelotas | Previsão e situação hidrológica em Pelotas, RS",
    template: "%s | TEMPO Pelotas",
  },
  description:
    "Previsão do tempo e monitoramento hidrológico para Pelotas, com chuva, vento, radar, nível da Lagoa dos Patos e fontes oficiais para preparação comunitária.",
  applicationName: "TEMPO Pelotas",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Tempo Pelotas",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "TEMPO Pelotas",
    title: "TEMPO Pelotas | Tempo, águas e preparação comunitária",
    description:
      "Condições meteorológicas e contexto hidrológico para Pelotas e a Zona Sul do Rio Grande do Sul.",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "TEMPO Pelotas",
    description: "Tempo, nível da lagoa e situação hidrológica em Pelotas, RS.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#071e2f",
  colorScheme: "light",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
