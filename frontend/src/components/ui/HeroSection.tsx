// src/components/ui/HeroSection.tsx
import styled from 'styled-components';

export const Hero = styled.section<{ full?: boolean }>`
  min-height: ${({ full, theme }) =>
    full
      ? `calc(100vh - ${theme.layout.headerHeight} - ${theme.layout.footerHeight})`
      : 'auto'};
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: ${({ theme }) => theme.spacing.xlarge};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding-top: ${({ theme }) => theme.spacing.large};
  }
`;

export const HeroContent = styled.div`
  display: flex;
  width: 100%;
  gap: 4vw;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.large};
  }
`;

export const HeroColumn = styled.div<{ flex?: number }>`
  flex: ${({ flex }) => flex ?? 1};
  
  min-width: ${({ flex }) => ((flex ?? 1) > 1 ? '350px' : '320px')};
  max-width: ${({ flex }) => ((flex ?? 1) > 1 ? '500px' : 'none')};

  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.medium};
`;
