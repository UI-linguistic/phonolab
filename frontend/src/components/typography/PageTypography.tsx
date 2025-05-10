/**
 * PageTypography.tsx
 *
 * Provides styled heading and paragraph components for page titles and subtitles,
 * plus wrapper containers to control their horizontal placement.
 *
 * Features:
 *  - TitleContainer / SubtitleContainer:
 *      • Simple <div> wrappers that accept a `marginLeft` prop for offsetting
 *      • Use case: indent headings/subtitles consistently without inline styles
 *
 *  - <PageTitle>:
 *      • Renders an <h1> with:
 *          – theme.fonts.heading
 *          – theme.fontSizes.xxl + theme.lineHeights.lg
 *          – color from theme.colors (default `text`)
 *          – white-space: nowrap + text-overflow ellipsis to prevent mid‑line wraps
 *      • Props:
 *          – color?: keyof theme.colors (defaults to `text`)
 *          – align?: 'left'|'center'|'right' (defaults to left)
 *
 *  - <PageSubtitle>:
 *      • Renders a <p> with:
 *          – theme.fonts.main
 *          – theme.fontSizes.md + theme.lineHeights.md
 *          – color from theme.colors (default `textSubtle`)
 *          – margin-top: theme.spacing.small for spacing below title
 *      • Props:
 *          – color?: keyof theme.colors (defaults to `textSubtle`)
 *          – align?: 'left'|'center'|'right' (defaults to left)
 *
 * Shared Base Styles:
 *  - text-align and margin reset via `baseStyles` fragment
 *
 * Usage Example:
 *  <TitleContainer marginLeft="2rem">
 *    <PageTitle color="primary" align="center">
 *      Welcome to Hooked on Phonetics™
 *    </PageTitle>
 *  </TitleContainer>
 *
 *  <SubtitleContainer marginLeft="2rem">
 *    <PageSubtitle color="secondaryAccent">
 *      Let’s get your mouth on board.
 *    </PageSubtitle>
 *  </SubtitleContainer>
 */

import React from 'react';
import styled, { css, DefaultTheme } from 'styled-components';

// Allowed color keys from theme.colors
type ColorKey = keyof DefaultTheme['colors'];

export interface TitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  /** Theme color key, defaults to `text` */
  color?: ColorKey;
  /** Text alignment */
  align?: 'left' | 'center' | 'right';
}

export interface SubtitleProps extends React.HTMLAttributes<HTMLParagraphElement> {
  /** Theme color key, defaults to `textSubtle` */
  color?: ColorKey;
  /** Text alignment */
  align?: 'left' | 'center' | 'right';
}

// ────────────────────────────────────────────────────────────
// Shared style for alignment and reset margins
// ────────────────────────────────────────────────────────────
const baseStyles = css<{ align?: TitleProps['align'] }>`
  text-align: ${({ align }) => align ?? 'left'};
  margin: 0;
`;

// ────────────────────────────────────────────────────────────
// Title Container
// ────────────────────────────────────────────────────────────
export const TitleContainer = styled.div<{ marginLeft?: string }>`
  /* Provides a wrapper to control title placement */
  margin-left: ${({ marginLeft, theme }) => marginLeft ?? '0'};
  display: block;
`;
TitleContainer.displayName = 'TitleContainer';

// ────────────────────────────────────────────────────────────
// Page Title
// ────────────────────────────────────────────────────────────
export const PageTitle = styled.h1<TitleProps>`
  ${baseStyles}
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: ${({ theme }) => theme.fontSizes.xxl};
  line-height: ${({ theme }) => theme.lineHeights.lg};
  color: ${({ theme, color }) => theme.colors[color ?? 'text']};

  /* never wrap text */
  white-space: nowrap;

  /* optional: show an ellipsis if it does overflow */
  overflow: hidden;
  text-overflow: ellipsis;
`;
PageTitle.displayName = 'PageTitle';

// ────────────────────────────────────────────────────────────
// Subtitle Container
// ────────────────────────────────────────────────────────────
export const SubtitleContainer = styled.div<{ marginLeft?: string }>`
  /* Provides a wrapper to control subtitle placement */
  margin-left: ${({ marginLeft, theme }) => marginLeft ?? '0'};
  display: block;
`;
SubtitleContainer.displayName = 'SubtitleContainer';

// ────────────────────────────────────────────────────────────
// Page Subtitle
// ────────────────────────────────────────────────────────────
export const PageSubtitle = styled.p<SubtitleProps>`
  ${baseStyles}
  font-family: ${({ theme }) => theme.fonts.main};
  font-size: ${({ theme }) => theme.fontSizes.md};
  line-height: ${({ theme }) => theme.lineHeights.md};
  color: ${({ theme, color }) => theme.colors[color ?? 'textSubtle']};
  margin-top: ${({ theme }) => theme.spacing.small};
`;
PageSubtitle.displayName = 'PageSubtitle';

// ────────────────────────────────────────────────────────────
// Usage Example:
//
// <TitleContainer marginLeft="2rem">
//   <PageTitle color="primary" align="center">Welcome</PageTitle>
// </TitleContainer>
// <SubtitleContainer marginLeft="2rem">
//   <PageSubtitle color="secondaryAccent">Let’s get started</PageSubtitle>
// </SubtitleContainer>
