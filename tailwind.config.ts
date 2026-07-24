import type { Config } from "tailwindcss";

// Tokens ported directly from DESIGN.md §3 (dark theme, primary for this page per §12).
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: {
          base: "#0B0F14",
          surface: "#151B23",
          raised: "#1D2530",
        },
        border: {
          subtle: "#28313D",
        },
        text: {
          primary: "#F5F2ED",
          secondary: "#B7BEC7",
          muted: "#7C8794",
        },
        accent: {
          primary: "#F2A93B",
          "primary-pressed": "#D6912A",
          secondary: "#2BA893",
        },
        state: {
          success: "#6FBF73",
          danger: "#E2542D",
          warning: "#F2C94C",
        },
      },
      fontFamily: {
        display: ["var(--font-space-grotesk)", "sans-serif"],
        body: ["var(--font-ibm-plex-sans)", "sans-serif"],
        mono: ["var(--font-ibm-plex-mono)", "monospace"],
      },
      borderRadius: {
        card: "16px",
        control: "12px",
        pill: "999px",
      },
      maxWidth: {
        content: "480px",
      },
      keyframes: {
        sweep: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
      animation: {
        sweep: "sweep 8s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;
