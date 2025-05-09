// src/components/ui/MenuLayout.tsx
import React, { ReactNode, FC, HTMLAttributes } from 'react';
import styled, { css } from 'styled-components';

export interface ColumnProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  flex?: number;
  minWidth?: string;
  maxWidth?: string;
  justify?: 'flex-start' | 'center' | 'flex-end';
}

interface MenuLayoutProps {
  children: ReactNode;
}

const Container = styled.div`
  /* limit overall width and center on page */
  max-width: 1200px;
  margin: 0 auto;

  display: flex;
  justify-content: space-between;        /* push Left and Right to edges */
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.large};
  padding: ${({ theme }) => theme.spacing.large};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex-direction: column;
    padding: ${({ theme }) => theme.spacing.medium};
    gap: ${({ theme }) => theme.spacing.medium};
  }
`;

const LeftCol = styled.div<ColumnProps>`
  flex: ${({ flex = 1 }) => flex};
  ${({ minWidth }) =>
    minWidth &&
    css`
      min-width: ${minWidth};
    `}
  ${({ maxWidth }) =>
    maxWidth &&
    css`
      max-width: ${maxWidth};
    `}
  display: flex;
  flex-direction: column;
  align-items: ${({ justify = 'center' }) => justify};
`;

const RightCol = styled.div<ColumnProps>`
  flex: ${({ flex = 1 }) => flex};
  display: flex;
  align-items: center;
  justify-content: ${({ justify = 'center' }) => justify};
  ${({ minWidth }) =>
    minWidth &&
    css`
      min-width: ${minWidth};
    `}
  ${({ maxWidth }) =>
    maxWidth &&
    css`
      max-width: ${maxWidth};
    `}
`;

type MenuLayoutType = FC<MenuLayoutProps> & {
  Left: FC<ColumnProps>;
  Right: FC<ColumnProps>;
};

const MenuLayout = (({ children }: MenuLayoutProps) => (
  <Container>{children}</Container>
)) as MenuLayoutType;

MenuLayout.Left = ({ children, ...props }) => (
  <LeftCol {...props}>{children}</LeftCol>
);
MenuLayout.Right = ({ children, ...props }) => (
  <RightCol {...props}>{children}</RightCol>
);

export default MenuLayout;
