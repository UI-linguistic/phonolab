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


type ColorKey = keyof DefaultTheme['colors']
type AlignKey = 'left' | 'center' | 'right' | 'justify'
type WeightKey = keyof DefaultTheme['fontWeights']
type TransformKey = 'none' | 'uppercase' | 'lowercase' | 'capitalize'
type DecorationKey = 'none' | 'underline' | 'line-through' | 'overline'

export type Variant = keyof DefaultTheme['typography']

export interface TextProps extends React.HTMLAttributes<HTMLElement> {
  variant?: Variant;               // which style to use
  color?: ColorKey;                // theme.colors key
  align?: AlignKey;                // text-align
  weight?: WeightKey;              // overrides default weight
  italic?: boolean;                // font-style
  transform?: TransformKey;        // text-transform
  decoration?: DecorationKey;      // text-decoration
  margin?: string;                 // CSS margin shorthand
  padding?: string;                // CSS padding shorthand
}

const resolveFontSize = (
  fs: string | { min: string; fluid: string; max: string }
) =>
  typeof fs === 'string'
    ? fs
    : `clamp(${fs.min}, ${fs.fluid}, ${fs.max})`;

const variantStyles = (theme: DefaultTheme, v: Variant) => {
  const [tag, rawSize, lineHeight, defaultWeight] = theme.typography[v];
  const fontSize = resolveFontSize(rawSize);
  return css`
    font-family: ${tag.startsWith('h')
      ? theme.fonts.heading
      : theme.fonts.main};
    font-size: ${fontSize};
    line-height: ${lineHeight};
    font-weight: ${defaultWeight};
  `;
};


export const Text = styled.span<TextProps>`
  ${({ theme, variant = 'body' }) => variantStyles(theme, variant)};

  ${({ theme, color }) =>
    color ? `color: ${theme.colors[color]};` : ''}

  text-align: ${({ align }) => align ?? 'left'};
  font-weight: ${({ theme, weight, variant }) =>
    weight
      ? theme.fontWeights[weight]
      : theme.typography[variant ?? 'body'][3]};

  font-style: ${({ italic }) => (italic ? 'italic' : 'normal')};
  text-transform: ${({ transform }) => transform ?? 'none'};
  text-decoration: ${({ decoration }) => decoration ?? 'none'};

  margin: ${({ margin }) => margin ?? 0};
  padding: ${({ padding }) => padding ?? 0};
`
Text.displayName = 'Text'

// ────────────────────────────────────────────────────────────
// Exported Prop Types for Title & Subtitle
// ────────────────────────────────────────────────────────────
/**
 * Props available on <PageTitle>. Inherits all super‑text props
 * except `variant` (forced to "title").
 */
export interface TitleProps extends Omit<TextProps, 'variant'> { }

/**
 * Props available on <PageSubtitle>. Inherits all super‑text props
 * except `variant` (forced to "subtitle").
 */
export interface SubtitleProps extends Omit<TextProps, 'variant'> { }

// ────────────────────────────────────────────────────────────
// Title & Subtitle Containers
// ────────────────────────────────────────────────────────────
export const TitleContainer = styled.div<{ marginLeft?: string }>`
  margin-left: ${({ marginLeft, theme }) => marginLeft ?? '0'};
  display: block;
`;
TitleContainer.displayName = 'TitleContainer';

export const SubtitleContainer = styled.div<{ marginLeft?: string }>`
  margin-left: ${({ marginLeft, theme }) => marginLeft ?? '0'};
  display: block;
`;
SubtitleContainer.displayName = 'SubtitleContainer';

// ────────────────────────────────────────────────────────────
// PageTitle & PageSubtitle Wrappers
// ────────────────────────────────────────────────────────────
/**
 * PageTitle: renders an <h1> with "title" variant and super text props.
 */
export const PageTitle = styled(Text).attrs<TitleProps>({
  as: 'h1',
  variant: 'title',
}) <TitleProps>`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
PageTitle.displayName = 'PageTitle';

/**
 * PageSubtitle: renders a <p> with "subtitle" variant and super text props.
 */
export const PageSubtitle = styled(Text).attrs<SubtitleProps>({
  as: 'p',
  variant: 'subtitle',
}) <SubtitleProps>`
  margin-top: ${({ theme }) => theme.spacing.small};
`;
PageSubtitle.displayName = 'PageSubtitle';


// A slightly smaller H1 for Learn pages:
export const LayoutTitle = styled(Text).attrs<TextProps>({
  as: 'h1',
  variant: 'layoutTitle',
})`
  /* Optionally, you can still preserve ellipsis behavior: */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
LayoutTitle.displayName = 'LayoutTitle';

// A slightly smaller subtitle forLearn pages:
export const LayoutSubtitle = styled(Text).attrs<TextProps>({
  as: 'p',
  variant: 'layoutSubtitle',
})`
  margin-top: ${({ theme }) => theme.spacing.small};
`;
LayoutSubtitle.displayName = 'LayoutSubtitle';

// A slightly smaller instruction for Learn pages:
export const LayoutInstruction = styled(Text).attrs<TextProps>({
  as: 'p',
  variant: 'layoutInstruction',
})`
  margin-top: ${({ theme }) => theme.spacing.small};
`;
LayoutInstruction.displayName = 'LayoutInstruction';

// ────────────────────────────────────────────────────────────
// Usage Example:
//
// <TitleContainer marginLeft="2rem">
//   <PageTitle color="primary" align="center">
//     Welcome to Hooked on Phonetics™
//   </PageTitle>
// </TitleContainer>
//
// <SubtitleContainer marginLeft="2rem">
//   <PageSubtitle color="secondaryAccent">
//     Let’s get your mouth on board.
//   </PageSubtitle>
// </SubtitleContainer>
