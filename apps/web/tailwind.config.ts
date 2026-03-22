import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'primary':       '#00ff9d',
        'pulse-green':   '#00FF9D',
        'pulse-bg':      '#0B0D10',
        'pulse-surface': '#111827',
        'pulse-border':  '#1f2937',
        'pulse-muted':   '#6b7280',
        'background-light': '#f5f8f7',
        'background-dark': '#0f231b',
      },
      fontFamily: {
        display: ['Inter', 'sans-serif'],
        mono:    ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'ping-slow': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
      },
    },
  },
  plugins: [],
}

export default config
