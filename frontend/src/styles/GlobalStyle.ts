import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  /*────────────────────────────────────────────────────────────
   Import Google Fonts
  ────────────────────────────────────────────────────────────*/
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;800&family=Poppins:wght@400;500;600;700&display=swap');

  /*────────────────────────────────────────────────────────────
   1. Reset & Box‑Sizing
  ────────────────────────────────────────────────────────────*/
  *, *::before, *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  /*────────────────────────────────────────────────────────────
   2. ROOT & ACCESSIBILITY
  ────────────────────────────────────────────────────────────*/
  :root {
    /* Store header height as CSS variable for calculations */
    --header-height: ${({ theme }) => theme.layout.headerHeight};
    --footer-height: ${({ theme }) => theme.layout.footerHeight};
    --content-max-width: ${({ theme }) => theme.layout.maxContentWidth};
    --page-gutter: ${({ theme }) => theme.spacing.small};
    
    @media (min-width: ${({ theme }) => theme.breakpoints.mobile}) {
      --page-gutter: ${({ theme }) => theme.spacing.medium};
    }
    
    @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
      --page-gutter: ${({ theme }) => theme.layout.gutter};
    }
  }

  html {
    /* Base font size - mobile first */
    font-size: 62.5%; /* 10px for easy rem calculations */
    scroll-behavior: smooth;
    color-scheme: light;
    color-rendering: optimizeQuality;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    
    /* Prevent font size adjustments after orientation changes in iOS */
    -webkit-text-size-adjust: 100%;
    
    /* Improve scrolling for all users */
    scroll-padding-top: var(--header-height);
    
    /* Fluid typography scale */
    @media (min-width: ${({ theme }) => theme.breakpoints.mobile}) {
      font-size: 62.5%; /* Maintain 10px at tablet */
    }
    
    @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
      font-size: 62.5%; /* Maintain 10px at desktop */
    }
    
    @media (min-width: ${({ theme }) => theme.breakpoints.widescreen}) {
      font-size: 75%; /* 12px on very large screens */
    }
  }

  body {
    font-family: ${({ theme }) => theme.fonts.inter};
    background: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
    line-height: ${({ theme }) => theme.lineHeights.md};
    font-size: 1.6rem; /* 16px based on html font-size */
    min-height: 100vh;
    
    /* Add support for safe areas on notched devices */
    padding-left: env(safe-area-inset-left, 0);
    padding-right: env(safe-area-inset-right, 0);
    
    /* Improve touch gestures */
    -webkit-tap-highlight-color: transparent;
  }

  /* Skip link for keyboard navigation */
  .skip-link {
    position: absolute;
    top: -4.8rem;
    left: 0;
    background: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.white};
    padding: ${({ theme }) => theme.spacing.small};
    z-index: ${({ theme }) => theme.layers.modal};
    transition: top 150ms ease-in;
    
    &:focus {
      top: 0;
    }
  }

  /*────────────────────────────────────────────────────────────
   3. Color Management & Media
  ────────────────────────────────────────────────────────────*/
  img, video, canvas {
    color-scheme: light;
    color-rendering: optimizeQuality;
    max-width: 100%;
    height: auto;
    display: block; /* Prevent inline gap */
  }

  /* Responsive media handling */
  picture, figure {
    display: block;
    max-width: 100%;
  }

  /*────────────────────────────────────────────────────────────
   4. Typography
  ────────────────────────────────────────────────────────────*/
  h1, h2, h3, h4, h5, h6 {
    font-family: ${({ theme }) => theme.fonts.poppins};
    font-weight: ${({ theme }) => theme.fontWeights.medium};
    margin-bottom: ${({ theme }) => theme.spacing.small};
    line-height: ${({ theme }) => theme.lineHeights.sm};
    color: ${({ theme }) => theme.colors.text};
    
    /* Prevent orphans and widows */
    overflow-wrap: break-word;
    word-wrap: break-word;
    hyphens: auto;
  }

  /* Mobile-first typography - start small and scale up */
  h1 { 
    font-size: 2.4rem; /* Start smaller on mobile */
    
    @media (min-width: ${({ theme }) => theme.breakpoints.mobile}) {
      font-size: 3rem;
    }
    
    @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
      font-size: ${({ theme }) => theme.fontSizes.xxl};
    }
  }
  
  h2 { 
    font-size: 2rem;
    
    @media (min-width: ${({ theme }) => theme.breakpoints.mobile}) {
      font-size: 2.4rem;
    }
    
    @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
      font-size: ${({ theme }) => theme.fontSizes.xl};
    }
  }
  
  h3 { 
    font-size: 1.8rem;
    
    @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
      font-size: ${({ theme }) => theme.fontSizes.lg};
    }
  }
  
  h4 { font-size: ${({ theme }) => theme.fontSizes.md}; }
  h5 { font-size: ${({ theme }) => theme.fontSizes.sm}; }
  h6 { font-size: ${({ theme }) => theme.fontSizes.xs}; }

  p, ul, ol {
    font-size: 1.4rem; /* Smaller on mobile */
    margin-bottom: ${({ theme }) => theme.spacing.medium};
    
    @media (min-width: ${({ theme }) => theme.breakpoints.mobile}) {
      font-size: 1.5rem;
    }
    
    @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
      font-size: ${({ theme }) => theme.fontSizes.md};
    }
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
    
    &:hover {
      color: ${({ theme }) => theme.colors.accent};
    }
    
    /* Improve touch targets on mobile */
    @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
      padding: 0.2rem;
    }
  }

  button, 
  input, 
  select, 
  textarea {
    font-family: inherit;
    font-size: inherit;
    cursor: pointer;
    border: none;
    border-radius: ${({ theme }) => theme.borderRadius};
    
    /* Improve touch targets on mobile */
    @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
      min-height: 44px; /* Apple's recommended minimum touch target size */
    }
  }

  /*────────────────────────────────────────────────────────────
   6. Focus & Selection
  ────────────────────────────────────────────────────────────*/
  :focus-visible {
    outline: ${({ theme }) => theme.borderWidths.thin} solid ${({ theme }) => theme.colors.accent};
    outline-offset: ${({ theme }) => theme.spacing.xsmall};
  }

  ::selection {
    background: ${({ theme }) => theme.colors.accent};
    color: ${({ theme }) => theme.colors.white};
  }

  /*────────────────────────────────────────────────────────────
   7. Responsive Utilities
  ────────────────────────────────────────────────────────────*/
  .container {
    width: 100%;
    max-width: var(--content-max-width);
    margin: 0 auto;
    padding: 0 var(--page-gutter);
  }
  
  /* Responsive visibility classes */
  .hide-on-mobile {
    @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
      display: none !important;
    }
  }
  
  .hide-on-tablet {
    @media (min-width: ${({ theme }) => theme.breakpoints.mobile}) and (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
      display: none !important;
    }
  }
  
  .hide-on-desktop {
    @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
      display: none !important;
    }
  }
  
  .mobile-only {
    @media (min-width: ${({ theme }) => theme.breakpoints.mobile}) {
      display: none !important;
    }
  }
  
  .tablet-only {
    @media (max-width: ${({ theme }) => theme.breakpoints.mobile}), (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
      display: none !important;
    }
  }
  
  .desktop-only {
    @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
      display: none !important;
    }
  }

  /*────────────────────────────────────────────────────────────
   8. Accessibility & Motion Preferences
  ────────────────────────────────────────────────────────────*/
  @media (prefers-reduced-motion: reduce) {
    html {
      scroll-behavior: auto;
    }
    
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
  
  /* High contrast mode improvements */
  @media (forced-colors: active) {
    * {
      border-color: ButtonText;
    }
  }
  
  /* Print styles */
  @media print {
    @page {
      margin: 2cm;
    }
    
    body {
      min-height: auto;
      font-size: 12pt;
      background: white;
      color: black;
    }
    
    nav, footer, button, .no-print {
      display: none !important;
    }
    
    a {
      text-decoration: underline;
      color: black;
    }
    
    a[href^="http"]::after {
      content: " (" attr(href) ")";
      font-size: 0.9em;
    }
  }
`;

export default GlobalStyle;
