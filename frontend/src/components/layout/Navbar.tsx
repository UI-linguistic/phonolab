// src/components/layout/Navbar.tsx
// import {
//   Box,
//   Container,
//   Group,
//   Button,
//   Burger,
//   rem,
//   useMantineTheme,
// } from '@mantine/core';
import { Box, Container, Group, Stack, Button, Burger, rem, useMantineTheme } from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { NavLink, Link } from 'react-router-dom';
import { useDebug } from '../../DebugContext';

export default function AppNavbar() {
  const theme = useMantineTheme();
  const [opened, { toggle }] = useDisclosure(false);
  const { debugOutline, setDebugOutline } = useDebug();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

  // pull SC‑tokens out of theme.other
  const { fontWeights, fonts, spacingTokens, layout } = theme.other!;

  const linkBase = {
    color: theme.white,
    textDecoration: 'none',
    fontWeight: fontWeights.medium,
    padding: `${spacingTokens.small} ${spacingTokens.medium}`,
    borderRadius: rem(theme.radius.sm),
  };
  const linkActive = {
    ...linkBase,
    backgroundColor: theme.white,
    color: theme.colors.primary[6],
    fontWeight: fontWeights.bold,
  };

  return (
    <Box
      component="header"
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        backgroundColor: theme.colors.primary[6],
        borderBottom: `${rem('1.5px')} solid ${theme.colors.primary[8]}`,
        boxShadow: theme.shadows.md,
        zIndex: 1000,
      }}
    >
      <Container
        size="lg"
        px="md"
        style={{
          height: rem(layout.headerHeight),
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {/* Logo */}
        <Link
          to="/"
          style={{
            fontFamily: theme.headings.fontFamily,
            fontSize: rem(theme.headings.sizes.h1.fontSize + 'px'),
            fontWeight: theme.headings.sizes.h1.fontWeight,
            color: theme.white,
            textDecoration: 'none',
            letterSpacing: rem('1px'),
          }}
        >
          Hooked on Phonetics™
        </Link>

        <Group style={{ marginLeft: 'auto' }} />

        {/* Desktop nav */}
        {!isMobile && (
          <Group>
            {['learn', 'quiz'].map((route) => (
              <NavLink
                key={route}
                to={`/${route}`}
                style={({ isActive }) =>
                  isActive ? linkActive : linkBase
                }
              >
                {route.charAt(0).toUpperCase() + route.slice(1)}
              </NavLink>
            ))}

            {process.env.NODE_ENV === 'development' && (
              <Button
                size="xs"
                variant={debugOutline ? 'filled' : 'outline'}
                color={debugOutline ? 'yellow' : 'gray'}
                onClick={() => setDebugOutline(!debugOutline)}
                style={{ fontWeight: fontWeights.bold }}
              >
                {debugOutline ? 'Hide Outlines' : 'Show Outlines'}
              </Button>
            )}
          </Group>
        )}

        {/* Burger (mobile) */}
        {isMobile && (
          <Burger
            opened={opened}
            onClick={toggle}
            color={theme.white}
            size="sm"
            aria-label="Toggle navigation"
          />
        )}
      </Container>

      {/* Mobile menu */}
      {isMobile && opened && (
        <Box
          style={{
            backgroundColor: theme.colors.primary[6],
            boxShadow: theme.shadows.sm,
            padding: spacingTokens.medium,
          }}
        >
          <Stack style={{ gap: spacingTokens.small }}>
            {['learn', 'quiz'].map((route) => (
              <NavLink
                key={route}
                to={`/${route}`}
                onClick={toggle}
                style={({ isActive }) =>
                  isActive ? linkActive : linkBase
                }
              >
                {route.charAt(0).toUpperCase() + route.slice(1)}
              </NavLink>
            ))}
            {process.env.NODE_ENV === 'development' && (
              <Button
                size="xs"
                variant={debugOutline ? 'filled' : 'outline'}
                color={debugOutline ? 'yellow' : 'gray'}
                onClick={() => setDebugOutline(!debugOutline)}
                style={{ fontWeight: fontWeights.bold }}
              >
                {debugOutline ? 'Hide Outlines' : 'Show Outlines'}
              </Button>
            )}
          </Stack>
        </Box>
      )}
    </Box>
  );
}
