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
type FontFamilyKey = keyof DefaultTheme['fonts'];
type TransformKey = 'none' | 'uppercase' | 'lowercase' | 'capitalize';
type DecorationKey = 'none' | 'underline' | 'line-through' | 'overline';
type StyleKey = 'normal' | 'italic' | 'oblique';
export type Variant = keyof DefaultTheme['typography'];

export interface TextProps extends React.HTMLAttributes<HTMLElement> {
  variant?: Variant;
  color?: ColorKey;
  align?: AlignKey;
  weight?: WeightKey;
  family?: FontFamilyKey;
  fontStyle?: StyleKey;
  transform?: TransformKey;
  decoration?: DecorationKey;
  margin?: string;
  padding?: string;
  responsive?: boolean;
  truncate?: boolean | number;
  letterSpacing?: string;
  maxWidth?: string;
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

// Truncate text helper
const getTruncateStyles = (truncate: boolean | number) => {
  if (truncate === true) {
    return css`
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    `;
  } else if (typeof truncate === 'number' && truncate > 0) {
    return css`
      display: -webkit-box;
      -webkit-line-clamp: ${truncate};
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
    `;
  }
  return '';
};

// ────────────────────────────────────────────────────────────
// Base Text Component
// ────────────────────────────────────────────────────────────
export const Text = styled.span<TextProps>`
  ${({ theme, variant = 'body' }) => variantStyles(theme, variant)};
  
  ${({ theme, color }) =>
    color ? `color: ${theme.colors[color]};` : ''}
  
  text-align: ${({ align }) => align ?? 'left'};
  
  ${({ theme, family }) =>
    family ? `font-family: ${theme.fonts[family]};` : ''}
  
  ${({ theme, weight }) =>
    weight ? `font-weight: ${theme.fontWeights[weight]};` : ''}
  
  font-style: ${({ fontStyle }) => fontStyle ?? 'normal'};
  text-transform: ${({ transform }) => transform ?? 'none'};
  text-decoration: ${({ decoration }) => decoration ?? 'none'};
  letter-spacing: ${({ letterSpacing }) => letterSpacing ?? 'normal'};
  
  margin: ${({ margin }) => margin ?? 0};
  padding: ${({ padding }) => padding ?? 0};
  max-width: ${({ maxWidth }) => maxWidth ?? 'none'};
  
  ${({ truncate }) => truncate && getTruncateStyles(truncate)}
  
  /* Responsive adjustments */
  ${({ responsive, theme }) =>
    responsive &&
    css`
      @media ${theme.media.tablet.replace('@media ', '')} {
        font-size: calc(1em + 0.1vw);
      }
      
      @media ${theme.media.desktop.replace('@media ', '')} {
        font-size: calc(1em + 0.2vw);
      }
      
      @media ${theme.media.widescreen.replace('@media ', '')} {
        font-size: calc(1em + 0.3vw);
      }
    `}
  
  /* Transition for hover effects */
  transition: 
    color ${({ theme }) => theme.transitions.short},
    transform ${({ theme }) => theme.transitions.short};
  
  @media ${({ theme }) => theme.media.reducedMotion.replace('@media ', '')} {
    transition: 
      color ${({ theme }) => theme.transitions.reducedMotion.short},
      transform ${({ theme }) => theme.transitions.reducedMotion.short};
  }
`;

Text.displayName = 'Text';

// ────────────────────────────────────────────────────────────
// Container Components
// ────────────────────────────────────────────────────────────
export const TitleContainer = styled.div<{
  marginLeft?: string;
  marginBottom?: string;
  maxWidth?: string;
}>`
  margin-left: ${({ marginLeft }) => marginLeft ?? '0'};
  margin-bottom: ${({ marginBottom }) => marginBottom ?? '0'};
  max-width: ${({ maxWidth }) => maxWidth ?? 'none'};
  display: block;
`;

TitleContainer.displayName = 'TitleContainer';

export const SubtitleContainer = styled.div<{
  marginLeft?: string;
  marginTop?: string;
  marginBottom?: string;
  maxWidth?: string;
}>`
  margin-left: ${({ marginLeft }) => marginLeft ?? '0'};
  margin-top: ${({ marginTop }) => marginTop ?? '0'};
  margin-bottom: ${({ marginBottom }) => marginBottom ?? '0'};
  max-width: ${({ maxWidth }) => maxWidth ?? 'none'};
  display: block;
`;

SubtitleContainer.displayName = 'SubtitleContainer';

export const TextGroup = styled.div<{
  spacing?: string;
  align?: AlignKey;
  maxWidth?: string;
}>`
  display: flex;
  flex-direction: column;
  gap: ${({ spacing, theme }) => spacing ?? theme.spacing.medium};
  text-align: ${({ align }) => align ?? 'left'};
  max-width: ${({ maxWidth }) => maxWidth ?? 'none'};
`;

TextGroup.displayName = 'TextGroup';

// ────────────────────────────────────────────────────────────
// Page Typography Components
// ────────────────────────────────────────────────────────────
/**
 * PageTitle: Renders an <h1> with the 'title' typography variant by default.
 * Can be customized with any typography token variant.
 */
export const PageTitle = styled(Text).attrs<TextProps>(
  ({ variant = 'title' as Variant, as = 'h1' }) => ({
    variant,
    as,
  })
) <TextProps>`
  ${({ truncate = true }) => truncate && getTruncateStyles(truncate)}
`;

PageTitle.displayName = 'PageTitle';

/**
 * PageSubtitle: Renders a <p> with the 'subtitle' typography variant by default.
 * Can be customized with any typography token variant.
 */
export const PageSubtitle = styled(Text).attrs<TextProps>(
  ({ variant = 'subtitle' as Variant, as = 'p' }) => ({
    variant,
    as,
  })
) <TextProps>`
  margin-top: ${({ theme, margin }) => margin ?? theme.spacing.small};
`;

PageSubtitle.displayName = 'PageSubtitle';

/**
 * SectionTitle: For section headings within a page
 */
export const SectionTitle = styled(Text).attrs<TextProps>(
  ({ variant = 'sectionTitle' as Variant, as = 'h2' }) => ({
    variant,
    as,
  })
) <TextProps>`
  ${({ truncate = true }) => truncate && getTruncateStyles(truncate)}
  margin-bottom: ${({ theme }) => theme.spacing.small};
`;

SectionTitle.displayName = 'SectionTitle';

/**
 * SectionSubtitle: For supporting text under section headings
 */
export const SectionSubtitle = styled(Text).attrs<TextProps>(
  ({ variant = 'sectionSubtitle' as Variant, as = 'p' }) => ({
    variant,
    as,
  })
) <TextProps>`
  margin-bottom: ${({ theme }) => theme.spacing.medium};
`;

SectionSubtitle.displayName = 'SectionSubtitle';

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
  ${({ truncate = true }) => truncate && getTruncateStyles(truncate)}
`;

LayoutTitle.displayName = 'LayoutTitle';

export const LayoutQuizTitle = styled(Text).attrs<TextProps>({
  variant: 'layoutQuizTitle',
  as: 'h1',
})`
  ${({ truncate = true }) => truncate && getTruncateStyles(truncate)}
`;

LayoutQuizTitle.displayName = 'LayoutQuizTitle';

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

/**
 * HighlightedText: Text with background highlight
 */
export const HighlightedText = styled(Text) <{
  highlightColor?: ColorKey;
  highlightOpacity?: number;
  padding?: string;
  borderRadius?: string;
}>`
  display: inline-block;
  background-color: ${({ theme, highlightColor = 'accent', highlightOpacity = 0.2 }) =>
    `${theme.colors[highlightColor]}${Math.floor(highlightOpacity * 255).toString(16).padStart(2, '0')}`};
  padding: ${({ padding, theme }) => padding ?? theme.spacing.xsmall};
  border-radius: ${({ borderRadius, theme }) => borderRadius ?? theme.borderRadius};
`;

HighlightedText.displayName = 'HighlightedText';


/**
 * Label: For form labels and other labeling needs
 */
export const Label = styled(Text).attrs<TextProps>(
  ({ variant = 'label' as Variant, as = 'label', weight = 'medium' }) => ({
    variant,
    as,
    weight,
  })
) <TextProps>`
  display: block;
  margin-bottom: ${({ theme }) => theme.spacing.xsmall};
`;

Label.displayName = 'Label';

export default {
  Text,
  PageTitle,
  PageSubtitle,
  SectionTitle,
  SectionSubtitle,
  LayoutTitle,
  LayoutQuizTitle,
  LayoutSubtitle,
  LayoutInstruction,
  PhonemeGridText,
  TitleContainer,
  SubtitleContainer,
  TextGroup,
  HighlightedText,
  Label
};
