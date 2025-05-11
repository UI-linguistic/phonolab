/**
 * PageTypography.tsx
 *
 * Provides styled text components for page content with consistent typography.
 * 
 * Core features:
 *  - Base Text component that accepts all typography token properties
 *  - Specialized components (PageTitle, PageSubtitle, LayoutTitle, etc.) that
 *    apply specific token-based styling for consistent usage patterns
 *  - Container components for layout control
 *
 * Usage:
 *  <PageTitle>Main Heading</PageTitle>
 *  <PageSubtitle>Supporting text that explains the page purpose</PageSubtitle>
 */
import React from 'react';
import styled, { css, DefaultTheme } from 'styled-components';

// ────────────────────────────────────────────────────────────
// Type definitions
// ────────────────────────────────────────────────────────────
type ColorKey = keyof DefaultTheme['colors'];
type AlignKey = 'left' | 'center' | 'right' | 'justify';
type WeightKey = keyof DefaultTheme['fontWeights'];
type TransformKey = 'none' | 'uppercase' | 'lowercase' | 'capitalize';
type DecorationKey = 'none' | 'underline' | 'line-through' | 'overline';
export type Variant = keyof DefaultTheme['typography'];

export interface TextProps extends React.HTMLAttributes<HTMLElement> {
  variant?: Variant;
  color?: ColorKey;
  align?: AlignKey;
  weight?: WeightKey;
  italic?: boolean;
  transform?: TransformKey;
  decoration?: DecorationKey;
  margin?: string;
  padding?: string;
}

// ────────────────────────────────────────────────────────────
// Helper functions
// ────────────────────────────────────────────────────────────
const resolveFontSize = (
  fs: string | { min: string; fluid: string; max: string }
) =>
  typeof fs === 'string'
    ? fs
    : `clamp(${fs.min}, ${fs.fluid}, ${fs.max})`;

const variantStyles = (theme: DefaultTheme, v: Variant) => {
  const [tag, rawSize, lineHeight, defaultWeight] = theme.typography[v];
  const fontSize = resolveFontSize(rawSize);

  // Determine font weight from theme tokens
  const weightValue =
    typeof defaultWeight === 'string' && theme.fontWeights
      ? theme.fontWeights[defaultWeight as WeightKey]
      : defaultWeight;

  return css`
    font-family: ${tag.startsWith('h') ? theme.fonts.inter : theme.fonts.poppins};
    font-size: ${fontSize};
    line-height: ${lineHeight};
    font-weight: ${weightValue};
  `;
};

// ────────────────────────────────────────────────────────────
// Base Text Component
// ────────────────────────────────────────────────────────────
export const Text = styled.span<TextProps>`
  ${({ theme, variant = 'body' }) => variantStyles(theme, variant)};
  ${({ theme, color }) =>
    color ? `color: ${theme.colors[color]};` : ''}
  text-align: ${({ align }) => align ?? 'left'};
  font-weight: ${({ theme, weight, variant }) =>
    weight ? theme.fontWeights[weight] : undefined};
  font-style: ${({ italic }) => (italic ? 'italic' : 'normal')};
  text-transform: ${({ transform }) => transform ?? 'none'};
  text-decoration: ${({ decoration }) => decoration ?? 'none'};
  margin: ${({ margin }) => margin ?? 0};
  padding: ${({ padding }) => padding ?? 0};
`;
Text.displayName = 'Text';

// ────────────────────────────────────────────────────────────
// Container Components
// ────────────────────────────────────────────────────────────
export const TitleContainer = styled.div<{ marginLeft?: string }>`
  margin-left: ${({ marginLeft }) => marginLeft ?? '0'};
  display: block;
`;
TitleContainer.displayName = 'TitleContainer';

export const SubtitleContainer = styled.div<{ marginLeft?: string }>`
  margin-left: ${({ marginLeft }) => marginLeft ?? '0'};
  display: block;
`;
SubtitleContainer.displayName = 'SubtitleContainer';

// ────────────────────────────────────────────────────────────
// Page Typography Components
// ────────────────────────────────────────────────────────────

/**
 * PageTitle: Renders an <h1> with the 'title' typography variant by default.
 * Can be customized with any typography token variant.
 */
export const PageTitle = styled(Text).attrs<TextProps>(
  ({ variant = 'title', as = 'h1' }) => ({
    variant,
    as,
  })
) <TextProps>`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
PageTitle.displayName = 'PageTitle';

/**
 * PageSubtitle: Renders a <p> with the 'subtitle' typography variant by default.
 * Can be customized with any typography token variant.
 */
export const PageSubtitle = styled(Text).attrs<TextProps>(
  ({ variant = 'subtitle', as = 'p' }) => ({
    variant,
    as,
  })
) <TextProps>`
  margin-top: ${({ theme }) => theme.spacing.small};
`;
PageSubtitle.displayName = 'PageSubtitle';

// ────────────────────────────────────────────────────────────
// Layout-specific Typography Components
// ────────────────────────────────────────────────────────────

/**
 * LayoutTitle: Specialized title component that always uses the 'layoutTitle' variant.
 * This component is not customizable to ensure consistent layout styling.
 */
export const LayoutTitle = styled(Text).attrs<TextProps>({
  variant: 'layoutTitle',
  as: 'h1',
})`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
LayoutTitle.displayName = 'LayoutTitle';

/**
 * LayoutSubtitle: Specialized subtitle component that always uses the 'layoutSubtitle' variant.
 * This component is not customizable to ensure consistent layout styling.
 */
export const LayoutSubtitle = styled(Text).attrs<TextProps>({
  variant: 'layoutSubtitle',
  as: 'p',
})`
  margin-top: ${({ theme }) => theme.spacing.small};
`;
LayoutSubtitle.displayName = 'LayoutSubtitle';

/**
 * LayoutInstruction: Specialized instruction text component that always uses the 'layoutInstruction' variant.
 * This component is not customizable to ensure consistent layout styling.
 */
export const LayoutInstruction = styled(Text).attrs<TextProps>({
  variant: 'layoutInstruction',
  as: 'p',
})`
  margin-top: ${({ theme }) => theme.spacing.small};
`;
LayoutInstruction.displayName = 'LayoutInstruction';

/**
 * PhonemeGridText: Specialized text component for phoneme grids.
 * This component is not customizable to ensure consistent grid styling.
 */
export const PhonemeGridText = styled(Text).attrs<TextProps>({
  variant: 'gridPhoneme',
  as: 'p',
})``;
PhonemeGridText.displayName = 'PhonemeGridText';
