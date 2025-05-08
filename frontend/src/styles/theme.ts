import { DefaultTheme } from 'styled-components';

export const theme: DefaultTheme = {
  colors: {
    primary: '#107E7D',          // Teal (navbar link hover)
    secondary: '#F26522',        // Orange (solid buttons)
    accent: '#4A90E2',           // Blue accent for highlights
    background: '#EFD9CE',       // Cream background
    circleBg: '#2a2a2a',         // Soft muted circle background
    text: '#333333',             // Main text color
    textSubtle: '#777777',       // Secondary/subtle text
    white: '#FFFFFF',
    black: '#000000',
    greyLight: '#F5F5F5',        // Light grey
    grey: '#CCCCCC',             // Mid grey
    greyDark: '#999999',         // Dark grey
  },
  fonts: {
    main: "'Roboto', sans-serif",
    heading: "'Poppins', sans-serif",
  },
  spacing: {
    small: '8px',
    medium: '16px',
    large: '24px',
    xlarge: '32px',
  },
  borderRadius: '8px',
  border: {
    default: '1px solid #CCCCCC',   // default mid grey
    subtle: '1px solid #F5F5F5',     // very light border
    highlight: '2px solid #000000',  // black border for highlighted buttons
  },
  transitions: {
    default: '0.3s ease',
  },
};
