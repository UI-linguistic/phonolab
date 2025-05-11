// src/components/layout/Footer.tsx
import React from 'react';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  /* Outline for debugging */
  outline: ${({ theme }) => theme.debugOutline ? `2px dashed rgba(33, 150, 243, 0.6)` : 'none'};

  /* Height & background */
  height: ${({ theme }) => theme.layout.footerHeight};
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};

  /* Flex center */
  display: flex;
  align-items: center;
  justify-content: center;

  /* Typography */
  font-family: ${({ theme }) => theme.fonts.inter};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  line-height: ${({ theme }) => theme.lineHeights.sm};

  /* Responsive adjustments */
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    height: calc(${({ theme }) => theme.layout.footerHeight} * 0.75);
    font-size: ${({ theme }) => theme.fontSizes.xs};
    line-height: ${({ theme }) => theme.lineHeights.xs};
  }
`;

export default function Footer() {
  return (
    <FooterContainer>
      © {new Date().getFullYear()} Hooked on Phonetics™
    </FooterContainer>
  );
}
