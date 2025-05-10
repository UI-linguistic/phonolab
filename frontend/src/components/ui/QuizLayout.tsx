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
import styled from 'styled-components';
import { PageTitle } from '../typography/PageTypography';

interface QuizLayoutProps {
    title: string;
    quizStageLabel: string;
    showBackButton?: boolean;
    nextButton?: React.ReactNode;
    progressBar?: React.ReactNode;
    variant?: 'twoColumns' | 'threeColumns' | 'stacked';
    slotDirections?: ('row' | 'column')[];
    children: React.ReactNode;
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.large};
  padding: ${({ theme }) => theme.spacing.large};
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
}) => {
    const childrenArray = React.Children.toArray(children);

    return (
        <Wrapper>
            <HeaderRow>
                <div>{showBackButton ? 'Back' : null}</div>
                <div><SmallTitle>{title}</SmallTitle></div>
                <div>{progressBar ?? 'Progress'}</div>
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
            variant="threeColumns"
            slotDirections={['column', 'column', 'column']}
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
