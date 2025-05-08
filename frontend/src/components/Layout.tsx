// src/components/Layout.tsx
// src/components/Layout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import GlobalStyle from '../styles/GlobalStyle';
import Navigation from './Navigation';

const Layout: React.FC = () => (
  <>
    {/* Apply your global resets, fonts, and theme here */}
    <GlobalStyle />

    <PageWrapper>
      {/* Your existing nav, unchanged */}
      <Navigation />

      {/* Main content area for all pages */}
      <Content>
        <Outlet />
      </Content>

      {/* footer */}
      <Footer>© 2025 Hooked on Phonetics™</Footer>
    </PageWrapper>
  </>
);

export default Layout;

// ===== Styled components =====
const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.background};
`;

const Content = styled.main`
  flex: 1;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.medium};
`;

const Footer = styled.footer`
  padding: ${({ theme }) => theme.spacing.small};
  text-align: center;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.text};
`;
