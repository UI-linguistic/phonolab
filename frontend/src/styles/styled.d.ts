import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      backgroundAccent: string;
      primary: string;
      secondary: string;
      tertiary: string;

      cellHoverPrimary: string;
      cellHoverSecondary: string;

      cellActivePrimary: string;
      cellActiveSecondary: string;

      frameHoverPrimary: string;
      frameHoverSecondary: string;

      frameActivePrimary: string;
      frameActiveSecondary: string;

      accent: string;
      secondaryAccent: string;
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

    fontSizes: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
      xxl: string;
    };
    lineHeights: {
      xs: number;
      sm: number;
      md: number;
      lg: number;
      xl: number;
      xxl: number;
    };

    spacing: {
      xsmall: string;
      small: string;
      medium: string;
      large: string;
      xlarge: string;
    };
    heroGaps: {
      tight: string;
      normal: string;
      wide: string;
    };

    borderRadius: string;
    borderWidths: {
      thin: string;
      default: string;
      thick: string;
    };
    border: {
      default: string;
      subtle: string;
      highlight: string;
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

    transitions: {
      default: string;
    };

    breakpoints: {
      mobile: string;
      tablet: string;
      desktop: string;
      widescreen: string;
    };

    layout: {
      gutter: string;
      headerHeight: string;
      footerHeight: string;
      maxContentWidth: string;
    };

    debugOutline?: boolean;
  }
}
