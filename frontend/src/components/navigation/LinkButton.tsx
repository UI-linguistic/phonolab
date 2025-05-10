/**
 * LinkButton.tsx
 *
 * A styled <Link> wrapper that behaves like a button.
 * Used for navigation within the app with consistent theming, sizing, and visual feedback.
 *
 * Features:
 * - Uses React Router's <Link> for client-side routing
 * - Variants: 'solid' (filled) and 'outline' (bordered)
 * - Size options: 'small', 'medium', 'large' with themed padding
 * - Active state override: treat any link as 'active' even if not current route
 * - Themed hover styles and rounded borders
 *
 * Props (LinkButtonProps):
 * - to: string | object                 — destination URL or route object
 * - variant?: 'solid' | 'outline'       — visual style (default: 'outline')
 * - size?: 'small' | 'medium' | 'large' — size key controlling padding (default: 'medium')
 * - active?: boolean                    — forcefully mark the button as active
 * - children: ReactNode                 — button label/content
 * - ...rest: Omit<LinkProps, 'to'>      — forwards other React Router props
 *
 * Example Usage:
 * <LinkButton to="/learn" size="small">Start Learning</LinkButton>
 * <LinkButton to="/quiz" variant="solid" active>Quiz</LinkButton>
 */

import React from 'react'
import { Link, LinkProps } from 'react-router-dom'
import styled, { css } from 'styled-components'

export interface LinkButtonProps extends Omit<LinkProps, 'to'> {
    to: LinkProps['to']
    variant?: 'solid' | 'outline'
    size?: 'small' | 'medium' | 'large'
    active?: boolean
}

const StyledLink = styled(Link) <LinkButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;

  /* padding by size */
  padding: ${({ size = 'medium', theme }) => {
        switch (size) {
            case 'small': return theme.spacing.small;
            case 'large': return theme.spacing.large;
            default: return theme.spacing.medium;
        }
    }};
  border-radius: ${({ theme }) => theme.borderRadius};
  border: 2px solid ${({ theme }) => theme.colors.black};
  font-weight: 600;

  /* outline (inactive) vs solid (active) */
  ${({ variant = 'outline', active, theme }) => {
        if (variant === 'solid' || active) {
            return css`
                background-color: ${theme.colors.secondary};
                color: ${theme.colors.white};
                border: 2px solid ${theme.colors.black};
            `
        } else {
            return css`
                color: ${theme.colors.text};
                border: 2px solid ${theme.colors.secondary};
            `
        }
    }}

  /* hover state */
  &:hover {
    ${({ variant = 'outline', theme }) =>
        variant === 'outline'
            ? css`
            background-color: ${theme.colors.secondary}22; /* 13% opacity orange */
          `
            : css`
            background-color: ${theme.colors.secondary};
          `}
  }
`

export const LinkButton: React.FC<LinkButtonProps> = ({
    to,
    variant = 'outline',
    size = 'medium',
    active = false,
    children,
    ...rest
}) => (
    <StyledLink
        to={to}
        variant={variant}
        size={size}
        active={active}
        {...rest}
    >
        {children}
    </StyledLink>
)
