import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  /*────────────────────────────────────────────────────────────
   1. Reset & Box‑Sizing
  ────────────────────────────────────────────────────────────*/
  *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }

  /*────────────────────────────────────────────────────────────
   2. ROOT & ACCESSIBILITY
  ────────────────────────────────────────────────────────────*/
  html {
    font-size: clamp(10px, 2.2vw, 16px);
    scroll-behavior: smooth;
    color-scheme: light;
    color-rendering: optimizeQuality;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body {
    font-family: ${({ theme }) => theme.fonts.main};
    background: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
    line-height: ${({ theme }) => theme.lineHeights.md};
    font-size: 1.6rem;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    html {
      font-size: clamp(9px, 3vw, 14px);
    }
  }

  .skip-link {
    position:absolute; top:-3rem; left:1rem;
    background: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.white};
    padding: ${({ theme }) => theme.spacing.small};
    z-index: ${({ theme }) => theme.layers.modal};
    transition: top 150ms ease-in;
  }
  .skip-link:focus { top:1rem; }

  /*────────────────────────────────────────────────────────────
   3. Color Management
  ────────────────────────────────────────────────────────────*/
  img, video, canvas {
    color-scheme: light;
    color-rendering: optimizeQuality;
  }

  /*────────────────────────────────────────────────────────────
   4. Typography
  ────────────────────────────────────────────────────────────*/
  h1,h2,h3,h4,h5,h6 {
    font-family: ${({ theme }) => theme.fonts.heading};
    font-weight:600;
    margin-bottom: ${({ theme }) => theme.spacing.small};
    line-height: ${({ theme }) => theme.lineHeights.sm};
    color: ${({ theme }) => theme.colors.text};
  }
  h1 { font-size: ${({ theme }) => theme.fontSizes.xxl}; }
  h2 { font-size: ${({ theme }) => theme.fontSizes.xl}; }
  h3 { font-size: ${({ theme }) => theme.fontSizes.lg}; }
  h4 { font-size: ${({ theme }) => theme.fontSizes.md}; }
  h5 { font-size: ${({ theme }) => theme.fontSizes.sm}; }
  h6 { font-size: ${({ theme }) => theme.fontSizes.xs}; }

  p, ul, ol {
    // margin-bottom: ${({ theme }) => theme.spacing.medium};
    font-size: ${({ theme }) => theme.fontSizes.md};
  }
  ul, ol { padding-left: ${({ theme }) => theme.spacing.large}; }

  /*────────────────────────────────────────────────────────────
   5. Links & Buttons
  ────────────────────────────────────────────────────────────*/
  a {
    color:inherit;
    text-decoration:none;
    transition: color ${({ theme }) => theme.transitions.default};
  }
  a:hover { color: ${({ theme }) => theme.colors.accent}; }

  button, input, select, textarea {
    font:inherit;
    cursor:pointer;
    border:none;
    border-radius: ${({ theme }) => theme.borderRadius};
  }

  /*────────────────────────────────────────────────────────────
   6. Focus & Selection
  ────────────────────────────────────────────────────────────*/
 :focus {
   outline: ${({ theme }) => theme.borderWidths.thin} solid ${({ theme }) => theme.colors.accent};
   outline-offset: ${({ theme }) => theme.spacing.xsmall};
 }

  ::selection {
    background: ${({ theme }) => theme.colors.accent};
    color: ${({ theme }) => theme.colors.white};
  }

  /*────────────────────────────────────────────────────────────
   7. Responsive Tweaks (use theme.breakpoints)
  ────────────────────────────────────────────────────────────*/
  @media (max-width: ${({ theme }) => theme.breakpoints.desktop}) {
    html { font-size: clamp(10px, 2vw, 16px); }
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    body { font-size: ${({ theme }) => theme.fontSizes.sm}; }
    h1 { font-size: ${({ theme }) => theme.fontSizes.xl}; }
    main { padding: ${({ theme }) => theme.spacing.medium}; }
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    body { font-size: ${({ theme }) => theme.fontSizes.xs}; }
    h1 { font-size: ${({ theme }) => theme.fontSizes.lg}; }
    main {
      padding-left: ${({ theme }) => theme.spacing.small};
      padding-right: ${({ theme }) => theme.spacing.small};
    }
  }

  /*────────────────────────────────────────────────────────────
   8. Custom Utilities
  ────────────────────────────────────────────────────────────*/
  .container {
    width:100%;
    max-width: min(1200px, 85ch);
    margin:0 auto;
    padding:0 ${({ theme }) => theme.layout.gutter};
  }
  @media (prefers-reduced-motion: no-preference) {
    @keyframes app-logo-spin {
      from { transform: rotate(0); }
      to { transform: rotate(360deg); }
    }
    .App-logo {
      animation: app-logo-spin infinite 20s linear;
    }
  }
`;

export default GlobalStyle;
