// src/App.tsx
import React, { useMemo } from 'react';
import { ThemeProvider } from 'styled-components';
import { MantineProvider, createTheme } from '@mantine/core';
import baseTheme from '@styles/theme';
import { DebugProvider, useDebug } from './DebugContext';
import AppRoutes from './routes';

// Create Mantine theme with CSS modules
const mantineTheme = createTheme({
  primaryColor: 'blue',
  defaultRadius: 'md',
});

function ThemedApp() {
  const { debugOutline } = useDebug();
  const theme = useMemo(() => ({ ...baseTheme, debugOutline }), [debugOutline]);
  return (
    <ThemeProvider theme={theme}>
      <MantineProvider theme={mantineTheme} defaultColorScheme="light">
        <AppRoutes />
      </MantineProvider>
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
