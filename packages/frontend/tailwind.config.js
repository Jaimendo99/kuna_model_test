/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Custom colors for the new design
        teal: {
          DEFAULT: "#4ECDC4",
          50: "#E6FBFA",
          100: "#CCF7F4",
          200: "#99EFEA",
          300: "#66E7DF",
          400: "#4ECDC4",
          500: "#33B8AE",
          600: "#2A9A91",
          700: "#217B74",
          800: "#185D57",
          900: "#0F3E3A"
        },
        coral: {
          DEFAULT: "#FF8A65",
          50: "#FFF3F0",
          100: "#FFE7E0",
          200: "#FFCFC1",
          300: "#FFB7A2",
          400: "#FF9F83",
          500: "#FF8A65",
          600: "#FF6E42",
          700: "#FF5722",
          800: "#E64100",
          900: "#BF360C"
        }
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
}
