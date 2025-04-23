import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';

const Nav = styled.nav`
  background-color: ${({ theme }) => theme.colors.primary};
  padding: ${({ theme }) => theme.spacing.medium};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xlarge};
`;

const Logo = styled(Link)`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  white-space: nowrap;
  
  &:hover {
    text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.large};
`;

const NavLink = styled(Link)<{ $isActive?: boolean }>`
  color: white;
  font-weight: ${({ $isActive }) => $isActive ? '600' : '400'};
  transition: ${({ theme }) => theme.transitions.default};
  padding: ${({ theme }) => theme.spacing.small} ${({ theme }) => theme.spacing.medium};
  position: relative;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: 0.9rem;
  
  &::before {
    content: '';
    position: absolute;
    width: ${({ $isActive }) => $isActive ? '100%' : '0'};
    height: 2px;
    bottom: 0;
    left: 0;
    background-color: white;
    transition: all 0.3s ease-in-out;
    transform-origin: left;
  }

  &::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.1);
    left: 0;
    top: 0;
    border-radius: ${({ theme }) => theme.borderRadius};
    transform: scaleY(0);
    transition: transform 0.3s ease;
  }
  
  &:hover {
    opacity: 1;
    transform: translateY(-1px);
    
    &::before {
      width: 100%;
    }
    
    &::after {
      transform: scaleY(1);
    }
  }

  &:active {
    transform: translateY(1px);
  }
`;

const Navigation: React.FC = () => {
  const location = useLocation();
  
  return (
    <Nav>
      <Logo to="/">Hooked on Phonetics™</Logo>
      <NavLinks>
        <NavLink to="/" $isActive={location.pathname === '/'}>Home</NavLink>
        <NavLink to="/learn" $isActive={location.pathname.startsWith('/learn')}>Learn</NavLink>
        <NavLink to="/quiz" $isActive={location.pathname.startsWith('/quiz')}>Quiz</NavLink>
      </NavLinks>
    </Nav>
  );
};

export default Navigation; 