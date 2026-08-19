import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#18202a",
        paper: "#fbfaf7",
        mint: "#dff4ea",
        coral: "#f26d5b",
        cobalt: "#2556d9",
        saffron: "#f7b538",
      },
      boxShadow: {
        soft: "0 18px 50px rgba(24, 32, 42, 0.10)",
      },
    },
  },
  plugins: [typography],
};

export default config;
