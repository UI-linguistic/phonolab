// // src/components/ui/HeroSection.tsx
// import styled from 'styled-components';

// export const Hero = styled.section<{ full?: boolean }>`
//   min-height: ${({ full, theme }) =>
//     full
//       ? `calc(100vh - ${theme.layout.headerHeight} - ${theme.layout.footerHeight})`
//       : 'auto'};
//   display: flex;
//   align-items: flex-start;
//   justify-content: center;
//   padding-top: ${({ theme }) => theme.spacing.xlarge};

//   @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
//     padding-top: ${({ theme }) => theme.spacing.large};
//   }
// `;

// export const HeroContent = styled.div`
//   display: flex;
//   width: 100%;
//   gap: 4vw;

//   @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
//     flex-direction: column;
//     gap: ${({ theme }) => theme.spacing.large};
//   }
// `;

// export const HeroColumn = styled.div<{ flex?: number }>`
//   flex: ${({ flex }) => flex ?? 1};

//   min-width: ${({ flex }) => ((flex ?? 1) > 1 ? '350px' : '320px')};
//   max-width: ${({ flex }) => ((flex ?? 1) > 1 ? '500px' : 'none')};

//   display: flex;
//   flex-direction: column;
//   gap: ${({ theme }) => theme.spacing.medium};
// `;
/* File: src/components/layout/HeroSection.tsx */
import React from 'react';
import styled from 'styled-components';
import {
  TitleContainer,
  SubtitleContainer,
  PageTitle,
  PageSubtitle
} from '../typography/PageTypography';
import HomeIllustration from '@assets/images/home_brain-mouth.png'
import theme from '@styles/theme';

// ────────────────────────────────────────────────────────────
// Hero Section Wrapper (Grid)
// ────────────────────────────────────────────────────────────
const HeroSection = styled.section`
  outline: 2px dashed rgba(255, 87, 34, 0.6); /* debug outline */
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  align-items: center;
  column-gap: ${({ theme }) => theme.spacing.xlarge};
  padding: ${({ theme }) => theme.spacing.large} 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    row-gap: ${({ theme }) => theme.spacing.large};
  }
`;

// ────────────────────────────────────────────────────────────
// Text Column Container
// ────────────────────────────────────────────────────────────
const TextColumn = styled.div`
  outline: 2px dashed rgba(76, 175, 80, 0.6); /* debug outline */
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.medium};
  position: relative;
`;

// ────────────────────────────────────────────────────────────
// Button Group Container
// ────────────────────────────────────────────────────────────
const ButtonGroupContainer = styled.div`
  outline: 2px dashed rgba(255, 193, 7, 0.6); /* debug outline */
  display: flex;
  gap: ${({ theme }) => theme.spacing.medium};
  flex-wrap: wrap;
`;

// ────────────────────────────────────────────────────────────
// Hero Buttons
// ────────────────────────────────────────────────────────────
const HeroButton = styled.button<{ variant?: 'solid' | 'outline' }>`
  font-size: ${({ theme }) => theme.fontSizes.md};
  padding: ${({ theme }) => theme.spacing.small} ${({ theme }) => theme.spacing.large};
  border-radius: ${({ theme }) => theme.borderRadius};
  border: ${({ variant, theme }) =>
    variant === 'outline' ? `2px solid ${theme.colors.secondary}` : 'none'};
  background: ${({ variant, theme }) =>
    variant === 'outline' ? 'transparent' : theme.colors.secondary};
  color: ${({ variant, theme }) =>
    variant === 'outline' ? theme.colors.text : theme.colors.white};
  cursor: pointer;
  transition: transform ${({ theme }) => theme.transitions.default};

  &:hover {
    transform: scale(1.05);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: ${({ theme }) => theme.fontSizes.sm};
    padding: ${({ theme }) => theme.spacing.xsmall};
  }
`;

// ────────────────────────────────────────────────────────────
// Media Column Container
// ────────────────────────────────────────────────────────────
const MediaColumn = styled.div`
  outline: 2px dashed rgba(255, 87, 34, 0.6); /* debug outline */
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;

  img {
    max-width: 100%;
    height: auto;
    display: block;
  }
`;

// ────────────────────────────────────────────────────────────
// Hero Component
// ────────────────────────────────────────────────────────────
export default function Hero() {
  return (
    <HeroSection>
      <TextColumn>
        <TitleContainer marginLeft={theme.spacing.small}>
          <PageTitle>Start Your Vowel Journey</PageTitle>
        </TitleContainer>

        <SubtitleContainer marginLeft={theme.spacing.medium}>
          <PageSubtitle>
            Your brain knows English.<br />
            Let’s get your mouth on board.
          </PageSubtitle>
        </SubtitleContainer>

        <ButtonGroupContainer>
          <HeroButton variant="solid">Decode Vowel Sounds</HeroButton>
          <HeroButton variant="outline">Challenge Yourself</HeroButton>
        </ButtonGroupContainer>
      </TextColumn>

      <MediaColumn>
        <img
          src={HomeIllustration}
          alt="Brain and mouth handshake illustration"
        />
      </MediaColumn>
    </HeroSection>
  );
}