/**
 * Layout.tsx
 *
 * Defines the overall page scaffolding including:
 *  - A fixed Navbar at the top
 *  - A Main content area that sits below the navbar and above the footer
 *  - An optional fluid or constrained Container for centering page content
 *  - A sticky Footer at the bottom
 *
 * Components:
 *
 * 1. <Page>
 *    – Top‑level flex column that spans the full viewport height (`min-height: 100vh`)
 *    – Sets the background color from `theme.colors.background`
 *
 * 2. <Navbar />
 *    – Imported navigation bar, rendered fixed at the top via its own CSS
 *
 * 3. <Main>
 *    – Flex‑1 container that grows/shrinks to fill available vertical space
 *    – `padding-top` calculated as `headerHeight + spacing.medium` so all content
 *      sits below the fixed navbar with a small gutter
 *
 * 4. <Container fluid?: boolean>
 *    – Wraps page content (`<Outlet />` from react‑router)
 *    – When `fluid` is **false** (default), applies:
 *        • `max-width: theme.layout.maxContentWidth` (e.g. `85ch`)
 *        • `margin: 0 auto` to center horizontally
 *    – Always applies horizontal padding (`theme.layout.gutter` on desktop,
 *      `theme.spacing.medium` on tablet, `theme.spacing.small` on mobile)
 *    – When `fluid` is **true**, content spans full width (no max‑width)
 *
 * 5. <Footer />
 *    – Imported footer, sticks to the bottom of the page because `<Main>` flex‑1
 *
 * Theme dependencies:
 *  • theme.colors.background    — page background
 *  • theme.layout.headerHeight  — navbar height
 *  • theme.layout.gutter        — desktop horizontal padding
 *  • theme.layout.maxContentWidth — content line‑length cap
 *  • theme.spacing.medium/small — responsive padding adjustments
 *  • theme.breakpoints.tablet/mobile — responsive breakpoints
 *
 * Usage:
 *  // in App.tsx or your routes
 *  <Route path="/" element={<Layout />}>
 *    <Route index element={<HomePage />} />
 *    <Route path="learn" element={<LearnMenu />} />
 *    {/* ... 
 *  </Route >
 *
 *  // to make a page full‑bleed:
 * function FullWidthPage() {
 *    return (
 * <Container fluid>
        *        <MyFullWidthContent />
        *      </Container>
      *    );
 *  }
  */

import { Outlet } from 'react-router-dom';
import styled, { DefaultTheme, useTheme } from 'styled-components';
import Header from './Header';
import Footer from './Footer';

// Debug label component to show component names when debugging
const DebugLabel = styled.div<{ enabled: boolean; position: string }>`
  display: ${({ enabled }) => (enabled ? 'block' : 'none')};
  position: absolute;
  ${({ position }) => {
    switch (position) {
      case 'top-right':
        return 'top: 0; right: 0;';
      case 'bottom-left':
        return 'bottom: 0; left: 0;';
      case 'bottom-right':
        return 'bottom: 0; right: 0;';
      case 'top-left':
      default:
        return 'top: 0; left: 0;';
    }
  }}
  font-size: ${({ theme }) => theme.debug?.labels?.fontSize || '10px'};
  background: ${({ theme }) => theme.debug?.labels?.background || 'rgba(0, 0, 0, 0.7)'};
  color: ${({ theme }) => theme.debug?.labels?.color || 'white'};
  padding: ${({ theme }) => theme.debug?.labels?.padding || '2px 4px'};
  border-radius: ${({ theme }) => theme.debug?.labels?.borderRadius || '2px'};
  z-index: ${({ theme }) => theme.debug?.zIndex || 9999};
  pointer-events: none;
`;

interface ContainerProps {
  fluid?: boolean;
}

const Page = styled.div`
  /* Debug outline */
  outline: ${({ theme }) =>
    theme.debug?.enabled
      ? theme.debug.outlines.container
      : 'none'
  };
  position: relative; /* For debug label positioning */
  
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.background};
`;

const SkipLink = styled.a`
  position: absolute;
  top: -40px;
  left: 0;
  padding: 8px;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  z-index: 100;
  transition: top 0.2s;
  
  &:focus {
    top: 0;
  }
`;

const Main = styled.main`
  /* Debug outline */
  outline: ${({ theme }) =>
    theme.debug?.enabled
      ? theme.debug.outlines.component
      : 'none'
  };
  position: relative; /* For debug label positioning */
  
  flex: 1;
  /* push content below navbar plus extra gutter */
  padding-top: calc(70px + ${({ theme }) => theme.spacing.large});
`;

const Container = styled.div<ContainerProps>`
  /* Debug outline */
  outline: ${({ theme }) =>
    theme.debug?.enabled
      ? theme.debug.outlines.grid
      : 'none'
  };
  position: relative; /* For debug label positioning */
  
  width: 100%;
  padding: 0 ${({ theme }) => theme.spacing.small};
  padding-left: max(${({ theme }) => theme.spacing.small}, env(safe-area-inset-left));
  padding-right: max(${({ theme }) => theme.spacing.small}, env(safe-area-inset-right));
  
  /* Mobile-first approach - start with mobile styles and scale up */
  ${({ fluid, theme }: ContainerProps & { theme: DefaultTheme }) =>
    !fluid && `max-width: ${theme.layout.maxWidth.large}; margin: 0 auto;`}
  
  /* Tablet breakpoint */
  @media (min-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 0 ${({ theme }) => theme.spacing.medium};
  }
  
  /* Desktop breakpoint */
  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 0 ${({ theme }) => theme.layout.containerPadding.desktop};
  }
`;

// Export the Container component so it can be used elsewhere
export const LayoutContainer = Container;

export default function Layout() {
  const theme = useTheme();
  const debugEnabled = theme.debug?.enabled && theme.debug?.labels?.enabled;
  const labelPosition = theme.debug?.labels?.position || 'top-left';

  return (
    <Page>
      {debugEnabled && (
        <DebugLabel enabled={debugEnabled} position={labelPosition}>
          Page
        </DebugLabel>
      )}

      <SkipLink href="#main-content">Skip to content</SkipLink>
      <Header />

      <Main id="main-content" role="main">
        {debugEnabled && (
          <DebugLabel enabled={debugEnabled} position={labelPosition}>
            Main
          </DebugLabel>
        )}

        <Container>
          {debugEnabled && (
            <DebugLabel enabled={debugEnabled} position={labelPosition}>
              Container
            </DebugLabel>
          )}
          <Outlet />
        </Container>
      </Main>

      <Footer />
    </Page>
  );
}
