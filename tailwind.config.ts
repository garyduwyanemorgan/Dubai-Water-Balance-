import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        sand: '#E8DCC4',
        'deep-blue': '#1B3A5C',
        brackish: '#5A7A5F',
        amber: '#C58A3A',
        clay: '#8A6F58',
        'stark-grey': '#3D3D3D',
        'off-white': '#F5F1E8',
      },
      fontFamily: {
        newsreader: ['var(--font-newsreader)', 'Georgia', 'serif'],
        inter: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
