import React, { useState, useEffect } from 'react';
import styled, { css, DefaultTheme, keyframes } from 'styled-components';
import HomeIllustration from '../../assets/images/home_brain-mouth.png';
import LearnIllustration from '../../assets/images/learn_brain-mouth.png';
import QuizIllustration from '../../assets/images/quiz_brain-mouth.png';
import FeedbackBadIllustration from '../../assets/images/quiz_feedback_bad.png';
import FeedbackGoodIllustration from '../../assets/images/quiz_feedback_good.png';

export type IllustrationVariant =
  | 'circle'       // Circular background with border
  | 'plain'        // No background or border
  | 'shadow'       // Drop shadow effect
  | 'glow'         // Glowing effect
  | 'bordered';    // Simple border without circular shape

export type IllustrationSize =
  | 'xsmall'
  | 'small'
  | 'medium'
  | 'large'
  | 'xlarge'
  | 'responsive'; // Automatically adjusts based on screen size

// Animation keyframes
const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const glow = keyframes`
  0% { box-shadow: 0 0 5px rgba(255, 215, 0, 0.6); }
  50% { box-shadow: 0 0 20px rgba(255, 215, 0, 0.8), 0 0 30px rgba(255, 165, 0, 0.6); }
  100% { box-shadow: 0 0 5px rgba(255, 215, 0, 0.6); }
`;

export type IllustrationAnimation =
  | 'none'
  | 'pulse'
  | 'float'
  | 'spin'
  | 'bounce'
  | 'shake';

export type AspectRatioType = 'square' | 'portrait' | 'landscape' | 'widescreen' | 'ultrawide';

interface IllustrationProps {
  src: string;
  alt: string;
  variant?: IllustrationVariant;
  size?: IllustrationSize;
  animation?: IllustrationAnimation;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
  interactive?: boolean;
  aspectRatio?: AspectRatioType;
  lazyLoad?: boolean;
}


/**
 * Map IllustrationSize → CSS dimension using existing theme tokens
 */
const sizeTokens: Record<Exclude<IllustrationSize, 'responsive'>, (theme: DefaultTheme) => string> = {
  xsmall: theme => theme.touchTargets.button.small,  // Use small button size
  small: theme => theme.touchTargets.button.medium,  // Use  medium button size
  medium: theme => theme.touchTargets.button.large,  // Use r large button size
  large: theme => `calc(${theme.touchTargets.button.large} * 1.5)`,  // 1.5x  large button
  xlarge: theme => `calc(${theme.touchTargets.button.large} * 2)`,   // 2x  large button
};


// Helper function to get animation styles
const getAnimationStyles = (animation: IllustrationAnimation) => {
  switch (animation) {
    case 'pulse':
      return css`animation: ${pulse} 2s ease-in-out infinite;`;
    case 'float':
      return css`animation: ${float} 3s ease-in-out infinite;`;
    case 'spin':
      return css`animation: ${spin} 10s linear infinite;`;
    case 'bounce':
      return css`
        animation: ${float} 1s ease-in-out infinite;
        animation-timing-function: cubic-bezier(0.28, 0.84, 0.42, 1);
      `;
    case 'shake':
      return css`
        animation: ${keyframes`
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        `} 0.8s ease-in-out;
        animation-iteration-count: 1;
        animation-delay: 0.5s;
      `;
    default:
      return '';
  }
};

// Helper function to get variant styles
const getVariantStyles = (variant: IllustrationVariant, theme: DefaultTheme) => {
  switch (variant) {
    case 'circle':
      return css`
        border-radius: 50%;
        background: ${theme.colors.circleBg}33;
        border: ${theme.borderWidths.default} solid ${theme.colors.black};
        padding: ${theme.spacing.small};
        transition: all 0.3s ease;
        
        &:hover {
          background: ${theme.colors.circleBg}66;
          transform: scale(1.05);
        }
      `;
    case 'shadow':
      return css`
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
        transition: all 0.3s ease;
        
        &:hover {
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
          transform: translateY(-5px);
        }
      `;
    case 'glow':
      return css`
        animation: ${glow} 3s ease-in-out infinite;
        border-radius: 10px;
        transition: all 0.3s ease;
        
        &:hover {
          animation-duration: 1.5s;
        }
      `;
    case 'bordered':
      return css`
        border: ${theme.borderWidths.default} solid ${theme.colors.black};
        border-radius: 10px;
        padding: ${theme.spacing.xsmall};
        transition: all 0.3s ease;
        
        &:hover {
          border-color: ${theme.colors.primary};
        }
      `;
    case 'plain':
    default:
      return css`
        transition: all 0.3s ease;
        
        &:hover {
          transform: scale(1.03);
        }
      `;
  }
};

const Wrapper = styled.div<{
  variant: IllustrationVariant;
  size: IllustrationSize;
  animation: IllustrationAnimation;
  interactive: boolean;
  aspectRatio?: AspectRatioType;
}>`
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
  
  /* Size based on theme tokens or responsive */
${({ theme, size, aspectRatio }) =>
    size !== 'responsive'
      ? css`
        width: ${sizeTokens[size](theme)};
        height: ${sizeTokens[size](theme)};
      `
      : css`
        width: 100%;
        height: auto;
        aspect-ratio: ${aspectRatio && aspectRatio in theme.aspectRatios
          ? theme.aspectRatios[aspectRatio as keyof typeof theme.aspectRatios]
          : theme.aspectRatios.square};
      `
  }

  
  /* Variant styling */
  ${({ variant, theme }) => getVariantStyles(variant, theme)}
  
  /* Animation styling */
  ${({ animation }) => getAnimationStyles(animation)}
  
  /* Interactive styling */
  ${({ interactive }) => interactive && css`
    cursor: pointer;
    
    &:active {
      transform: scale(0.98);
      transition: transform 0.1s ease;
    }
  `}
  
  img {
    max-width: 100%;
    max-height: 100%;
    display: block;
    object-fit: contain;
    transition: all 0.3s ease;
  }
  
  /* Responsive adjustments */
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    ${({ size, theme }) =>
    size !== 'responsive' && size !== 'xsmall' && size !== 'small'
      ? css`
            width: ${sizeTokens['small'](theme)};
            height: ${sizeTokens['small'](theme)};
          `
      : ''
  }
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    ${({ size, theme }) =>
    size !== 'responsive' && size !== 'xsmall'
      ? css`
            width: ${sizeTokens['xsmall'](theme)};
            height: ${sizeTokens['xsmall'](theme)};
          `
      : ''
  }
  }
`;

export const Illustration: React.FC<IllustrationProps> = ({
  src,
  alt,
  variant = 'plain',
  size = 'small',
  animation = 'none',
  onClick,
  className = '',
  style,
  interactive = !!onClick,
  aspectRatio = 'square',
  lazyLoad = true,
}) => {
  const [isLoaded, setIsLoaded] = useState(!lazyLoad);
  const [isError, setIsError] = useState(false);

  // Handle image loading
  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  // Handle image error
  const handleImageError = () => {
    setIsError(true);
  };

  // Trigger shake animation on click
  const [shakeKey, setShakeKey] = useState(0);
  const handleClick = () => {
    if (onClick) {
      onClick();
      if (animation === 'shake') {
        setShakeKey(prev => prev + 1);
      }
    }
  };

  return (
    <Wrapper
      variant={variant}
      size={size}
      animation={animation}
      interactive={interactive}
      onClick={handleClick}
      className={className}
      style={style}
      aspectRatio={aspectRatio}
      key={animation === 'shake' ? shakeKey : undefined}
    >
      {!isLoaded && !isError && (
        <div style={{
          width: '100%',
          height: '100%',
          background: '#f0f0f0',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          Loading...
        </div>
      )}

      {isError && (
        <div style={{
          width: '100%',
          height: '100%',
          background: '#ffeeee',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'red'
        }}>
          Error loading image
        </div>
      )}

      <img
        src={src}
        alt={alt}
        onLoad={handleImageLoad}
        onError={handleImageError}
        style={{ display: isLoaded && !isError ? 'block' : 'none' }}
        loading={lazyLoad ? "lazy" : "eager"}
      />
    </Wrapper>
  );
};

export const HomePageIllustration: React.FC<Omit<IllustrationProps, 'src' | 'alt'>> = (props) => (
  <Illustration
    src={HomeIllustration}
    alt="Brain and mouth handshake illustration"
    variant="glow"
    size="medium"
    animation="float"
    {...props}
  />
);

export const LearnMenuIllustration: React.FC<Omit<IllustrationProps, 'src' | 'alt'>> = (props) => (
  <Illustration
    src={LearnIllustration}
    alt="Brain and mouth learning illustration"
    variant="circle"
    size="medium"
    animation="pulse"
    {...props}
  />
);

export const QuizMenuIllustration: React.FC<Omit<IllustrationProps, 'src' | 'alt'>> = (props) => (
  <Illustration
    src={QuizIllustration}
    alt="Brain and mouth quiz illustration"
    variant="circle"
    size="medium"
    animation="pulse"
    {...props}
  />
);

export const QuizFeedbackBad: React.FC<Omit<IllustrationProps, 'src' | 'alt'>> = (props) => (
  <Illustration
    src={FeedbackBadIllustration}
    alt="Brain with dunce cap illustration"
    variant="plain"
    size="medium"
    animation="shake"
    {...props}
  />
);

export const QuizFeedbackGood: React.FC<Omit<IllustrationProps, 'src' | 'alt'>> = (props) => (
  <Illustration
    src={FeedbackGoodIllustration}
    alt="Celebrating brain and mouth illustration"
    variant="plain"
    size="medium"
    animation="bounce"
    {...props}
  />
);

// Additional preset illustrations with different configurations
export const CircleIllustration: React.FC<Omit<IllustrationProps, 'variant'> & { src: string; alt: string }> = ({
  src,
  alt,
  size = 'medium',
  ...props
}) => (
  <Illustration
    src={src}
    alt={alt}
    variant="circle"
    size={size}
    {...props}
  />
);

export const GlowingIllustration: React.FC<Omit<IllustrationProps, 'variant' | 'animation'> & { src: string; alt: string }> = ({
  src,
  alt,
  size = 'medium',
  ...props
}) => (
  <Illustration
    src={src}
    alt={alt}
    variant="glow"
    animation="pulse"
    size={size}
    {...props}
  />
);

export const ResponsiveIllustration: React.FC<Omit<IllustrationProps, 'size'> & { src: string; alt: string }> = ({
  src,
  alt,
  variant = 'plain',
  aspectRatio = 'landscape',
  ...props
}) => (
  <Illustration
    src={src}
    alt={alt}
    variant={variant}
    size="responsive"
    aspectRatio={aspectRatio}
    {...props}
  />
);

export default {
  Illustration,
  HomePageIllustration,
  LearnMenuIllustration,
  QuizMenuIllustration,
  QuizFeedbackBad,
  QuizFeedbackGood,
  CircleIllustration,
  GlowingIllustration,
  ResponsiveIllustration,
};
