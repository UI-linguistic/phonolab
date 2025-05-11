// src/components/ui/IllustrationWrappers.tsx
import React from 'react';
import styled, { css, DefaultTheme } from 'styled-components';
import HomeIllustration from '../../assets/images/home_brain-mouth.png';
import LearnIllustration from '../../assets/images/learn_brain-mouth.png';
import QuizIllustration from '../../assets/images/quiz_brain-mouth.png';
import FeedbackBadIllustration from '../../assets/images/quiz_feedback_bad.png';
import FeedbackGoodIllustration from '../../assets/images/quiz_feedback_good.png';

export type IllustrationVariant = 'circle' | 'plain';
export type IllustrationSize = 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';

interface IllustrationProps {
  src: string;
  alt: string;
  variant?: IllustrationVariant;
  size?: IllustrationSize;
}

/**
 * Map IllustrationSize → CSS dimension using theme tokens
 */
const sizeTokens: Record<IllustrationSize, (theme: DefaultTheme) => string> = {
  xsmall: theme => theme.mediaSizes.xsmall,
  small: theme => theme.mediaSizes.small,
  medium: theme => theme.mediaSizes.medium,
  large: theme => theme.mediaSizes.large,
  xlarge: theme => theme.mediaSizes.xlarge,
};

const Wrapper = styled.div<{ variant: IllustrationVariant; size: IllustrationSize }>`
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;

  /* fixed diameter from theme tokens */
  width: ${({ theme, size }) => sizeTokens[size](theme)};
  height: ${({ theme, size }) => sizeTokens[size](theme)};

  ${({ variant, theme }) =>
    variant === 'circle'
      ? css`
          border-radius: 50%;
          background: ${theme.colors.circleBg}33;
          border: ${theme.borderWidths.default} solid ${theme.colors.black};
          padding: ${theme.spacing.small};
        `
      : ''}

  img {
    max-width: 90%;
    max-height: 90%;
    display: block;
  }

  /* responsive fallback for small screens */
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    width: ${({ theme, size }) => sizeTokens[size](theme)};
    height: ${({ theme, size }) => sizeTokens[size](theme)};
  }
`;

export const Illustration: React.FC<IllustrationProps> = ({
  src,
  alt,
  variant = 'plain',
  size = 'small',
}) => (
  <Wrapper variant={variant} size={size}>
    <img src={src} alt={alt} />
  </Wrapper>
);

export const HomePageIllustration: React.FC = () => (
  <Illustration
    src={HomeIllustration}
    alt="Brain and mouth handshake illustration"
    variant="plain"
    size="small"
  />
);

export const LearnMenuIllustration: React.FC = () => (
  <Illustration
    src={LearnIllustration}
    alt="Brain and mouth learning illustration"
    variant="circle"
    size="small"
  />
);

export const QuizMenuIllustration: React.FC = () => (
  <Illustration
    src={QuizIllustration}
    alt="Brain and mouth quiz illustration"
    variant="circle"
    size="small"
  />
);

export const QuizFeedbackBad: React.FC = () => (
  <Illustration
    src={FeedbackBadIllustration}
    alt="Brain with dunce cap illustration"
    variant="plain"
    size="small"
  />
);

export const QuizFeedbackGood: React.FC = () => (
  <Illustration
    src={FeedbackGoodIllustration}
    alt="Celebrating brain and mouth illustration"
    variant="plain"
    size="small"
  />
);
