// src/styles/theme.ts
import { DefaultTheme } from 'styled-components';

const theme: DefaultTheme = {
  colors: {
    primary: '#107E7D',
    secondary: '#FFA726',
    tertiary: '#63535B',

    cellHoverPrimary: 'rgba(255, 167, 38, 0.2)',
    cellHoverSecondary: 'rgba(255, 112, 67, 0.2)',

    cellActivePrimary: '#FFA726',
    cellActiveSecondary: '#FF7043',

    frameHoverPrimary: 'rgba(255, 235, 59, 0.4)',
    frameHoverSecondary: 'rgba(255, 235, 59, 0.2)',

    frameActivePrimary: '#FFEB3B',
    frameActiveSecondary: '#FFF176',

    // accent: '#F05D23',
    accent: 'rgba(240, 93, 35, 0.5)',
    secondaryAccent: '#6D1A36',
    background: '#EFD9CE',
    text: '#212121',
    textSubtle: '#757575',
    circleBg: '#F5F5F5',
    white: '#FFFFFF',
    black: '#000000',
    greyLight: '#EEEEEE',
    grey: '#BDBDBD',
    greyDark: '#616161',
  },

  fonts: {
    main: "'Roboto', sans-serif",
    heading: "'Poppins', sans-serif",
  },

  fontSizes: {
    xs: '1.2rem',   // 12px
    sm: '1.4rem',   // 14px
    md: '1.6rem',   // 16px
    lg: '1.8rem',   // 18px
    xl: '2.0rem',   // 20px
    xxl: '2.4rem',  // 24px
  },

  lineHeights: {
    xs: 1.2,
    sm: 1.3,
    md: 1.5,
    lg: 1.6,
    xl: 1.6,
    xxl: 1.6,
  },

  spacing: {
    xsmall: '0.4rem',  // 4px
    small: '0.8rem',  // 8px
    medium: '1.6rem',  // 16px
    large: '2.4rem',  // 24px
    xlarge: '3.2rem',  // 32px
  },

  borderRadius: '0.5rem', // 8px

  borderWidths: {
    thin: '1px',
    default: '2px',
    thick: '4px',
  },

  border: {
    default: '2px solid #BDBDBD',
    subtle: '1px solid #EEEEEE',
    highlight: '1.8px solid black',
  },

  shadows: {
    low: '0 1px 3px rgba(0,0,0,0.12)',
    medium: '0 4px 6px rgba(0,0,0,0.10)',
    high: '0 10px 20px rgba(0,0,0,0.15)',
  },

  layers: {
    base: 0,
    dropdown: 1000,
    modal: 2000,
    tooltip: 3000,
  },

  opacity: {
    low: 0.2,
    medium: 0.5,
    high: 0.8,
  },

  transitions: {
    default: '200ms ease-in-out',
  },

  breakpoints: {
    mobile: '480px',
    tablet: '768px',
    desktop: '1024px',
  },

  layout: {
    gutter: '1.6rem',
    headerHeight: '64px',
    footerHeight: '64px',
  },
};

export default theme;