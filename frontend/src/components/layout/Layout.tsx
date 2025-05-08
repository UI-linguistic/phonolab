// src/components/layout/Layout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import Navbar from './Navbar';
import Footer from './Footer';

const Page = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.background};
`;

const Main = styled.main`
  flex: 1;                           /* push footer to bottom */
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xlarge};
`;

export default function Layout() {
    return (
        <Page>
            <Navbar />
            <Main>
                <Outlet />
            </Main>
            <Footer />
        </Page>
    );
}
