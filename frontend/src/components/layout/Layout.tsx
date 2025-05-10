// src/components/layout/Layout.tsx
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
    ${({ theme }) => theme.spacing.medium}
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