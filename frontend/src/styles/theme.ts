import { DefaultTheme } from 'styled-components';
import tokens from './design-tokens.json';

export type HeroGaps = {
  tight: string;
  normal: string;
  wide: string;
};

// Helper function to create fluid typography values
const fluidType = (minSize: string, maxSize: string, minWidth = '320px', maxWidth = '1200px') => {
  const minSizeNum = parseFloat(minSize);
  const maxSizeNum = parseFloat(maxSize);
  const minWidthNum = parseFloat(minWidth);
  const maxWidthNum = parseFloat(maxWidth);

  // Calculate the slope and base value for fluid typography
  const slope = (maxSizeNum - minSizeNum) / (maxWidthNum - minWidthNum);
  const base = minSizeNum - slope * minWidthNum;

  return `clamp(${minSize}, ${base.toFixed(2)}px + ${slope.toFixed(4)} * 100vw, ${maxSize})`;
};

// Mobile-first breakpoints (min-width)
const breakpoints = {
  mobile: '480px',
  tablet: '768px',
  desktop: '1024px',
  widescreen: '1600px',
};

const theme: DefaultTheme = {
  // ────────────────────────────────────────────────────────────
  // Colors
  // ────────────────────────────────────────────────────────────
  colors: {
    backgroundAccent: tokens.color.brandAccent['500'].$value,
    primary: tokens.color.brandPrimary['500'].$value,
    secondary: tokens.color.brandSecondary['500'].$value,
    tertiary: tokens.color.brandTertiary['500'].$value,
    cellHoverPrimary: `rgba(${parseInt(tokens.color.brandSecondary['500'].$value.slice(1, 3), 16)}, ${parseInt(tokens.color.brandSecondary['500'].$value.slice(3, 5), 16)}, ${parseInt(tokens.color.brandSecondary['500'].$value.slice(5, 7), 16)}, 0.2)`,
    cellHoverSecondary: `rgba(${parseInt(tokens.color.brandAccent['500'].$value.slice(1, 3), 16)}, ${parseInt(tokens.color.brandAccent['500'].$value.slice(3, 5), 16)}, ${parseInt(tokens.color.brandAccent['500'].$value.slice(5, 7), 16)}, 0.2)`,
    cellActivePrimary: tokens.color.brandSecondary['300'].$value,
    cellActiveSecondary: tokens.color.brandPrimary['300'].$value,
    vowelHoverPrimary: '#FFEB3B',
    vowelHoverSecondary: 'rgba(247, 229, 70, 0.76)',
    vowelActivePrimary: '#FFEB3B',
    vowelActiveSecondary: 'rgba(247, 229, 70, 0.76)',
    accent: `rgba(${parseInt(tokens.color.brandSecondary['500'].$value.slice(1, 3), 16)}, ${parseInt(tokens.color.brandSecondary['500'].$value.slice(3, 5), 16)}, ${parseInt(tokens.color.brandSecondary['500'].$value.slice(5, 7), 16)}, 0.5)`,
    secondaryAccent: tokens.color.brandDark['500'].$value,
    background: tokens.color.neutral.background.$value,
    text: tokens.color.neutral.text.$value,
    textSubtle: tokens.color.neutral.textSubtle.$value,
    circleBg: tokens.color.neutral.black.$value,
    white: tokens.color.neutral.white.$value,
    black: tokens.color.neutral.black.$value,
    greyLight: tokens.color.neutral.background.$value,
    grey: tokens.color.neutral.border.$value,
    greyDark: tokens.color.brandTertiary['600'].$value,
    // Quiz-specific colors
    quizSectionTitle: '#000000', // Black for quiz section titles
    quizSectionSubtitle: '#63535B', // Dark mauve/purple for quiz section subtitles
    quizNavigationHover: '#5E5E5E', // Medium gray for back/next arrow hover states
    // Quiz answer feedback colors
    answerCorrect: '#308A88', // Teal for correct answers
    answerIncorrect: '#FF644E', // Coral/red for wrong answers
    answerIncorrectX: '#EE220C', // Bright red for wrong answer X component
    // Component-specific backgrounds
    graphemeBoxBackground: '#48423E', // Dark brown/gray for grapheme box backgrounds
    // Tongue grid specific colors
    tongueGridFront: '#8b2252', // Burgundy color for the "Front" label
    tongueGridHigh: tokens.color.brandPrimary['500'].$value, // Primary color for the "High" label
    tongueGridArrow: '#444444', // Dark gray for grid arrows
    tongueGridBorder: tokens.color.neutral.black.$value, // Black for grid borders
    tongueGridCellActive: `${tokens.color.brandSecondary['500'].$value}50`, // Semi-transparent secondary color for active grid cell
    tongueGridCellHover: `${tokens.color.brandSecondary['500'].$value}15`, // Light secondary color for hover state
    tongueGridVowelActive: 'hsl(54, 100%, 64.9%)', // Bright yellow for active vowel button
    tongueGridVowelHover: 'rgba(255, 232, 26, 0.94)', // Slightly transparent yellow for vowel button hover
  },

  // ────────────────────────────────────────────────────────────
  // Typography - Enhanced with fluid typography
  // ────────────────────────────────────────────────────────────
  typography: {
    title: ['h1', {
      min: tokens.fontsize['600'].$value,
      fluid: fluidType('2.4rem', '4.8rem'),
      max: tokens.fontsize['900'].$value
    }, String(tokens.lineheight['600'].$value), 'bold'],

    subtitle: ['h2', {
      min: tokens.fontsize['500'].$value,
      fluid: fluidType('2rem', '3rem'),
      max: tokens.fontsize['700'].$value
    }, String(tokens.lineheight['500'].$value), 'medium'],

    body: ['p', {
      min: tokens.fontsize['200'].$value,
      fluid: fluidType('1.4rem', '1.8rem'),
      max: tokens.fontsize['400'].$value
    }, String(tokens.lineheight['400'].$value), 'normal'],

    label: ['span', {
      min: tokens.fontsize['100'].$value,
      fluid: fluidType('1.2rem', '1.4rem'),
      max: tokens.fontsize['200'].$value
    }, String(tokens.lineheight['300'].$value), 'medium'],

    instruction: ['p', {
      min: tokens.fontsize['100'].$value,
      fluid: fluidType('1.2rem', '1.6rem'),
      max: tokens.fontsize['300'].$value
    }, String(tokens.lineheight['400'].$value), 'normal'],

    caption: ['p', {
      min: tokens.fontsize['100'].$value,
      fluid: fluidType('1rem', '1.4rem'),
      max: tokens.fontsize['200'].$value
    }, String(tokens.lineheight['200'].$value), 'light'],

    layoutTitle: ['h1', {
      min: tokens.fontsize['400'].$value,
      fluid: fluidType('1.8rem', '3rem'),
      max: tokens.fontsize['700'].$value
    }, String(tokens.lineheight['500'].$value), 'bold'],

    layoutSubtitle: ['p', {
      min: tokens.fontsize['100'].$value,
      fluid: fluidType('1.2rem', '1.6rem'),
      max: tokens.fontsize['300'].$value
    }, String(tokens.lineheight['300'].$value), 'normal'],

    layoutInstruction: ['p', {
      min: tokens.fontsize['200'].$value,
      fluid: fluidType('1.4rem', '1.8rem'),
      max: tokens.fontsize['400'].$value
    }, String(tokens.lineheight['400'].$value), 'normal'],

    layoutQuizTitle: ['h1', {
      min: tokens.fontsize['400'].$value,
      fluid: fluidType('1.8rem', '3rem'),
      max: tokens.fontsize['700'].$value
    }, String(tokens.lineheight['500'].$value), 'bold'],

    layoutQuizInstruction: ['p', {
      min: tokens.fontsize['200'].$value,
      fluid: fluidType('1.4rem', '1.8rem'),
      max: tokens.fontsize['400'].$value
    }, String(tokens.lineheight['400'].$value), 'normal'],

    gridPhoneme: ['span', {
      min: tokens.fontsize['200'].$value,
      fluid: fluidType('1.4rem', '1.8rem'),
      max: tokens.fontsize['400'].$value
    }, String(tokens.lineheight['200'].$value), 'bold'],

    // Hero title "Start Your Vowel Journey"
    heroTitle: ['h1', {
      min: '2rem',
      fluid: fluidType('2rem', '2.8rem'),
      max: '2.8rem'
    }, String(tokens.typography.heroTitle.$value.lineHeight), 'extrabold'],

    heroSubtitle: ['h2', {
      min: '1.2rem',
      fluid: fluidType('1.2rem', '1.8rem'),
      max: '1.8rem'
    }, String(tokens.typography.heroSubtitle.$value.lineHeight), 'medium'],

    heroInstruction: ['p', {
      min: '1rem',
      fluid: fluidType('1rem', tokens.typography.heroInstruction.$value.fontSize),
      max: tokens.typography.heroInstruction.$value.fontSize
    }, String(tokens.typography.heroInstruction.$value.lineHeight), 'normal'],

    // Quiz-specific typography (larger than regular)
    quizTitle: ['h1', {
      min: '1.8rem',
      fluid: fluidType('1.8rem', '3.2rem'),
      max: '3.2rem'
    }, String(tokens.typography.quizTitle.$value.lineHeight), 'extrabold'],

    quizSubtitle: ['h2', {
      min: '1.4rem',
      fluid: fluidType('1.4rem', '2.2rem'),
      max: '2.2rem'
    }, String(tokens.typography.quizSubtitle.$value.lineHeight), 'bold'],

    quizInstruction: ['p', {
      min: '1.2rem',
      fluid: fluidType('1.2rem', '1.4rem'),
      max: '1.4rem'
    }, String(tokens.typography.quizInstruction.$value.lineHeight), 'medium'],
  },

  // ────────────────────────────────────────────────────────────
  // Font families & weights
  // ────────────────────────────────────────────────────────────
  fonts: {
    inter: tokens.fontFamilies.inter.$value,
    poppins: tokens.fontFamilies.poppins.$value,
  },

  fontWeights: {
    light: String(tokens.fontweight['300'].$value),
    normal: String(tokens.fontweight['400'].$value),
    medium: String(tokens.fontweight['500'].$value),
    bold: String(tokens.fontweight['700'].$value),
    extrabold: String(tokens.typography.heroTitle.$value.fontWeight), // 800
  },

  fontSizes: {
    xs: tokens.fontsize['100'].$value,
    sm: tokens.fontsize['200'].$value,
    md: tokens.fontsize['300'].$value,
    lg: tokens.fontsize['400'].$value,
    xl: tokens.fontsize['500'].$value,
    xxl: tokens.fontsize['600'].$value,
    xxxl: tokens.fontsize['800'].$value, // larger size for quiz titles
  },

  lineHeights: {
    xs: String(tokens.lineheight['200'].$value),
    sm: String(tokens.lineheight['300'].$value),
    md: String(tokens.lineheight['400'].$value),
    lg: String(tokens.lineheight['500'].$value),
    xl: String(tokens.lineheight['500'].$value),
    xxl: String(tokens.lineheight['500'].$value),
  },

  // ────────────────────────────────────────────────────────────
  // Spacing & Layout - Mobile-first approach
  // ────────────────────────────────────────────────────────────
  spacing: {
    xsmall: tokens.spacing['100'].$value,
    small: tokens.spacing['200'].$value,
    medium: tokens.spacing['400'].$value,
    large: tokens.spacing['600'].$value,
    xlarge: tokens.spacing['700'].$value,
    // Responsive spacing that scales with viewport
    responsive: {
      small: fluidType(tokens.spacing['100'].$value, tokens.spacing['200'].$value),
      medium: fluidType(tokens.spacing['200'].$value, tokens.spacing['400'].$value),
      large: fluidType(tokens.spacing['400'].$value, tokens.spacing['600'].$value),
      xlarge: fluidType(tokens.spacing['600'].$value, tokens.spacing['800'].$value),
    }
  },

  heroGaps: {
    tight: fluidType(tokens.spacing['200'].$value, tokens.spacing['400'].$value),
    normal: fluidType(tokens.spacing['400'].$value, tokens.spacing['700'].$value),
    wide: fluidType(tokens.spacing['600'].$value, tokens.spacing['800'].$value),
  },

  borderRadius: tokens.borderradius['400'].$value,

  borderWidths: {
    thin: tokens.borderwidth['100'].$value,
    default: tokens.borderwidth['200'].$value,
    thick: tokens.borderwidth['400'].$value,
  },

  border: {
    default: `${tokens.borderwidth['200'].$value} solid ${tokens.color.neutral.border.$value}`,
    subtle: `${tokens.borderwidth['100'].$value} solid ${tokens.color.neutral.background.$value}`,
    highlight: `1.8px solid ${tokens.color.neutral.black.$value}`,
  },

  shadows: {
    low: tokens.boxshadow['200'].$value,
    medium: tokens.boxshadow['400'].$value,
    high: tokens.boxshadow['700'].$value,
    // Mobile-optimized shadows (lighter for performance)
    mobile: {
      low: '0 1px 2px rgba(0,0,0,0.1)',
      medium: '0 2px 4px rgba(0,0,0,0.15)',
      high: '0 3px 8px rgba(0,0,0,0.2)'
    }
  },

  // ────────────────────────────────────────────────────────────
  // Responsive breakpoints - Mobile-first
  // ────────────────────────────────────────────────────────────
  breakpoints: {
    mobile: '480px',
    tablet: '768px',
    desktop: '1024px',
    widescreen: '1600px'
  },

  // Media query helpers for styled-components
  media: {
    mobile: `@media (min-width: 480px)`,
    tablet: `@media (min-width: 768px)`,
    desktop: `@media (min-width: 1024px)`,
    widescreen: `@media (min-width: 1600px)`,
    hover: `@media (hover: hover)`, // Only apply hover styles on devices that support hover
    reducedMotion: `@media (prefers-reduced-motion: reduce)`,
    darkMode: `@media (prefers-color-scheme: dark)`,
  },

  // ────────────────────────────────────────────────────────────
  // Layout - Mobile-first grid and container settings
  // ────────────────────────────────────────────────────────────
  layout: {
    // Container widths with padding that adjusts based on screen size
    containerPadding: {
      mobile: '16px',
      tablet: '24px',
      desktop: '32px',
      widescreen: '48px'
    },
    // Maximum widths for different container types
    maxWidth: {
      small: '640px',
      medium: '960px',
      large: '1200px',
      xlarge: '1440px'
    },
    // Grid settings
    grid: {
      columns: {
        mobile: 4,
        tablet: 8,
        desktop: 12,
        widescreen: 12
      },
      gap: {
        mobile: '16px',
        tablet: '24px',
        desktop: '32px',
        widescreen: '40px'
      }
    },
    // Section spacing (vertical rhythm)
    sectionSpacing: {
      mobile: fluidType('32px', '48px'),
      tablet: fluidType('48px', '64px'),
      desktop: fluidType('64px', '96px')
    },
    // Component spacing
    componentSpacing: {
      mobile: fluidType('16px', '24px'),
      tablet: fluidType('24px', '32px'),
      desktop: fluidType('32px', '48px')
    },
    footerHeight: {
      mobile: '50px',
      tablet: '60px',
      desktop: '70px',
      widescreen: '80px'
    }
  },

  // ────────────────────────────────────────────────────────────
  // Transitions & Animations - Mobile-optimized
  // ────────────────────────────────────────────────────────────
  transitions: {
    // Shorter, snappier transitions for mobile
    short: '150ms ease-out',
    medium: '250ms ease-in-out',
    long: '350ms ease-in-out',
    // Reduced motion alternatives
    reducedMotion: {
      short: '0ms',
      medium: '50ms ease-out',
      long: '100ms ease-out'
    }
  },

  // ────────────────────────────────────────────────────────────
  // Z-index layers - Organized for consistent stacking
  // ────────────────────────────────────────────────────────────
  zIndex: {
    base: 1,
    content: 10,
    navigation: 100,
    overlay: 200,
    modal: 300,
    toast: 400,
    tooltip: 500
  },

  // ────────────────────────────────────────────────────────────
  // Touch targets - Ensuring mobile accessibility
  // ────────────────────────────────────────────────────────────
  touchTargets: {
    min: '44px', // Minimum touch target size per WCAG guidelines
    icon: {
      small: '32px',
      medium: '44px',
      large: '56px'
    },
    button: {
      small: '36px',
      medium: '44px',
      large: '56px'
    }
  },

  // ────────────────────────────────────────────────────────────
  // Aspect ratios - For responsive media
  // ────────────────────────────────────────────────────────────
  aspectRatios: {
    square: '1/1',
    portrait: '3/4',
    landscape: '16/9',
    widescreen: '21/9',
    ultrawide: '32/9'
  },

  // ────────────────────────────────────────────────────────────
  // Responsive grid settings for tongue diagram
  // ────────────────────────────────────────────────────────────
  tongueGrid: {
    cellSize: {
      mobile: '60px',
      tablet: '70px',
      desktop: '80px'
    },
    gap: {
      mobile: '4px',
      tablet: '6px',
      desktop: '8px'
    },
    borderRadius: {
      mobile: '4px',
      tablet: '6px',
      desktop: '8px'
    }
  },

  // ────────────────────────────────────────────────────────────
  // Quiz-specific responsive settings
  // ────────────────────────────────────────────────────────────
  quiz: {
    optionSize: {
      mobile: '100%', // Full width on mobile
      tablet: 'calc(50% - 12px)', // Two per row on tablet
      desktop: 'calc(50% - 16px)' // Two per row on desktop with larger gap
    },
    feedbackIconSize: {
      mobile: '24px',
      tablet: '32px',
      desktop: '40px'
    },
    navigationButtonSize: {
      mobile: '40px',
      tablet: '48px',
      desktop: '56px'
    }
  },

  // ────────────────────────────────────────────────────────────
  // Debug settings
  // ────────────────────────────────────────────────────────────
  debug: {
    // Master toggle for all debug outlines
    enabled: process.env.NODE_ENV === 'development',

    // Different outline levels with distinct visual styles
    outlines: {
      // Level 1: Container/Section level (red dashed)
      container: '2px dashed rgba(255, 0, 0, 0.5)',

      // Level 2: Component level (blue dotted)
      component: '2px dotted rgba(0, 0, 255, 0.5)',

      // Level 3: Element level (green solid thin)
      element: '1px solid rgba(0, 255, 0, 0.5)',

      // Level 4: Grid level (purple dashed thin)
      grid: '1px dashed rgba(128, 0, 128, 0.5)',

      // Level 5: Cell level (orange dotted thin)
      cell: '1px dotted rgba(255, 165, 0, 0.5)',

      // Special: Focus areas (thick yellow)
      focus: '3px solid rgba(255, 255, 0, 0.7)',
    },

    // Helper for grid visualization
    grid: {
      // Background for grid containers
      background: 'rgba(128, 128, 128, 0.05)',
      // Alternating row colors
      alternateRows: 'rgba(0, 0, 0, 0.02)',
    },

    // Z-index for debug elements to ensure they're visible
    zIndex: 9999,

    // Labels for components (to show component names)
    labels: {
      enabled: true,
      fontSize: '10px',
      background: 'rgba(0, 0, 0, 0.7)',
      color: 'white',
      padding: '2px 4px',
      borderRadius: '2px',
      position: 'top-left', // 'top-left', 'top-right', 'bottom-left', 'bottom-right'
    },
  },
};

export default theme;
