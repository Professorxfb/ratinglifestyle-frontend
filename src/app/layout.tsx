import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import { playfair, cormorant, cinzel, dmSans } from "@/lib/fonts";
import { SITE } from "@/lib/site";
import Chrome from "@/components/layout/Chrome";
import ThemeProvider from "@/components/theme/ThemeProvider";
import PageProgress from "@/components/ui/PageProgress";
import CursorTrail from "@/components/ui/CursorTrail";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "Rupkotha Trendz | Premium Fashion in Bangladesh",
    template: "%s | Rupkotha Trendz",
  },
  description:
    "Shop the latest men's, women's & kids' fashion at Rupkotha Trendz. Premium quality T-shirts, shirts, jeans & more. Free shipping across Bangladesh.",
  keywords: [
    "fashion bangladesh",
    "online clothing",
    "mens fashion bd",
    "womens clothing bangladesh",
    "luxury fashion bd",
  ],
  openGraph: {
    type: "website",
    locale: "en_BD",
    siteName: "Rupkotha Trendz",
    url: SITE.url,
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

// Blocking script: apply the persisted theme before first paint (no FOUC).
const themeScript = `(function(){try{var k=localStorage.getItem('rt-theme');var t=k?JSON.parse(k).state.themeId:'obsidian-gold';var ok=['obsidian-gold','ivory-pearl','midnight-rose','royal-emerald'];document.documentElement.dataset.theme=ok.indexOf(t)>-1?t:'obsidian-gold';}catch(e){document.documentElement.dataset.theme='obsidian-gold';}})();`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-theme="obsidian-gold" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body
        className={`${playfair.variable} ${cormorant.variable} ${cinzel.variable} ${dmSans.variable} bg-obsidian font-sans text-ink antialiased`}
      >
        <ThemeProvider />
        <PageProgress />
        <CursorTrail />
        <Chrome>{children}</Chrome>
        <Toaster
          position="bottom-center"
          toastOptions={{
            style: {
              background: "rgb(var(--bg-secondary) / 0.92)",
              color: "rgb(var(--text-primary))",
              border: "1px solid rgb(var(--border))",
              borderLeft: "3px solid rgb(var(--accent))",
              borderRadius: "4px",
              fontSize: "14px",
              backdropFilter: "blur(12px)",
              boxShadow: "0 20px 60px -20px rgba(0,0,0,0.8)",
            },
            iconTheme: { primary: "rgb(var(--accent))", secondary: "rgb(var(--bg-secondary))" },
          }}
        />
      </body>
    </html>
  );
}
