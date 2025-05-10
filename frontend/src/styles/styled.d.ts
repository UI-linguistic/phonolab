// src/styles/styled.d.ts
import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      primary: string;
      secondary: string;
      tertiary: string;

      // cell hover variants
      cellHoverPrimary: string;
      cellHoverSecondary: string;

      // cell active variants
      cellActivePrimary: string;
      cellActiveSecondary: string;

      // frame hover variants
      frameHoverPrimary: string;
      frameHoverSecondary: string;

      // frame active variants
      frameActivePrimary: string;
      frameActiveSecondary: string;

      // ...other colors...
      accent: string;
      secondaryAccent
      background: string;
      text: string;
      textSubtle: string;
      circleBg: string;
      white: string;
      black: string;
      greyLight: string;
      grey: string;
      greyDark: string;
    };
    // Fonts
    fonts: {
      main: string;
      heading: string;
    };

    // Spacing scale
    spacing: {
      xsmall: string;
      small: string;
      medium: string;
      large: string;
      xlarge: string;
    };

    // Border settings
    borderRadius: string;
    border: {
      default: string;
      subtle: string;
      highlight: string;
    };
    borderWidths: {
      thin: string;
      default: string;
      thick: string;
    };

    // Typography
    fontSizes: { xs: string; sm: string; md: string; lg: string; xl: string; xxl: string; };
    lineHeights: { xs: number; sm: number; md: number; lg: number; xl: number; xxl: number; };

    // Layout dimensions
    layout: {
      gutter: string;
      headerHeight: string;
      footerHeight: string;
      maxContentWidth: string;
    };

    // Breakpoints for media queries
    breakpoints: {
      mobile: string;
      tablet: string;
      desktop: string;
      widescreen: string;
    };

    // Z‑index layers and shadows
    layers: { base: number; dropdown: number; modal: number; tooltip: number; };
    shadows: { low: string; medium: string; high: string; };

    // Utility
    transitions: { default: string; };
    opacity: { low: number; medium: number; high: number; };
  }
}