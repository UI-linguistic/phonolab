import { DefaultTheme } from 'styled-components';

export const theme: DefaultTheme = {
  colors: {
    primary: '#107E7D', 
    secondary: '#F26522', // Orange for buttons
    text: '#333333',
    background: '#EFD9CE',
    accent: '#4A90E2'
  },
  fonts: {
    main: "'Roboto', sans-serif",
    heading: "'Poppins', sans-serif"
  },
  spacing: {
    small: '8px',
    medium: '16px',
    large: '24px',
    xlarge: '32px'
  },
  borderRadius: '8px',
  transitions: {
    default: '0.3s ease'
  }
}; 