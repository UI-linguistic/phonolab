// src/components/ui/Menu.tsx
import React, { ReactNode, HTMLAttributes } from 'react';
import styled, { css } from 'styled-components';

/** Props for MenuContainer */
export interface MenuContainerProps extends HTMLAttributes<HTMLDivElement> {
  /** vertical padding (top & bottom) */
  paddingY?: string;
  /** horizontal alignment of the inner list */
  justifyContent?: 'flex-start' | 'center' | 'flex-end';
}

const _MenuContainer = styled.section<MenuContainerProps>`
  width: 100%;
  display: flex;
  justify-content: ${({ justifyContent = 'center' }) => justifyContent};
  padding: ${({ paddingY = '0' }) => paddingY} 0;
`;

export const MenuContainer: React.FC<MenuContainerProps> = ({
  children,
  paddingY,
  justifyContent,
  ...rest
}) => (
  <_MenuContainer
    paddingY={paddingY}
    justifyContent={justifyContent}
    {...rest}
  >
    {children}
  </_MenuContainer>
);


/** Props for MenuList */
export interface MenuListProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  /** grid-template-columns value (e.g. "max-content" or "repeat(3,1fr)" ) */
  columns?: string;
  /** gap between items (CSS length) */
  gap?: string;
  /** horizontal alignment of items inside the grid */
  justifyItems?: 'start' | 'center' | 'end';
  /** vertical alignment of items inside the grid */
  alignItems?: 'start' | 'center' | 'end';
  /** max-width of the list container */
  maxWidth?: string;
  /** width of the list container */
  width?: string;
}

const _MenuList = styled.div<MenuListProps>`
  display: grid;
  ${({ columns = 'max-content' }) =>
    css`
      grid-template-columns: ${columns};
    `}
  ${({ gap, theme }) =>
    css`
      gap: ${gap ?? theme.spacing.medium};
    `}
  ${({ maxWidth = '300px' }) =>
    css`
      max-width: ${maxWidth};
    `}
  ${({ width = '100%' }) =>
    css`
      width: ${width};
    `}

  ${({ justifyItems }) =>
    justifyItems &&
    css`
      justify-items: ${justifyItems};
    `}
  ${({ alignItems }) =>
    alignItems &&
    css`
      align-items: ${alignItems};
    `}

  & > a {
    width: 100%;
  }
  & > a > button {
    width: 100%;
  }

  @media (max-width: 600px) {
    justify-content: center;
  }
`;

export const MenuList: React.FC<MenuListProps> = ({
  children,
  columns,
  gap,
  justifyItems,
  alignItems,
  maxWidth,
  width,
  ...rest
}) => (
  <_MenuList
    columns={columns}
    gap={gap}
    justifyItems={justifyItems}
    alignItems={alignItems}
    maxWidth={maxWidth}
    width={width}
    {...rest}
  >
    {children}
  </_MenuList>
);
