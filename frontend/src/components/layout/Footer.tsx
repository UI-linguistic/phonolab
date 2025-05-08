// src/components/layout/Footer.tsx
import React from 'react';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  height: 48px;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: ${({ theme }) => theme.fonts.main};
  font-size: 0.875rem;
`;

export default function Footer() {
    return (
        <FooterContainer>
            © {new Date().getFullYear()} Hooked on Phonetics™
        </FooterContainer>
    );
}
