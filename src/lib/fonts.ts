import { Playfair_Display, Cormorant_Garamond, Cinzel, DM_Sans } from "next/font/google";

export const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700"],
});

export const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-cormorant",
  weight: ["400", "500", "600", "700"],
});

export const cinzel = Cinzel({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-cinzel",
  weight: ["400", "500", "600", "700"],
});

export const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dmsans",
  weight: ["400", "500", "600", "700"],
});
