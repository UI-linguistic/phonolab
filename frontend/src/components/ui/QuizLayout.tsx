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
import styled, { DefaultTheme, keyframes } from 'styled-components';
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

// Add subtle pulse animation for instruction boxes
const pulseAnimation = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.05);
  }
  70% {
    box-shadow: 0 0 0 8px rgba(0, 0, 0, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
  }
`;

// Add focused outline animation for accessibility
const focusAnimation = keyframes`
  0% {
    outline-offset: 0px;
  }
  50% {
    outline-offset: 4px;
  }
  100% {
    outline-offset: 0px;
  }
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
                <div>{progressBar ?? <QuizProgressBar value={0} label="3/3" />}</div>
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

// ────────────────────────────────────────────────────────────
// Simplified Intro Layout with minimal header (just back button and title)
// ────────────────────────────────────────────────────────────

const IntroWrapper = styled.div<{ rowGap?: string }>`
  display: flex;
  flex-direction: column;
  gap: ${({ theme, rowGap }) =>
        rowGap
            ? theme.heroGaps[rowGap as HeroGapKey]
            : theme.spacing.large
    };
  padding: ${({ theme }) => `${theme.spacing.xlarge} ${theme.spacing.xlarge}`};
  background-color: transparent;
  border-radius: ${({ theme }) => theme.borderRadius};
  outline: ${({ theme }) => theme.debugOutline ? `2px dashed ${theme.colors.secondary}` : 'none'};
  margin: 0 auto;
  max-width: 90%;
  
  /* Increase text size for all children */
  font-size: 1.25em;
`;

const IntroHeaderRow = styled.div`
  display: grid;
  grid-template-columns: max-content 1fr max-content;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.medium};
  outline: 2px dashed ${({ theme }) => theme.colors.secondary};
  min-height: 120px;
  margin-bottom: 1.5rem;

  & > div {
    padding: ${({ theme }) => theme.spacing.small};
    outline: 2px dashed ${({ theme }) => theme.colors.secondary};
    
    /* First and third div should have equal width */
    &:first-child, &:last-child {
      width: 6rem;
      display: flex;
      justify-content: center;
    }
    
    /* Center div that contains the title */
    &:nth-child(2) {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
    }
  }
`;

const LargeTitle = styled(PageTitle)`
  font-size: ${({ theme }) => theme.fontSizes.xxxl};
  font-weight: ${({ theme }) => theme.fontWeights.extrabold};
  line-height: 1.2;
  text-align: center;
  margin: 1rem 0;
`;

// Base layout for instruction/intro pages with simpler header
const QuizIntroLayout: React.FC<Omit<QuizLayoutProps, 'quizStageLabel' | 'progressBar' | 'nextButton'>> = ({
    title,
    showBackButton = true,
    variant = 'stacked',
    slotDirections = [],
    children,
    titleAlign = 'center',
    rowGap = 'normal',
    ...props
}) => {
    const childrenArray = React.Children.toArray(children);

    return (
        <IntroWrapper rowGap={rowGap}>
            <IntroHeaderRow>
                <div>{showBackButton ? 'Back' : null}</div>
                <div><LargeTitle>{title}</LargeTitle></div>
                <div>{/* Empty slot for balance - same width as back button */}</div>
            </IntroHeaderRow>

            <ContentGrid
                variant={variant}
                style={{
                    maxWidth: '1000px',
                    margin: '0 auto 0',
                    padding: '1.5rem 0'
                }}
            >
                {childrenArray.map((child, idx) => (
                    <Slot key={idx} direction={slotDirections[idx] || 'column'}>
                        {child}
                    </Slot>
                ))}
            </ContentGrid>
        </IntroWrapper>
    );
};

// ────────────────────────────────────────────────────────────
// Quiz Intro Layout Presets
// ────────────────────────────────────────────────────────────

// Custom grid for VowelShuffleIntro with 2x2 instructions and centered button at bottom
const VowelShuffleInstructionsGrid = styled.div`
  display: grid;
  grid-template-rows: auto auto;
  gap: 3rem;
  width: 100%;
  max-width: 800px;
  margin: 1rem auto;
  padding: 1.5rem 2rem 2.5rem;
  
  /* First row: 2x2 grid for instructions */
  .instructions-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    gap: 2.5rem;
    width: 100%;
    
    /* Add border to all direct children (instruction boxes) */
    & > * {
      border: 2px solid black;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      
      /* Apply the animation to each instruction box with a different delay */
      animation: ${pulseAnimation} 4s infinite;
      animation-play-state: paused;
      transform-origin: center;
      
      /* Only play animation on hover */
      &:hover {
        animation-play-state: running;
      }
      
      /* Add special focus outline for accessibility */
      &:focus-within {
        outline: 3px solid ${({ theme }) => theme.colors.primary};
        animation: ${focusAnimation} 1.5s infinite;
      }
      
      /* Stagger the animation for each box */
      &:nth-child(1) {
        animation-delay: 0s;
      }
      
      &:nth-child(2) {
        animation-delay: 0.5s;
      }
      
      &:nth-child(3) {
        animation-delay: 1s;
      }
      
      &:nth-child(4) {
        animation-delay: 1.5s;
      }
    }
  }
  
  /* Second row: centered button */
  .button-row {
    display: flex;
    justify-content: center;
    margin-top: 2rem;
    width: 100%;
    
    /* Add subtle hover effect to button */
    & > * {
      transition: all 0.3s ease;
      
      &:hover {
        transform: translateY(-3px);
        box-shadow: 0 6px 12px rgba(0,0,0,0.1);
      }
    }
  }
`;

// VowelShuffleIntroLayout: Custom layout with 2x2 instruction grid and centered start button
export function VowelShuffleIntroLayout(props: Omit<QuizLayoutProps, 'variant' | 'slotDirections' | 'quizStageLabel'>) {
    return (
        <QuizIntroLayout
            {...props}
            titleAlign="center"
            variant="stacked"
            slotDirections={['column']}
        >
            <VowelShuffleInstructionsGrid>
                <div className="instructions-grid">
                    {/* We're expecting the first child to be a fragment or array with 4 instruction boxes */}
                    {props.children && React.Children.toArray(props.children)[0]}
                </div>
                <div className="button-row">
                    {/* We're expecting the second child to be the start button */}
                    {props.children && React.Children.toArray(props.children)[1]}
                </div>
            </VowelShuffleInstructionsGrid>
        </QuizIntroLayout>
    );
}

// MinimalPairsIntroLayout: 2-column layout with instructions and examples
export function MinimalPairsIntroLayout(props: Omit<QuizLayoutProps, 'variant' | 'slotDirections' | 'quizStageLabel'>) {
    return (
        <QuizIntroLayout
            {...props}
            titleAlign="center"
            variant="twoColumns"
            slotDirections={['column', 'column']}
        >
            {props.children}
        </QuizIntroLayout>
    );
}

export default QuizLayout;
