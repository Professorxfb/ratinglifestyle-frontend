import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import { playfair, cormorant, cinzel, dmSans } from "@/lib/fonts";
import { SITE } from "@/lib/site";
import Chrome from "@/components/layout/Chrome";
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

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${playfair.variable} ${cormorant.variable} ${cinzel.variable} ${dmSans.variable} bg-obsidian font-sans text-ink antialiased`}
      >
        <Chrome>{children}</Chrome>
        <Toaster
          position="bottom-center"
          toastOptions={{
            style: {
              background: "#161616",
              color: "#F5F5F0",
              border: "1px solid #C9A84C",
              borderRadius: "2px",
              fontSize: "14px",
            },
          }}
        />
      </body>
    </html>
  );
}
