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
 *    {/* ... /}
 *  </Route>
 *
 *  // to make a page full‑bleed:
 *  function FullWidthPage() {
 *    return (
 *      <Container fluid>
 *        <MyFullWidthContent />
 *      </Container>
 *    );
 *  }
 */

import { Outlet } from 'react-router-dom';
import styled, { DefaultTheme } from 'styled-components';
import Navbar from './Navbar';
import Footer from './Footer';


interface ContainerProps {
  fluid?: boolean;
}


const Page = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.background};
`;

const Main = styled.main`
  flex: 1;
  /* push content below navbar plus extra gutter */
  padding-top: calc(
    ${({ theme }) => theme.layout.headerHeight} + 
    ${({ theme }) => theme.spacing.large}
  );
`;

const Container = styled.div<ContainerProps>`
  width: 100%;
  ${({ fluid, theme }: ContainerProps & { theme: DefaultTheme }) =>
    fluid
      ? ``
      : `max-width: ${theme.layout.maxContentWidth};`}

  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.layout.gutter};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 0 ${({ theme }) => theme.spacing.medium};
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 0 ${({ theme }) => theme.spacing.small};
  }
`;

export default function Layout() {
  return (
    <Page>
      <Navbar />
      <Main>
        <Container>
          <Outlet />
        </Container>
      </Main>
      <Footer />
    </Page>
  );
}

export { Container };