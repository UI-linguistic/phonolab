import 'styled-components';

// Define types for fluid typography values
type FluidTypography = {
  min: string;
  fluid: string;
  max: string;
};

// Define types for typography entries
type TypographyEntry = [string, FluidTypography, string, string];

// Define hero gaps type
type HeroGaps = {
  tight: string;
  normal: string;
  wide: string;
};

declare module 'styled-components' {
  export interface DefaultTheme {
    // ────────────────────────────────────────────────────────────
    // Colors
    // ────────────────────────────────────────────────────────────
    colors: {
      backgroundAccent: string;
      primary: string;
      secondary: string;
      tertiary: string;
      cellHoverPrimary: string;
      cellHoverSecondary: string;
      cellActivePrimary: string;
      cellActiveSecondary: string;
      vowelHoverPrimary: string;
      vowelHoverSecondary: string;
      vowelActivePrimary: string;
      vowelActiveSecondary: string;
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
      // Quiz-specific colors
      quizSectionTitle: string;
      quizSectionSubtitle: string;
      quizNavigationHover: string;
      // Quiz answer feedback colors
      answerCorrect: string;
      answerIncorrect: string;
      answerIncorrectX: string;
      // Component-specific backgrounds
      graphemeBoxBackground: string;
      // Tongue grid specific colors
      tongueGridFront: string;
      tongueGridHigh: string;
      tongueGridArrow: string;
      tongueGridBorder: string;
      tongueGridCellActive: string;
      tongueGridCellHover: string;
      tongueGridVowelActive: string;
      tongueGridVowelHover: string;
    };

    // ────────────────────────────────────────────────────────────
    // Typography
    // ────────────────────────────────────────────────────────────
    typography: {
      title: TypographyEntry;
      subtitle: TypographyEntry;
      body: TypographyEntry;
      label: TypographyEntry;
      instruction: TypographyEntry;
      caption: TypographyEntry;
      layoutTitle: TypographyEntry;
      layoutSubtitle: TypographyEntry;
      layoutInstruction: TypographyEntry;
      layoutQuizTitle: TypographyEntry;
      layoutQuizInstruction: TypographyEntry;
      gridPhoneme: TypographyEntry;
      heroTitle: TypographyEntry;
      heroSubtitle: TypographyEntry;
      heroInstruction: TypographyEntry;
      quizTitle: TypographyEntry;
      quizSubtitle: TypographyEntry;
      quizInstruction: TypographyEntry;
    };

    // ────────────────────────────────────────────────────────────
    // Font families & weights
    // ────────────────────────────────────────────────────────────
    fonts: {
      inter: string;
      poppins: string;
    };

    fontWeights: {
      light: string;
      normal: string;
      medium: string;
      bold: string;
      extrabold: string;
    };

    fontSizes: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
      xxl: string;
      xxxl: string;
    };

    lineHeights: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
      xxl: string;
    };

    // ────────────────────────────────────────────────────────────
    // Spacing & Layout
    // ────────────────────────────────────────────────────────────
    spacing: {
      xsmall: string;
      small: string;
      medium: string;
      large: string;
      xlarge: string;
      responsive: {
        small: string;
        medium: string;
        large: string;
        xlarge: string;
      }
    };

    heroGaps: HeroGaps;

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
      mobile: {
        low: string;
        medium: string;
        high: string;
      }
    };

    // ────────────────────────────────────────────────────────────
    // Responsive breakpoints
    // ────────────────────────────────────────────────────────────
    breakpoints: {
      mobile: string;
      tablet: string;
      desktop: string;
      widescreen: string;
    };

    media: {
      mobile: string;
      tablet: string;
      desktop: string;
      widescreen: string;
      hover: string;
      reducedMotion: string;
      darkMode: string;
    };

    // ────────────────────────────────────────────────────────────
    // Layout
    // ────────────────────────────────────────────────────────────
    layout: {
      containerPadding: {
        mobile: string;
        tablet: string;
        desktop: string;
        widescreen: string;
      };
      maxWidth: {
        small: string;
        medium: string;
        large: string;
        xlarge: string;
      };
      grid: {
        columns: {
          mobile: number;
          tablet: number;
          desktop: number;
          widescreen: number;
        };
        gap: {
          mobile: string;
          tablet: string;
          desktop: string;
          widescreen: string;
        };
      };
      sectionSpacing: {
        mobile: string;
        tablet: string;
        desktop: string;
      };
      componentSpacing: {
        mobile: string;
        tablet: string;
        desktop: string;
      };
      footerHeight: {
        mobile: string;
        tablet: string;
        desktop: string;
        widescreen: string;
      };
    };

    // ────────────────────────────────────────────────────────────
    // Transitions & Animations
    // ────────────────────────────────────────────────────────────
    transitions: {
      short: string;
      medium: string;
      long: string;
      reducedMotion: {
        short: string;
        medium: string;
        long: string;
      };
    };

    // ────────────────────────────────────────────────────────────
    // Z-index layers
    // ────────────────────────────────────────────────────────────
    zIndex: {
      base: number;
      content: number;
      navigation: number;
      overlay: number;
      modal: number;
      toast: number;
      tooltip: number;
    };

    // ────────────────────────────────────────────────────────────
    // Touch targets
    // ────────────────────────────────────────────────────────────
    touchTargets: {
      min: string;
      icon: {
        small: string;
        medium: string;
        large: string;
      };
      button: {
        small: string;
        medium: string;
        large: string;
      };
    };

    // ────────────────────────────────────────────────────────────
    // Aspect ratios
    // ────────────────────────────────────────────────────────────
    aspectRatios: {
      square: string;
      portrait: string;
      landscape: string;
      widescreen: string;
      ultrawide: string;
    };

    // ────────────────────────────────────────────────────────────
    // Tongue grid settings
    // ────────────────────────────────────────────────────────────
    tongueGrid: {
      cellSize: {
        mobile: string;
        tablet: string;
        desktop: string;
      };
      gap: {
        mobile: string;
        tablet: string;
        desktop: string;
      };
      borderRadius: {
        mobile: string;
        tablet: string;
        desktop: string;
      };
    };

    // ────────────────────────────────────────────────────────────
    // Quiz-specific settings
    // ────────────────────────────────────────────────────────────
    quiz: {
      optionSize: {
        mobile: string;
        tablet: string;
        desktop: string;
      };
      feedbackIconSize: {
        mobile: string;
        tablet: string;
        desktop: string;
      };
      navigationButtonSize: {
        mobile: string;
        tablet: string;
        desktop: string;
      };
    };

    // ────────────────────────────────────────────────────────────
    // Debug settings
    // ────────────────────────────────────────────────────────────
    debug: {
      enabled: boolean;
      outlines: {
        container: string;

        component: string;

        element: string;
        grid: string;
        cell: string;
        focus: string;
      },

      grid: {

        background: string;

        alternateRows: string;
      },

      zIndex: number;

      labels: {
        enabled: true,
        fontSize: string;
        background: string;
        color: string;
        padding: string;
        borderRadius: string;
        position: string;
      },
    },

  }
}

export default styled;