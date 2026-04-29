"@tailwindcss/postcss": "latest",
import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        rtt: {
          black: "#0A0F14",
          red: "#E10600",
          offwhite: "#F5F5F5"
        }
      }
    },
  },
  plugins: [],
};

export default config;
