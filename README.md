# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```
# Establish a design system for the application UI
## Finalize the following for the application UI

### Choice of font
The chosen font is Inter.
website introduction - Poppins

### Choice of color schemes
Palette - Coolor
Text - 000000 (100%)
Button - 000000 (100%)
Background - 000000 (4%)
card - FFFFFF

### Choice of icon libraries
https://fonts.google.com/icons?icon.size=24&icon.color=%235f6368

### Choice of element sizes
Body Text: Minimum 16px
Headlines: Larger, scaled by importance (e.g., h1, h2, h3)
Line Height: 1.4 to 1.6 times the font size

Buttons
Padding: 8-16px (all sides)
Margin: 8-16px (between buttons)

Forms
Input Fields: Padding 8-12px
Form Elements: Margin 8-16px

Headings
Padding: Minimal or none
Margin: 16-32px (above and below)

Cards and Containers

Padding: 16-24px (inside)
Margin: 16-32px (between)

### Choice of the element spacing
Consistent Spacing - Apply equal padding and margin for a balanced layout (e.g., margin-bottom: 20px;, padding: 20px;).
Proportional Scaling - Set element widths as percentages for responsive scaling (e.g., 50% on large screens, and 80% on small screens).
Typography - comfortable reading with line height: 1.5 and letter spacing: 0.5px.
