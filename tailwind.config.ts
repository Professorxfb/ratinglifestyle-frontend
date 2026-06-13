import type { Config } from "tailwindcss";

/**
 * Colors are wired to CSS variables (RGB channels, space-separated) defined in
 * globals.css. This lets the whole app re-theme instantly via [data-theme="…"]
 * while Tailwind opacity modifiers (e.g. bg-obsidian/70) keep working through
 * the `<alpha-value>` placeholder.
 */
const withVar = (v: string) => `rgb(var(${v}) / <alpha-value>)`;

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Luxury palette — Rupkotha Trendz (theme-driven via CSS vars)
        obsidian: withVar("--bg-primary"),
        charcoal: withVar("--bg-secondary"),
        gold: {
          DEFAULT: withVar("--accent"),
          light: withVar("--accent-light"),
          dark: withVar("--accent-dark"),
        },
        platinum: withVar("--text-secondary"),
        ink: withVar("--text-primary"),
        muted: withVar("--text-muted"),
        card: withVar("--card-bg"),
        line: withVar("--border"),
        success: "#2ECC71",
        danger: "#E74C3C",
        // aliases kept for compatibility
        background: withVar("--bg-primary"),
        foreground: withVar("--text-primary"),
      },
      fontFamily: {
        display: ["var(--font-cormorant)", "var(--font-playfair)", "Georgia", "serif"],
        serif: ["var(--font-cormorant)", "Georgia", "serif"],
        logo: ["var(--font-cinzel)", "serif"],
        sans: ["var(--font-dmsans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        gold: "0 10px 40px -10px rgb(var(--accent) / 0.4)",
        "gold-lg": "0 20px 70px -15px rgb(var(--accent) / 0.45)",
        luxe: "0 20px 60px -20px rgba(0, 0, 0, 0.8)",
        "card-hover": "0 24px 50px -12px rgba(0, 0, 0, 0.7)",
      },
      backgroundImage: {
        "gold-gradient":
          "linear-gradient(135deg, rgb(var(--accent-light)) 0%, rgb(var(--accent)) 50%, rgb(var(--accent-dark)) 100%)",
        "gold-sheen":
          "linear-gradient(135deg, rgb(var(--accent)) 0%, rgb(var(--accent-light)) 35%, rgb(var(--accent)) 70%)",
        "obsidian-fade":
          "linear-gradient(180deg, rgb(var(--bg-primary)) 0%, rgb(var(--bg-secondary)) 100%)",
        "hero-overlay":
          "linear-gradient(180deg, rgb(var(--bg-primary) / 0.25) 0%, rgb(var(--bg-primary) / 0.6) 60%, rgb(var(--bg-primary) / 0.95) 100%)",
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
        "text-shimmer": {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "200% 50%" },
        },
        "scroll-bounce": {
          "0%, 100%": { transform: "translateY(0)", opacity: "1" },
          "50%": { transform: "translateY(10px)", opacity: "0.4" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(0.85)", opacity: "0.7" },
          "70%, 100%": { transform: "scale(1.6)", opacity: "0" },
        },
        "caret-blink": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s ease forwards",
        "fade-in": "fade-in 0.8s ease forwards",
        marquee: "marquee 28s linear infinite",
        "marquee-slow": "marquee 45s linear infinite",
        shimmer: "shimmer 1.6s linear infinite",
        "text-shimmer": "text-shimmer 4s linear infinite",
        "scroll-bounce": "scroll-bounce 1.8s ease-in-out infinite",
        "pulse-ring": "pulse-ring 2.4s cubic-bezier(0.4,0,0.2,1) infinite",
        "caret-blink": "caret-blink 1s step-end infinite",
        "float-slow": "float-slow 6s ease-in-out infinite",
      },
      letterSpacing: {
        luxe: "0.18em",
        cinematic: "0.1em",
      },
      transitionDuration: {
        "400": "400ms",
      },
    },
  },
  plugins: [],
};
export default config;
