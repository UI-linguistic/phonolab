// src/components/ui/Text.tsx
import React from 'react';
import styled from 'styled-components';

export type TextSize = 'small' | 'medium' | 'large';

export interface TextProps extends React.HTMLAttributes<HTMLElement> {
    as?: keyof JSX.IntrinsicElements;
    size?: TextSize;
    children: React.ReactNode;
}

const StyledText = styled.p<{ size: TextSize }>`
  margin-bottom: ${({ theme }) => theme.spacing.medium};
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ size }) =>
        size === 'small' ? '0.875rem' :
            size === 'large' ? '1.125rem' :
                '1rem'};
  line-height: 1.5;
`;

export default function Text({
    as = 'p',
    size = 'medium',
    children,
    ...props
}: TextProps) {
    return (
        <StyledText as={as} size={size} {...props}>
            {children}
        </StyledText>
    );
}
