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
        "naukri-blue": "#2557a7",
        "naukri-orange": "#ff7555",
        "naukri-ink": "#3d3d3d",
        "naukri-muted": "#6b6b6b",
      },
    },
  },
  plugins: [],
};
export default config;
