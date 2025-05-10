// File: src/components/ui/IllustrationWrappers.tsx
import React from 'react';
import styled, { css } from 'styled-components';
import HomeIllustration from '@assets/images/home_brain-mouth.png';
import LearnIllustration from '@assets/images/learn_brain-mouth.png';
import QuizIllustration from '@assets/images/quiz_brain-mouth.png';
import FeedbackBadIllustration from '@assets/images/learn_brain-mouth.png';
import FeedbackGoodIllustration from '@assets/images/quiz_feedback_good.png';

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
  small: { dimension: '200px' },
  medium: { dimension: '350px' },
  large: { dimension: '500px' },
};

// ---------------------------
// Styled wrapper
// ---------------------------
const Wrapper = styled.div<{ variant: IllustrationVariant; size: IllustrationSize }>`
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    width: ${({ size }) => sizeTokens[size].dimension};
    height: auto;
    display: block;

    ${({ variant, theme }) =>
    variant === 'circle' && css`
        border-radius: 50%;
        background: ${theme.colors.circleBg};
        border: 2px solid ${theme.colors.black};
        padding: ${theme.spacing.small};
      `}
  }
`;

/**
 * Generic Illustration component
 *
 * Props:
 * - src, alt
 * - variant: 'circle' for circled image, 'plain' for no wrapper
 * - size: 'small' | 'medium' | 'large'
 */
export const Illustration: React.FC<IllustrationProps> = ({
  src,
  alt,
  variant = 'plain',
  size = 'medium',
}) => {
  return (
    <Wrapper variant={variant} size={size}>
      <img src={src} alt={alt} />
    </Wrapper>
  );
};



// ---------------------------
// Named presets for pages
// ---------------------------

/**
 * Home page hero illustration (large, no circle)
 */
export const HomePageIllustration: React.FC = () => (
  <Illustration
    src={HomeIllustration}
    alt="Brain and mouth handshake illustration"
    variant="plain"
    size="large"
  />
);

/**
 * Learn menu illustration (medium, circle)
 */
export const LearnMenuIllustration: React.FC = () => (
  <Illustration
    src={LearnIllustration}
    alt="Brain and mouth learning illustration"
    variant="circle"
    size="medium"
  />
);

/**
 * Quiz menu illustration (medium, circle)
 */
export const QuizMenuIllustration: React.FC = () => (
  <Illustration
    src={QuizIllustration}
    alt="Brain and mouth quiz illustration"
    variant="circle"
    size="medium"
  />
);

/**
 * Quiz feedback bad score (large, plain)
 */
export const QuizFeedbackBad: React.FC = () => (
  <Illustration
    src={FeedbackBadIllustration}
    alt="Brain with dunce cap illustration"
    variant="plain"
    size="large"
  />
);

/**
 * Quiz feedback good score (large, plain)
 */
export const QuizFeedbackGood: React.FC = () => (
  <Illustration
    src={FeedbackGoodIllustration}
    alt="Celebrating brain and mouth illustration"
    variant="plain"
    size="large"
  />
);
