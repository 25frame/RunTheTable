import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: { extend: { colors: { rtt: { red: "#E10600", black: "#05070A", panel: "#0B0F15" } } } },
  plugins: []
};
export default config;
