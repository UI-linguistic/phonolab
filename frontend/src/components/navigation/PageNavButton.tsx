/**
 * PageNavButton.tsx
 *
 * A flexible, reusable arrow navigation button component used throughout the quiz and learning modules.
 *
 * Features:
 * - Directional icons: supports "left" or "right" arrow icons using Lucide
 * - Optional text label: display with icon-only, text-only, or icon + label
 * - Size variations: 'xs', 'sm', 'md', 'lg' with consistent spacing and padding
 * - Variant options: 'primary' for filled background, 'ghost' for transparent
 * - Fully theme-aware: uses theme-provided font, border radius, colors, and transitions
 * - Focus, hover, and active states: styled for interaction and accessibility
 *
 * Props (QuizNavButtonProps):
 * - direction: 'left' | 'right'         — arrow direction
 * - label?: string                      — optional text label
 * - size?: 'xs' | 'sm' | 'md' | 'lg'    — size token (default 'md')
 * - onClick: () => void                 — click handler
 * - showOnlyIcon?: boolean             — whether to hide text label
 * - variant?: 'primary' | 'ghost'       — styling mode (default 'primary')
 * - ariaLabel?: string                  — accessibility label
 *
 * Named Variants:
 * - IconOnlyBack / IconOnlyNext        — icon-only buttons
 * - IconTextBack / IconTextNext        — icon with text
 * - TextOnlyBack / TextOnlyNext        — text-only buttons
 *
 * Example:
 * <IconTextNext label="Next" onClick={handleNext} />
 * <IconOnlyBack onClick={handleBack} size="xs" />
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
