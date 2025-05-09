// src/components/navigation/LinkButton.tsx
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
