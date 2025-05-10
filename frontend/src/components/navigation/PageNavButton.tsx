/**
 * PageNavButton.tsx
 *
 * A reusable arrow button component for quiz navigation.
 * Can act as a "Back" or "Next" button with configurable icon direction,
 * optional text label, size variations, theme-based styling, and hover/active states.
 */

import React from 'react';
import styled, { css } from 'styled-components';
import { ArrowLeft, ArrowRight } from 'lucide-react';

// -------------------------
// Type Definitions
// -------------------------

type Size = 'xs' | 'sm' | 'md' | 'lg';

type Direction = 'left' | 'right';

interface QuizNavButtonProps {
  direction: Direction;
  label?: string;
  size?: Size;
  onClick: () => void;
  showOnlyIcon?: boolean;
  variant?: 'primary' | 'ghost';
  ariaLabel?: string;
}

// -------------------------
// Size Configuration
// -------------------------

const sizeStyles = {
  xs: {
    fontSize: '0.8rem',
    padding: '0.4rem 0.6rem',
    gap: '0.4rem',
  },
  sm: {
    fontSize: '1rem',
    padding: '0.5rem 0.8rem',
    gap: '0.6rem',
  },
  md: {
    fontSize: '1.2rem',
    padding: '0.6rem 1rem',
    gap: '0.8rem',
  },
  lg: {
    fontSize: '1.4rem',
    padding: '0.8rem 1.2rem',
    gap: '1rem',
  },
};

// -------------------------
// Styled Components
// -------------------------

const Wrapper = styled.button<{
  size: Size;
  variant: 'primary' | 'ghost';
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ size }) => sizeStyles[size].gap};
  padding: ${({ size }) => sizeStyles[size].padding};
  font-size: ${({ size }) => sizeStyles[size].fontSize};
  font-family: ${({ theme }) => theme.fonts.main};
  border: 2px solid ${({ theme }) => theme.colors.black};
  border-radius: ${({ theme }) => theme.borderRadius};
  background-color: ${({ theme, variant }) =>
    variant === 'primary' ? theme.colors.accent : 'transparent'};
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
  transition: all 0.15s ease-in-out;

  &:hover {
    background-color: ${({ theme }) => theme.colors.secondary};
    transform: scale(1.02);
  }

  &:active {
    transform: scale(0.97);
    opacity: 0.8;
  }

  &:focus-visible {
    outline: 3px dashed ${({ theme }) => theme.colors.primary};
    outline-offset: 4px;
  }
`;

// -------------------------
// Component
// -------------------------

export const PageNavButton: React.FC<QuizNavButtonProps> = ({
  direction,
  label,
  size = 'md',
  onClick,
  showOnlyIcon = false,
  variant = 'primary',
  ariaLabel,
}) => {
  const Icon = direction === 'left' ? ArrowLeft : ArrowRight;

  return (
    <Wrapper
      onClick={onClick}
      size={size}
      variant={variant}
      aria-label={ariaLabel || label || direction}
    >
      {direction === 'left' && <Icon size={20} />}
      {!showOnlyIcon && label && <span>{label}</span>}
      {direction === 'right' && <Icon size={20} />}
    </Wrapper>
  );
};

// -------------------------
// Named Wrapper Variants
// -------------------------

export const IconOnlyBack = (props: Omit<QuizNavButtonProps, 'direction' | 'showOnlyIcon'>) => (
  <PageNavButton {...props} direction="left" showOnlyIcon />
);

export const IconOnlyNext = (props: Omit<QuizNavButtonProps, 'direction' | 'showOnlyIcon'>) => (
  <PageNavButton {...props} direction="right" showOnlyIcon />
);

export const IconTextBack = (props: Omit<QuizNavButtonProps, 'direction'>) => (
  <PageNavButton {...props} direction="left" />
);

export const IconTextNext = (props: Omit<QuizNavButtonProps, 'direction'>) => (
  <PageNavButton {...props} direction="right" />
);

export const TextOnlyBack = (props: Omit<QuizNavButtonProps, 'direction'>) => (
  <PageNavButton {...props} direction="left" showOnlyIcon={false} />
);

export const TextOnlyNext = (props: Omit<QuizNavButtonProps, 'direction'>) => (
  <PageNavButton {...props} direction="right" showOnlyIcon={false} />
);

export default PageNavButton;
