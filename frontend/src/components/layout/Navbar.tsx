// src/components/layout/Navbar.tsx
import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import styled from 'styled-components';

const Nav = styled.nav`
  height: 64px;
  background: ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  padding: 0 ${({ theme }) => theme.spacing.large};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 10;
`;

const Logo = styled(Link)`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 1.5rem;
  color: white;
  text-decoration: none;
`;

const Menu = styled.div`
  margin-left: auto;
  display: flex;
  gap: ${({ theme }) => theme.spacing.medium};
`;

const MenuItem = styled(NavLink)`
  color: white;
  font-family: ${({ theme }) => theme.fonts.main};
  font-size: 1rem;
  text-decoration: none;
  &.active {
    text-decoration: underline;
  }
`;

export default function Navbar() {
    return (
        <Nav>
            <Logo to="/">Hooked on Phonetics™</Logo>
            <Menu>
                <MenuItem to="/learn">Learn</MenuItem>
                <MenuItem to="/quiz">Quiz</MenuItem>
            </Menu>
        </Nav>
    );
}
