// ================================
// src/index.tsx
// ================================
import React from 'react';
import ReactDOM from 'react-dom/client';

// styled‑components
import { ThemeProvider as SCProvider } from 'styled-components';
import GlobalStyle from './styles/GlobalStyle';
import scTheme from './styles/theme';

// Mantine
import { MantineProvider } from '@mantine/core';
import mantineTheme from './styles/mantineTheme';

import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    {/*────────────────────────────────────────────────────────────
      1. Styled‑Components ThemeProvider
    ────────────────────────────────────────────────────────────*/}
    <SCProvider theme={scTheme}>
      {/* Global resets & utilities via styled-components */}
      <GlobalStyle />

      {/*────────────────────────────────────────────────────────────
        2. MantineProvider: normalization & theming
      ────────────────────────────────────────────────────────────*/}
      <MantineProvider
        withCssVariables
        theme={mantineTheme}
      >
        <App />
      </MantineProvider>
    </SCProvider>
  </React.StrictMode>
);

reportWebVitals();