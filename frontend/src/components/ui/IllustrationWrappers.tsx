/**
 * IllustrationWrappers.tsx
 *
 * Provides a flexible Illustration component and named presets for page graphics.
 *
 * Features:
 *  - Generic <Illustration> wrapper that:
 *     • Accepts any image src/alt
 *     • Supports two variants: "plain" (no extra styling) or "circle" (circular mask, background, border)
 *     • Uses three size tokens ("small"/"medium"/"large") to set fixed diameter, with responsive fallback (80vw max)
 *     • Constrains inner <img> to 90% of its container for neat padding
 *  - Named presets for common pages:
 *     • HomePageIllustration   – plain, medium
 *     • LearnMenuIllustration  – circle, medium
 *     • QuizMenuIllustration   – circle, medium
 *     • QuizFeedbackBad        – plain, large
 *     • QuizFeedbackGood       – plain, large
 *
 * Configuration:
 *  • sizeTokens: map IllustrationSize → dimension (px)
 *  • theme.breakpoints.tablet: switches wrapping behavior
 *  • theme.colors.circleBg: circle background color
 *  • theme.spacing.small: circle padding
 *
 * Usage:
 *  // generic
 *  <Illustration
 *    src="/assets/foo.png"
 *    alt="Description"
 *    variant="circle"
 *    size="small"
 *  />
 *
 *  // preset
 *  import { HomePageIllustration } from './IllustrationWrappers';
 *  <HomePageIllustration />
 */


import React from 'react';
import styled, { css, DefaultTheme } from 'styled-components';
import HomeIllustration from '../../assets/images/home_brain-mouth.png';
import LearnIllustration from '../../assets/images/learn_brain-mouth.png';
import QuizIllustration from '../../assets/images/quiz_brain-mouth.png';
import FeedbackBadIllustration from '../../assets/images/quiz_feedback_bad.png';
import FeedbackGoodIllustration from '../../assets/images/quiz_feedback_good.png';

// ---------------------------
// Generic Illustration Props
// ---------------------------
export type IllustrationVariant = 'circle' | 'plain';
export type IllustrationSize = 'small' | 'medium' | 'large';

interface IllustrationProps {
  src: string;
  alt: string;
  variant?: IllustrationVariant;
  size?: IllustrationSize;
}

// ---------------------------
// Size token map
// ---------------------------
const sizeTokens: Record<IllustrationSize, { dimension: string }> = {
  small: { dimension: '300px' },
  medium: { dimension: '600px' },
  large: { dimension: '800px' },
};

// ---------------------------
// Styled wrapper
// ---------------------------
const Wrapper = styled.div<{
  variant: IllustrationVariant;
  size: IllustrationSize;
  theme: DefaultTheme;
}>`
  display: flex;
  justify-content: center;
  align-items: center;

  /* fixed diameter, overridable by the size token */
  width: ${({ size }) => sizeTokens[size].dimension};
  height: ${({ size }) => sizeTokens[size].dimension};
  box-sizing: border-box;

  ${({ variant, theme }) =>
    variant === 'circle'
      ? css`
          border-radius: 50%;
          background: ${theme.colors.circleBg}33; /* 20% alpha */
          border: 2px solid ${theme.colors.black};
          padding: ${theme.spacing.small};
        `
      : ''}

  /* shrink on smaller viewports */
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    width: ${({ size }) =>
    `min(${sizeTokens[size].dimension}, 80vw)`};
    height: ${({ size }) =>
    `min(${sizeTokens[size].dimension}, 80vw)`};
  }

  img {
    /* let the image fill up to 90% of its container */
    max-width: 90%;
    max-height: 90%;
    display: block;
  }
`;

/**
 * Generic Illustration component
 *
 * - variant: 'circle' wraps in a circle, 'plain' is no extra styling
 * - size: determines wrapper diameter
 */
export const Illustration: React.FC<IllustrationProps> = ({
  src,
  alt,
  variant = 'plain',
  size = 'medium',
}) => (
  <Wrapper variant={variant} size={size}>
    <img src={src} alt={alt} />
  </Wrapper>
);

// ---------------------------
// Named presets for pages
// ---------------------------

export const HomePageIllustration: React.FC = () => (
  <Illustration
    src={HomeIllustration}
    alt="Brain and mouth handshake illustration"
    variant="plain"
    size="medium"
  />
);

export const LearnMenuIllustration: React.FC = () => (
  <Illustration
    src={LearnIllustration}
    alt="Brain and mouth learning illustration"
    variant="circle"
    size="medium"
  />
);

export const QuizMenuIllustration: React.FC = () => (
  <Illustration
    src={QuizIllustration}
    alt="Brain and mouth quiz illustration"
    variant="circle"
    size="medium"
  />
);

export const QuizFeedbackBad: React.FC = () => (
  <Illustration
    src={FeedbackBadIllustration}
    alt="Brain with dunce cap illustration"
    variant="plain"
    size="large"
  />
);

export const QuizFeedbackGood: React.FC = () => (
  <Illustration
    src={FeedbackGoodIllustration}
    alt="Celebrating brain and mouth illustration"
    variant="plain"
    size="large"
  />
);