// src/components/ui/Button.tsx


// THIS IS ABOUT TO BE DEPRECATED
// USE MenuPresets.tsx FILE INSTEAD
// or NavButton.tsx FILE INSTEAD

import React from 'react';
import styled, { css } from 'styled-components';

export type ButtonVariant = 'solid' | 'outline' | 'link';
export type ButtonSize = 'small' | 'medium' | 'large';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  as?: React.ElementType;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  active?: boolean;
}

const StyledButton = styled.button<ButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.borderRadius};
  font-family: ${({ theme }) => theme.fonts.main};
  transition: background-color 0.2s, color 0.2s, transform 0.1s;

  /* ─── SOLID ───────────────────────────────────────────────────── */
  ${({ variant = 'solid', active, theme }) =>
    (active || variant === 'solid') &&
    css`
      background-color: ${theme.colors.secondary};
      color: white;
      border: ${active ? theme.border.highlight : 'none'};

      &:hover:not(:disabled) {
        background-color: ${theme.colors.secondary}cc;
        transform: translateY(-2px);
      }
    `}

  /* ─── OUTLINE ─────────────────────────────────────────────────── */
  ${({ variant = 'outline', active, theme }) =>
    variant === 'outline' &&
    !active &&
    css`
      background-color: transparent;
      color: ${theme.colors.text};
      border: 2px solid ${theme.colors.secondary};

      &:hover:not(:disabled) {
        background-color: ${theme.colors.secondary}1a;
        transform: translateY(-2px);
      }
    `}

  /* ─── LINK ────────────────────────────────────────────────────── */
  ${({ variant = 'link', theme }) =>
    variant === 'link' &&
    css`
      background: none;
      color: ${theme.colors.primary};
      border: none;
      padding: 0;

      &:hover:not(:disabled) {
        text-decoration: underline;
      }
    `}

  /* ─── SIZES ───────────────────────────────────────────────────── */
  ${({ size = 'small', theme }) =>
    size === 'small' &&
    css`
      padding: ${theme.spacing.small};
      font-size: 0.875rem;
    `}

  ${({ size = 'medium', theme }) =>
    size === 'medium' &&
    css`
      padding: ${theme.spacing.medium};
      font-size: 1rem;
    `}

  ${({ size = 'large', theme }) =>
    size === 'large' &&
    css`
      padding: ${theme.spacing.large};
      font-size: 1.125rem;
    `}

  /* ─── DISABLED STATE ───────────────────────────────────────────── */
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

export default function Button({
  variant = 'solid',
  size = 'medium',
  loading = false,
  disabled,
  active = false,
  children,
  ...props
}: ButtonProps) {
  return (
    <StyledButton
      variant={variant}
      size={size}
      active={active}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? 'Loading…' : children}
    </StyledButton>
  );
}