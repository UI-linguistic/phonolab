/**
 * QuizLayout.tsx
 *
 * Shared layout structure for all Quiz modules.
 * 
 * Variants (`variant` prop):
 *  - twoColumns:    Side-by-side layout for quiz content + controls
 *  - threeColumns:  Common for vowel grid + spectrum + answer box
 *  - stacked:       Stacked full-width blocks (e.g. timeline or progression stages)
 *
 * Slot direction control (`slotDirections` prop):
 *  - Array defining flex direction ('row' | 'column') for each slot
 *  - Enables different layout flow for each placeholder container
 *
 * Structure:
 *  • Row 1: back button | title | progress bar | next button (same row)
 *  • Row 2: quiz section label
 *  • Row 3: content placeholders (1–3), depending on variant
 */

import React from 'react';
import styled, { DefaultTheme } from 'styled-components';
import { PageTitle } from '../typography/PageTypography';
import { QuizProgressBar } from './Pbar';

interface QuizLayoutProps {
    title: string;
    titleAlign?: 'left' | 'center' | 'right';
    subtitle?: string;
    subtitleAlign?: 'left' | 'center' | 'right';
    rowGap?: string | keyof DefaultTheme['heroGaps'];
    quizStageLabel: string;
    showBackButton?: boolean;
    nextButton?: React.ReactNode;
    progressBar?: React.ReactNode;
    activeTabIndex?: number;
    onTabSelect?: (index: number) => void;
    sectionTabs?: string[];
    variant?: 'twoColumns' | 'threeColumns' | 'stacked';
    slotDirections?: ('row' | 'column')[];
    children: React.ReactNode;
}

type HeroGapKey = keyof DefaultTheme['heroGaps']; // "tight" | "normal" | "wide"

interface LayoutWrapperProps {
    /** one of theme.heroGaps: "tight", "normal", or "wide" */
    rowGap?: HeroGapKey;
}

// const Wrapper = styled.div`
//   display: flex;
//   flex-direction: column;
//   gap: ${({ theme }) => theme.spacing.large};
//   padding: ${({ theme }) => theme.spacing.large};
// `;

const Wrapper = styled.div<{ rowGap?: string }>`
  display: flex;
  flex-direction: column;
  gap: ${({ theme, rowGap }) =>
        rowGap
            ? theme.heroGaps[rowGap as HeroGapKey]
            : theme.spacing.large
    };
  padding: ${({ theme }) => theme.spacing.large};
  background-color: transparent;
  border-radius: ${({ theme }) => theme.borderRadius};
  outline: ${({ theme }) => theme.debugOutline ? `2px dashed ${theme.colors.secondary}` : 'none'};
`;

const HeaderRow = styled.div`
  display: grid;
  grid-template-columns: max-content max-content 1fr max-content;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.medium};
  outline: 2px dashed ${({ theme }) => theme.colors.secondary};

  & > div {
    padding: ${({ theme }) => theme.spacing.small};
    outline: 2px dashed ${({ theme }) => theme.colors.secondary};
  }
`;

const SmallTitle = styled(PageTitle)`
  font-size: ${({ theme }) => theme.fontSizes.lg};
`;

const SectionLabel = styled.div`
  font-weight: bold;
  font-size: ${({ theme }) => theme.fontSizes.lg};
  outline: 2px dashed ${({ theme }) => theme.colors.secondary};
  padding: ${({ theme }) => theme.spacing.small};
`;

const ContentGrid = styled.div<{ variant: QuizLayoutProps['variant'] }>`
  display: grid;
  ${({ variant }) => {
        switch (variant) {
            case 'twoColumns':
                return 'grid-template-columns: 1fr 1fr; gap: 2rem;';
            case 'threeColumns':
                return 'grid-template-columns: repeat(3, 1fr); gap: 2rem;';
            case 'stacked':
                return 'grid-template-rows: repeat(3, auto); gap: 2rem;';
            default:
                return 'grid-template-columns: 1fr;';
        }
    }}
  outline: 2px dashed ${({ theme }) => theme.colors.secondary};
`;

const Slot = styled.div<{ direction: 'row' | 'column' }>`
  display: flex;
  flex-direction: ${({ direction }) => direction};
  padding: ${({ theme }) => theme.spacing.small};
  outline: 2px dashed ${({ theme }) => theme.colors.secondary};
`;

const QuizLayout: React.FC<QuizLayoutProps> = ({
    title,
    quizStageLabel,
    showBackButton = true,
    nextButton,
    progressBar,
    variant = 'twoColumns',
    slotDirections = [],
    children,
    sectionTabs,
    activeTabIndex,
    onTabSelect,
    titleAlign = 'left',
    subtitle,
    subtitleAlign = 'left',
    rowGap = 'normal',
    ...props
}) => {
    const childrenArray = React.Children.toArray(children);

    return (
        <Wrapper>
            <HeaderRow>
                <div>{showBackButton ? 'Back' : null}</div>
                <div><SmallTitle>{title}</SmallTitle></div>
                <div>{progressBar ?? <QuizProgressBar value={0} label="0/3" />}</div>
                <div>{nextButton ?? 'Next'}</div>
            </HeaderRow>

            <SectionLabel>{quizStageLabel}</SectionLabel>

            <ContentGrid variant={variant}>
                {childrenArray.map((child, idx) => (
                    <Slot key={idx} direction={slotDirections[idx] || 'column'}>
                        {child}
                    </Slot>
                ))}
            </ContentGrid>
        </Wrapper>
    );
};

// Preset wrappers for quiz modules with visual debugging outlines

export function VowelShuffleLayout(props: Omit<QuizLayoutProps, 'variant' | 'slotDirections'>) {
    return (
        <QuizLayout
            {...props}
            titleAlign="center"
            sectionTabs={["Tongue Position", "Lip Shape", "Length"]}
            variant="threeColumns"
        />
    );
}

export function SpellAndTellLayout(props: Omit<QuizLayoutProps, 'variant' | 'slotDirections'>) {
    return (
        <QuizLayout
            {...props}
            variant="twoColumns"
            slotDirections={['column', 'row']}
        />
    );
}

export function PairPlayLayout(props: Omit<QuizLayoutProps, 'variant' | 'slotDirections'>) {
    return (
        <QuizLayout
            {...props}
            variant="stacked"
            slotDirections={['row', 'column', 'row']}
        />
    );
}

export function PhonicTrioLayout(props: Omit<QuizLayoutProps, 'variant' | 'slotDirections'>) {
    return (
        <QuizLayout
            {...props}
            variant="twoColumns"
            slotDirections={['column', 'column']}
        />
    );
}

export default QuizLayout;
