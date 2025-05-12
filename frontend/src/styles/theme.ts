import { DefaultTheme } from 'styled-components';
import tokens from './design-tokens.json';

export type HeroGaps = {
  tight: string;
  normal: string;
  wide: string;
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
  },

  // ────────────────────────────────────────────────────────────
  // Typography
  // ────────────────────────────────────────────────────────────
  typography: {
    title: ['h1', { min: tokens.fontsize['700'].$value, fluid: '2vw + 1rem', max: tokens.fontsize['900'].$value }, tokens.lineheight['600'].$value, 'bold'],
    subtitle: ['h2', { min: tokens.fontsize['600'].$value, fluid: '1.8vw + 0.8rem', max: tokens.fontsize['700'].$value }, tokens.lineheight['500'].$value, 'medium'],
    body: ['p', { min: tokens.fontsize['300'].$value, fluid: '1.6vw + 0.4rem', max: tokens.fontsize['400'].$value }, tokens.lineheight['400'].$value, 'normal'],
    label: ['span', { min: tokens.fontsize['200'].$value, fluid: '1.4vw + 0.2rem', max: tokens.fontsize['200'].$value }, tokens.lineheight['300'].$value, 'medium'],
    instruction: ['p', { min: tokens.fontsize['200'].$value, fluid: '1.4vw + 0.2rem', max: tokens.fontsize['300'].$value }, tokens.lineheight['400'].$value, 'normal'],
    caption: ['p', { min: tokens.fontsize['100'].$value, fluid: '1.2vw + 0.1rem', max: tokens.fontsize['200'].$value }, tokens.lineheight['200'].$value, 'light'],
    layoutTitle: ['h1', { min: tokens.fontsize['500'].$value, fluid: '3vw', max: tokens.fontsize['700'].$value }, tokens.lineheight['500'].$value, 'bold'],
    layoutSubtitle: ['p', { min: tokens.fontsize['100'].$value, fluid: '1.5vw', max: tokens.fontsize['300'].$value }, tokens.lineheight['300'].$value, 'normal'],
    layoutInstruction: ['p', { min: tokens.fontsize['300'].$value, fluid: '1.8vw', max: tokens.fontsize['400'].$value }, tokens.lineheight['400'].$value, 'normal'],
    layoutQuizTitle: ['h1', { min: tokens.fontsize['500'].$value, fluid: '3vw', max: tokens.fontsize['700'].$value }, tokens.lineheight['500'].$value, 'bold'],
    layoutQuizInstruction: ['p', { min: tokens.fontsize['300'].$value, fluid: '1.8vw', max: tokens.fontsize['400'].$value }, tokens.lineheight['400'].$value, 'normal'],
    gridPhoneme: ['span', { min: tokens.fontsize['300'].$value, fluid: '2vw', max: tokens.fontsize['400'].$value }, tokens.lineheight['200'].$value, 'bold'],

    // Hero title "Start Your Vowel Journey"
    heroTitle: ['h1', { min: '2rem', fluid: '4vw + 1rem', max: '2.8rem' }, tokens.typography.heroTitle.$value.lineHeight, 'extrabold'],
    heroSubtitle: ['h2', { min: '1.4rem', fluid: '2vw + 0.8rem', max: '1.8rem' }, tokens.typography.heroSubtitle.$value.lineHeight, 'medium'],
    heroInstruction: ['p', { min: tokens.typography.heroInstruction.$value.fontSize, fluid: '2vw + 0.8rem', max: tokens.typography.heroInstruction.$value.fontSize }, tokens.typography.heroInstruction.$value.lineHeight, 'normal'],

    // Quiz-specific typography (larger than regular)
    quizTitle: ['h1', { min: '2.4rem', fluid: '4vw + 1.2rem', max: '3.2rem' }, tokens.typography.quizTitle.$value.lineHeight, 'extrabold'],
    quizSubtitle: ['h2', { min: '1.6rem', fluid: '2.5vw + 1rem', max: '2.2rem' }, tokens.typography.quizSubtitle.$value.lineHeight, 'bold'],
    quizInstruction: ['p', { min: tokens.typography.quizInstruction.$value.fontSize, fluid: '2vw + 0.8rem', max: '1.4rem' }, tokens.typography.quizInstruction.$value.lineHeight, 'medium'],
  },
  // ────────────────────────────────────────────────────────────
  // Font families & weights
  // ────────────────────────────────────────────────────────────
  fonts: {
    inter: tokens.fontFamilies.inter.$value,
    poppins: tokens.fontFamilies.poppins.$value,
  },

  fontWeights: {
    light: tokens.fontweight['300'].$value,
    normal: tokens.fontweight['400'].$value,
    medium: tokens.fontweight['500'].$value,
    bold: tokens.fontweight['700'].$value,
    extrabold: tokens.typography.heroTitle.$value.fontWeight, // 800
  },

  fontSizes: {
    xs: tokens.fontsize['100'].$value,
    sm: tokens.fontsize['200'].$value,
    md: tokens.fontsize['300'].$value,
    lg: tokens.fontsize['400'].$value,
    xl: tokens.fontsize['500'].$value,
    xxl: tokens.fontsize['600'].$value,
    xxxl: tokens.fontsize['800'].$value,  // Add larger size for quiz titles
  },

  lineHeights: {
    xs: tokens.lineheight['200'].$value,
    sm: tokens.lineheight['300'].$value,
    md: tokens.lineheight['400'].$value,
    lg: tokens.lineheight['500'].$value,
    xl: tokens.lineheight['500'].$value,
    xxl: tokens.lineheight['500'].$value,
  },

  // ────────────────────────────────────────────────────────────
  // Spacing & Layout
  // ────────────────────────────────────────────────────────────
  spacing: {
    xsmall: tokens.spacing['100'].$value,
    small: tokens.spacing['200'].$value,
    medium: tokens.spacing['400'].$value,
    large: tokens.spacing['600'].$value,
    xlarge: tokens.spacing['700'].$value,
  },

  heroGaps: {
    tight: tokens.spacing['400'].$value,
    normal: tokens.spacing['700'].$value,
    wide: tokens.spacing['800'].$value,
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
  },

  // ────────────────────────────────────────────────────────────
  // Z‑Index, Opacity, Transitions, Breakpoints, Layout
  // ────────────────────────────────────────────────────────────
  layers: {
    base: 0,
    dropdown: 1000,
    modal: 2000,
    tooltip: 3000,
  },

  opacity: {
    low: tokens.opacity['200'].$value,
    medium: tokens.opacity['500'].$value,
    high: tokens.opacity['800'].$value,
  },

  transitions: {
    default: '200ms ease-in-out',
  },

  breakpoints: {
    mobile: '480px',
    tablet: '768px',
    desktop: '1024px',
    widescreen: '1600px',
  },

  layout: {
    gutter: tokens.spacing['400'].$value,
    headerHeight: '64px',
    footerHeight: '64px',
    maxContentWidth: '105ch',
  },

  mediaSizes: {
    xsmall: tokens.mediaSizes['xsmall'].$value,
    small: tokens.mediaSizes['small'].$value,
    medium: tokens.mediaSizes['medium'].$value,
    large: tokens.mediaSizes['large'].$value,
    xlarge: tokens.mediaSizes['xlarge'].$value,
  },

  debugOutline: false,
};

export default theme;
