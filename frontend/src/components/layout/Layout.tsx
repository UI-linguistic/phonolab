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
  padding-top: 64px;
  position: relative;
  flex: 1;                           /* push footer to bottom */
  width: 100%;
  margin: 0 auto;
  overflow: hidden;
  padding-left: ${({ theme }) => theme.spacing.xlarge};
  padding-right: ${({ theme }) => theme.spacing.xlarge};
  padding-bottom: ${({ theme }) => theme.spacing.medium};
  box-sizing: border-box;
  grid-template-rows: auto auto auto auto calc(1fr - 2rem);


  outline: 2px dashed rgba(207, 48, 42, 0.6);
`;

// const Spacing = styled.

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
