// src/components/layout/Navbar.tsx
import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import styled from 'styled-components';

const Nav = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: ${({ theme }) => theme.layout.headerHeight};
  background: ${({ theme }) => theme.colors.primary};
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  z-index: 1000;
  display: flex;
`;

const NavInner = styled.div`
  width: 100%;
  padding: 0 ${({ theme }) => theme.spacing.large};
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

const Logo = styled(Link)`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 2rem;
  color: ${({ theme }) => theme.colors.white};
  text-decoration: none;
`;

const Spacer = styled.div`
  flex: 1;
`;

const Menu = styled.div`
  display: flex;
  margin-left: ${({ theme }) => theme.spacing.xlarge};
  gap: ${({ theme }) => theme.spacing.large};
`;

const MenuItem = styled(NavLink)`
  font-family: ${({ theme }) => theme.fonts.main};
  font-size: 1.6rem;
  color: ${({ theme }) => theme.colors.white};
  text-decoration: none;
  padding: ${({ theme }) => theme.spacing.xsmall} ${({ theme }) => theme.spacing.small};
  border-radius: ${({ theme }) => theme.borderRadius};
  transition: background-color ${({ theme }) => theme.transitions.default},
              color ${({ theme }) => theme.transitions.default};

  &.active {
    background-color: ${({ theme }) => theme.colors.white};
    color: ${({ theme }) => theme.colors.primary};
  }

  &:hover {
    background-color: ${({ theme }) => theme.colors.white}22;
  }
`;

export default function Navbar() {
  return (
    <Nav>
      <NavInner>
        <Logo to="/">Hooked on Phonetics™</Logo>
        <Menu>
          <MenuItem to="/learn">Learn</MenuItem>
          <MenuItem to="/quiz">Quiz</MenuItem>
        </Menu>
        <Spacer />
      </NavInner>
    </Nav>
  );
}
