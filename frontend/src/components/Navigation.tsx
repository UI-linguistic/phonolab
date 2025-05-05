import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';

const Nav = styled.nav`
  background-color: #107E7D; /* Burgundy */
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  border-bottom: 3px solid #1A1A1A;
`;

const Logo = styled(Link)`
  font-size: 1.8rem;
  font-weight: 600;
  color: white;
  margin: 0;
  
  &::after {
    content: "™";
    font-size: 0.8rem;
    vertical-align: super;
    margin-left: 2px;
  }
`;

const NavLinks = styled.div`
  margin-left: 3rem;
  display: flex;
  gap: 2rem;
`;

const NavLink = styled(Link)<{ $isActive?: boolean }>`
  color: white;
  font-size: 1.2rem;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

const Navigation: React.FC = () => {
  const location = useLocation();
  
  return (
    <Nav>
      <Logo to="/">Hooked on Phonetics</Logo>
      <NavLinks>
        <NavLink to="/learn" $isActive={location.pathname.startsWith('/learn')}>Learn</NavLink>
        <NavLink to="/quiz" $isActive={location.pathname.startsWith('/quiz')}>Quiz</NavLink>
      </NavLinks>
    </Nav>
  );
};

export default Navigation; 