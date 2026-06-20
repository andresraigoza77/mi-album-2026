import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";

import { AlbumStateProvider } from "@/components/AlbumStateProvider";
import { PwaRegistration } from "@/components/PwaRegistration";
import { SiteHeader } from "@/components/SiteHeader";

import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  applicationName: "Mi Álbum 2026",
  title: {
    default: "Mi Álbum 2026",
    template: "%s | Mi Álbum 2026",
  },
  description: "Checklist digital de figuritas de fútbol 2026.",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icons/icon.svg", type: "image/svg+xml" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Mi Álbum 2026",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#022c22",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body className={`${geist.variable} min-h-screen bg-slate-50 text-slate-900 antialiased`}>
        <AlbumStateProvider>
          <PwaRegistration />
          <a href="#contenido-principal" className="skip-link">
            Saltar al contenido principal
          </a>
          <SiteHeader />
          <main id="contenido-principal" tabIndex={-1} className="mx-auto min-h-[calc(100vh-8rem)] w-full max-w-6xl px-4 py-7 sm:px-6 sm:py-10">{children}</main>
          <footer className="border-t border-slate-200 bg-white">
            <div className="mx-auto max-w-6xl px-4 py-6 text-center text-sm text-slate-500 sm:px-6">
              Mi Álbum 2026 · Proyecto independiente sin marcas ni recursos oficiales.
            </div>
          </footer>
        </AlbumStateProvider>
      </body>
    </html>
  );
}
