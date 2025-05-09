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
    fonts: {
      main: string;
      heading: string;
    };
    spacing: {
      xsmall: string;
      small: string;
      medium: string;
      large: string;
      xlarge: string;
    };
    borderRadius: string;
    border: {
      default: string;
      subtle: string;
      highlight: string;
    };
    transitions: {
      default: string;
    };
    breakpoints: {
      mobile: string;
      tablet: string;
      desktop: string;
    };
    shadows: {
      low: string;
      medium: string;
      high: string;
    };
    layers: {
      base: number;
      dropdown: number;
      modal: number;
      tooltip: number;
    };
    opacity: {
      low: number;
      medium: number;
      high: number;
    };
    borderWidths: {
      thin: string;
      default: string;
      thick: string;
    };
    fontSizes: {
      xs: string; sm: string; md: string; lg: string; xl: string; xxl: string;
    };
    lineHeights: {
      xs: number; sm: number; md: number; lg: number; xl: number; xxl: number;
    };
    layout: {
      gutter: string;
      headerHeight: string;
      footerHeight: string;
    };
  }
}