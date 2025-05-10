// src/components/ui/Heading.tsx


// THIS IS ABOUT TO BE DEPRECATED
// USE PageTypography.tsx FILE INSTEAD

import React from 'react';
import styled, { css } from 'styled-components';

interface StyledHeadingProps {
    level: number;
}

const StyledHeading = styled.h1<StyledHeadingProps>`
  font-family: ${({ theme }) => theme.fonts.heading};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.medium};

  ${({ level }) => level === 1 && css`font-size: 2.5rem;`}
  ${({ level }) => level === 2 && css`font-size: 2rem;`}
  ${({ level }) => level === 3 && css`font-size: 1.75rem;`}
  ${({ level }) => level === 4 && css`font-size: 1.5rem;`}
  ${({ level }) => level === 5 && css`font-size: 1.25rem;`}
  ${({ level }) => level === 6 && css`font-size: 1rem;`}
`;

export interface HeadingProps {
    level?: 1 | 2 | 3 | 4 | 5 | 6;
    children: React.ReactNode;
}

export default function Heading({ level = 1, children }: HeadingProps) {
    const Tag = `h${level}` as keyof JSX.IntrinsicElements;
    return (
        <StyledHeading as={Tag} level={level}>
            {children}
        </StyledHeading>
    );
}
