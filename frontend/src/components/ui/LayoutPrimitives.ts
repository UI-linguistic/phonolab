// src/components/ui/LayoutPrimitives.tsx
import styled from 'styled-components';

interface SectionTextProps {
  align?: 'left' | 'center' | 'right';
}

export const SectionTitle = styled.h2<SectionTextProps>`
  /* make it fill its parent so text-align works as expected */
  width: 100%;
  /* if you want extra safety when the column is centered: */
  align-self: flex-start;

  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: ${({ theme }) => theme.fontSizes.xl};
  margin-bottom: ${({ theme }) => theme.spacing.medium};
  text-align: ${({ align = 'center' }) => align};
`;

export const SectionSubtitle = styled.p<SectionTextProps>`
  /* subtitles are already block-level/full width by default, but you can also add:
     width: 100%;
     align-self: flex-start;
  */

  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.textSubtle};
  margin-bottom: ${({ theme }) => theme.spacing.large};
  line-height: ${({ theme }) => theme.lineHeights.md};
  text-align: ${({ align = 'center' }) => align};
`;
