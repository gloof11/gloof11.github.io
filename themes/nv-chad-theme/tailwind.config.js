/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./layouts/**/*.{html,js}"], // Adjust this path to match where your HTML files are located
  theme: {
    extend: {
      colors: {
        gruvbox: {
          bg: '#282828',       // Dark background
          bg_dark: '#1d2021',  // Hard contrast background (sidebar/statusline)
          bg_light: '#3c3836', // Light background (selection/hover)
          fg: '#ebdbb2',       // Foreground (text)
          gray: '#928374',     // Comments/Ignored files
          red: '#fb4934',      // Error/Delete
          green: '#b8bb26',    // String/Success
          yellow: '#fabd2f',   // Warning/Function
          blue: '#83a598',     // Info/Variable
          purple: '#d3869b',   // Keyword
          aqua: '#8ec07c',     // Operator
          orange: '#fe8019',   // Number/Boolean
        }
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
      }
    },
  },
  plugins: [],
}