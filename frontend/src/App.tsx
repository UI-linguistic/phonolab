// src/App.tsx
import React from 'react';
import { ThemeProvider } from 'styled-components';
import baseTheme from '@styles/theme';
import { DebugProvider, useDebug } from './DebugContext';
import AppRoutes from './routes';

function ThemedApp() {
  const { debugOutline } = useDebug();
  const theme = { ...baseTheme, debugOutline };
  return (
    <ThemeProvider theme={theme}>
      <AppRoutes />
    </ThemeProvider>
  );
}

export default function App() {
  return (
    <DebugProvider>
      <ThemedApp />
    </DebugProvider>
  );
}
