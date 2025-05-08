// src/components/navigation/LinkButton.tsx
import React from 'react';
import { Link, LinkProps } from 'react-router-dom';
import styled from 'styled-components';
import { Button, ButtonProps } from '@components/ui';

const StyledLink = styled(Link) <LinkProps>`
  display: block;         /* make it block-level */
  width: 100%;            /* stretch it by default */
  
  > button {
    width: 100%;
  }
`;

export type LinkButtonProps = ButtonProps &
    Omit<LinkProps, 'to'> & {
        to: LinkProps['to'];
        withIcon?: boolean;
    };

export default function LinkButton({
    to,
    children,
    withIcon = false,
    ...buttonProps
}: LinkButtonProps) {
    return (
        <StyledLink to={to}>
            <Button {...buttonProps}>
                {children}
            </Button>
        </StyledLink>
    );
}
