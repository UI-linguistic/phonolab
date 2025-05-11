// src/components/layout/Navbar.tsx
import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import styled from 'styled-components';
import { useDebug } from '../../DebugContext';

// ════════════════════════
// Outer Nav Container (Flex for page-level)
// ════════════════════════
const Nav = styled.nav`
  outline: ${({ theme }) => theme.debugOutline ? `2px dashed ${theme.colors.secondary}` : 'none'};
  position: fixed;
  top: 0; left: 0; right: 0;
  height: ${({ theme }) => theme.layout.headerHeight};
  background: ${({ theme }) => theme.colors.primary};
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  z-index: ${({ theme }) => theme.layers.dropdown};
  display: flex;
`;

// ════════════════════════
// Inner Nav Layout (CSS Grid for 2D placement)
// Columns: [Logo] [Menu expands] [empty for alignment]
// ════════════════════════
const NavInner = styled.div`
  outline: ${({ theme }) => theme.debugOutline ? `2px dashed ${theme.colors.secondary}` : 'none'};
  width: 100%;
  max-width: min(1200px, 85ch);
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.large};

  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  column-gap: ${({ theme }) => theme.spacing.large};

  /* Mobile: collapse into two columns, wrap items */
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: auto auto;
    row-gap: ${({ theme }) => theme.spacing.small};
    padding: ${({ theme }) => theme.spacing.small};
  }
`;

// ════════════════════════
// Logo Link
// ════════════════════════
const Logo = styled(Link)`
  outline: ${({ theme }) => theme.debugOutline ? `2px dashed ${theme.colors.secondary}` : 'none'};
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: clamp(1.6rem, 4vw, 2rem);
  color: ${({ theme }) => theme.colors.white};
  text-decoration: none;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: ${({ theme }) => theme.fontSizes.lg};
  }
`;

// ════════════════════════
// Menu Links Container
// ════════════════════════
const Menu = styled.div`
  outline: ${({ theme }) => theme.debugOutline ? `2px dashed ${theme.colors.secondary}` : 'none'};
  display: flex;
  gap: ${({ theme }) => theme.spacing.large};

  /* Tablet: reduce gap and wrap if needed */
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    gap: ${({ theme }) => theme.spacing.medium};
    flex-wrap: wrap;
    justify-content: center;
  }
`;

// ════════════════════════
// Individual NavLink
// ════════════════════════
const MenuItem = styled(NavLink)`
  outline: ${({ theme }) => theme.debugOutline ? `1px dashed ${theme.colors.secondary}` : 'none'};
  font-family: ${({ theme }) => theme.fonts.main};
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.white};
  text-decoration: none;
  padding: ${({ theme }) => theme.spacing.xsmall} ${({ theme }) => theme.spacing.small};
  border-radius: ${({ theme }) => theme.borderRadius};
  transition: background-color ${({ theme }) => theme.transitions.default},color ${({ theme }) => theme.transitions.default};

  &.active {
    background-color: ${({ theme }) => theme.colors.white};
    color: ${({ theme }) => theme.colors.primary};
  }
  &:hover { background-color: ${({ theme }) => theme.colors.white}22; }

  /* Tablet: smaller text and padding */
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: ${({ theme }) => theme.fontSizes.sm};
    padding: ${({ theme }) => theme.spacing.xsmall};
  }
`;

export default function Navbar() {
  const { debugOutline, setDebugOutline } = useDebug();

  return (
    <Nav>
      <NavInner>
        <Logo to="/">Hooked on Phonetics™</Logo>
        <Menu>
          <MenuItem to="/learn">Learn</MenuItem>
          <MenuItem to="/quiz">Quiz</MenuItem>
        </Menu>
        {/* empty placeholder for grid alignment */}
        <div />
      </NavInner>
    </Nav>
  );
}