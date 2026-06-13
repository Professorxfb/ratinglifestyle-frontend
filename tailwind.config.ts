import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Luxury palette — Rupkotha Trendz
        obsidian: "#0A0A0A",
        charcoal: "#111318",
        gold: {
          DEFAULT: "#C9A84C",
          light: "#E0C878",
          dark: "#9C7F30",
        },
        platinum: "#E8E0D0",
        ink: "#F5F5F0",
        muted: "#8A8A8A",
        card: "#161616",
        line: "#2A2A2A",
        success: "#2ECC71",
        danger: "#E74C3C",
        // aliases kept for compatibility
        background: "#0A0A0A",
        foreground: "#F5F5F0",
      },
      fontFamily: {
        display: ["var(--font-playfair)", "Georgia", "serif"],
        serif: ["var(--font-cormorant)", "Georgia", "serif"],
        logo: ["var(--font-cinzel)", "serif"],
        sans: ["var(--font-dmsans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        gold: "0 10px 40px -10px rgba(201, 168, 76, 0.35)",
        luxe: "0 20px 60px -20px rgba(0, 0, 0, 0.8)",
        "card-hover": "0 24px 50px -12px rgba(0, 0, 0, 0.7)",
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #E0C878 0%, #C9A84C 50%, #9C7F30 100%)",
        "obsidian-fade": "linear-gradient(180deg, #0A0A0A 0%, #111318 100%)",
        "hero-overlay":
          "linear-gradient(180deg, rgba(10,10,10,0.2) 0%, rgba(10,10,10,0.55) 60%, rgba(10,10,10,0.92) 100%)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s ease forwards",
        marquee: "marquee 28s linear infinite",
        shimmer: "shimmer 1.6s linear infinite",
      },
      letterSpacing: {
        luxe: "0.18em",
      },
    },
  },
  plugins: [],
};
export default config;
