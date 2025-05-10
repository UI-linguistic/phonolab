// src/components/layout/Footer.tsx
import React from 'react';
import styled from 'styled-components';

// Footer Bar (Flex)
const FooterContainer = styled.footer`
  outline: 2px dashed rgba(33, 150, 243, 0.6); /* debug */
  height: ${({ theme }) => theme.layout.footerHeight};
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: ${({ theme }) => theme.fonts.main};
  font-size: ${({ theme }) => theme.fontSizes.sm};

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    height: calc(${({ theme }) => theme.layout.footerHeight} * 0.75);
    font-size: ${({ theme }) => theme.fontSizes.xs};
  }
`;

export default function Footer() {
    return <FooterContainer>© {new Date().getFullYear()} Hooked on Phonetics™</FooterContainer>;
}