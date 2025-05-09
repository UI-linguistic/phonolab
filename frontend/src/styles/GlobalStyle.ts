// src/styles/GlobalStyle.ts
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  /*────────────────────────────────────────────────────────────
   1. Import Fonts (unchanged)
  ────────────────────────────────────────────────────────────*/
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Roboto:wght@400;500&display=swap');

  /*────────────────────────────────────────────────────────────
   2. Reset & Box‑Sizing (unchanged)
  ────────────────────────────────────────────────────────────*/
  *, *::before, *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  /*────────────────────────────────────────────────────────────
   3. Base HTML & Body
  ────────────────────────────────────────────────────────────*/
  html {
    font-size: 62.5%; /* 1rem = 10px */
    scroll-behavior: smooth;
  }
  body {
    overflow-x: hidden;
  }

  html, body, #root {
    height: 100%;
  }

  /*────────────────────────────────────────────────────────────
   4. Typography
  ────────────────────────────────────────────────────────────*/
  body {
    font-family: ${({ theme }) => theme.fonts.main};
    background: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
    line-height: ${({ theme }) => theme.lineHeights.md};
    font-size: ${({ theme }) => theme.fontSizes.md};
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: ${({ theme }) => theme.fonts.heading};
    font-weight: 600;
    color: ${({ theme }) => theme.colors.text};
    margin-bottom: ${({ theme }) => theme.spacing.medium};
    line-height: ${({ theme }) => theme.lineHeights.sm};
  }
  h1 { font-size: ${({ theme }) => theme.fontSizes.xxl}; }
  h2 { font-size: ${({ theme }) => theme.fontSizes.xl}; }
  h3 { font-size: ${({ theme }) => theme.fontSizes.lg}; }
  h4 { font-size: ${({ theme }) => theme.fontSizes.md}; }
  h5 { font-size: ${({ theme }) => theme.fontSizes.sm}; }
  h6 { font-size: ${({ theme }) => theme.fontSizes.xs}; }

  p, ul, ol {
    margin-bottom: ${({ theme }) => theme.spacing.medium};
    font-size: ${({ theme }) => theme.fontSizes.md};
  }
  ul, ol {
    padding-left: ${({ theme }) => theme.spacing.large};
  }

  /*────────────────────────────────────────────────────────────
   5. Links & Buttons
  ────────────────────────────────────────────────────────────*/
  a {
    color: inherit;
    text-decoration: none;
    transition: color ${({ theme }) => theme.transitions.default};
    &:hover { color: ${({ theme }) => theme.colors.accent}; }
  }

  button, input, select, textarea {
    font-family: inherit;
   font-size: ${({ theme }) => theme.fontSizes.md};
    cursor: pointer;
    border: none;
    border-radius: ${({ theme }) => theme.borderRadius};
  }

  /*────────────────────────────────────────────────────────────
   6. Accessibility & Utilities
  ────────────────────────────────────────────────────────────*/
 :focus {
   outline: ${({ theme }) => theme.borderWidths.thin} solid ${({ theme }) => theme.colors.accent};
   outline-offset: ${({ theme }) => theme.spacing.xsmall};
+ }
  
  ::selection {
    background: ${({ theme }) => theme.colors.accent};
    color: ${({ theme }) => theme.colors.white};
  }

  /*────────────────────────────────────────────────────────────
   7. Responsive Tweaks (use theme.breakpoints)
  ────────────────────────────────────────────────────────────*/
 @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
   body { font-size: ${({ theme }) => theme.fontSizes.sm}; }
   h1 { font-size: ${({ theme }) => theme.fontSizes.xl}; }
   h2 { font-size: ${({ theme }) => theme.fontSizes.lg}; }
   h3 { font-size: ${({ theme }) => theme.fontSizes.md}; }
 }
 @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
   body { font-size: ${({ theme }) => theme.fontSizes.xs}; }
   h1 { font-size: ${({ theme }) => theme.fontSizes.lg}; }
   h2 { font-size: ${({ theme }) => theme.fontSizes.md}; }
   h3 { font-size: ${({ theme }) => theme.fontSizes.sm}; }
 }

 /*────────────────────────────────────────────────────────────
   8. Custom Utilities
  ────────────────────────────────────────────────────────────*/
  @media (prefers-reduced-motion: no-preference) {
  @keyframes app-logo-spin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  .App-logo { animation: app-logo-spin infinite 20s linear; }
}

`;

export default GlobalStyle;
