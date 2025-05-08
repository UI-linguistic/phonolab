// src/styles/GlobalStyle.ts
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  /* Font import */
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Roboto:wght@400;500&display=swap');

  /* Reset & box‑sizing */
  *, *::before, *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  /* Make root span full height */
  html, body, #root {
    height: 100%;
  }

  /* Base typography & colors */
  body {
    font-family: ${({ theme }) => theme.fonts.main};
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
    line-height: 1.6;
    font-size: 16px;
  }

  /* Headings */
  h1, h2, h3, h4, h5, h6 {
    font-family: ${({ theme }) => theme.fonts.heading};
    font-weight: 600;
    margin-bottom: ${({ theme }) => theme.spacing.medium};
    color: ${({ theme }) => theme.colors.text};
  }
  h1 { font-size: 2.5rem; }
  h2 { font-size: 2rem;   }
  h3 { font-size: 1.75rem;}
  h4 { font-size: 1.5rem; }
  h5 { font-size: 1.25rem;}
  h6 { font-size: 1rem;   }

  /* Paragraphs & lists */
  p, ul, ol {
    margin-bottom: ${({ theme }) => theme.spacing.medium};
  }
  ul, ol {
    padding-left: ${({ theme }) => theme.spacing.large};
  }

  /* Links */
  a {
    text-decoration: none;
    color: inherit;
  }

  /* Buttons & form elements */
  button, input, select, textarea {
    font-family: inherit;
    cursor: pointer;
    border: none;
    outline: none;
    border-radius: ${({ theme }) => theme.borderRadius};
  }

  /* Utility selection color */
  ::selection {
    background: ${({ theme }) => theme.colors.accent};
    color: #fff;
  }
`;

export default GlobalStyle;
