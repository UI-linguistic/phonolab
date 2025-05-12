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
import { MenuList } from './Menu';
import MenuPresets, { SubmitResetGroup, TonguePositionButtonGroup } from './MenuPresets';

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
    onSubmit?: () => void;
    onReset?: () => void;
    headerConfig?: {
        titleWidth?: string;
        progressBarWidth?: string;
        titleAlignment?: 'left' | 'center' | 'right';
        progressAlignment?: 'flex-start' | 'center' | 'flex-end';
        gridTemplateColumns?: string;
        columnGap?: string;
        titleProgressGap?: string;
        backTitleGap?: string;
        progressNextGap?: string;
        centerProgressBar?: boolean;
    };
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

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// HEADER ROW CONFIGURATION
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// The HeaderRow is a grid with 4 columns by default:
// [back button] [title] [progress bar] [next button]
// This can be customized using the $gridTemplateColumns prop
const HeaderRow = styled.div<{
    $gridTemplateColumns?: string;
    $columnGap?: string;
    $titleProgressGap?: string;
    $backTitleGap?: string;
    $progressNextGap?: string;
}>`
  /* 1. Grid layout for the header elements */
  display: grid;
  
  /* 2. CRITICAL: This defines the width of each column in the header */
  /* You can adjust this through headerConfig.gridTemplateColumns */
  grid-template-columns: ${props => props.$gridTemplateColumns || '100px 1fr 400px 100px'};
  
  /* 3. Vertical alignment of elements */
  align-items: center;
  
  /* 4. Horizontal centering of the entire header row */
  justify-content: center;
  
  /* 5. Space between columns - configurable through headerConfig */
  column-gap: ${props => props.$columnGap || props.theme.spacing.medium};
  
  /* 6. Visual styling */
  outline: ${({ theme }) => theme.debugOutline ? `2px dashed ${theme.colors.secondary}` : 'none'};
  
  /* 7. CRITICAL: This centers the header row on the page */
  width: 100%;
  max-width: 1100px;
  margin: 0 auto 1rem;
  padding: 0.5rem 0;

  /* Custom column gap settings using CSS Grid */
  & > *:nth-child(1) {
    margin-right: ${props => props.$backTitleGap || '0'};
  }
  
  & > *:nth-child(2) {
    margin-right: ${props => props.$titleProgressGap || '0'};
  }
  
  & > *:nth-child(3) {
    margin-right: ${props => props.$progressNextGap || '0'};
  }
`;

// Create named styled components for each slot in the header row
const BackButtonSlot = styled.nav`
  justify-content: flex-start;
  padding: ${({ theme }) => theme.spacing.small};
  display: flex;
  align-items: center;
  outline: ${({ theme }) => theme.debugOutline ? `2px dashed ${theme.colors.secondary}` : 'none'};
`;

const TitleSlot = styled.header`
  justify-content: inherit;
  padding: ${({ theme }) => theme.spacing.small};
  display: flex;
  align-items: center;
  outline: ${({ theme }) => theme.debugOutline ? `2px dashed ${theme.colors.secondary}` : 'none'};
`;

const ProgressBarSlot = styled.section<{ $alignment?: 'flex-start' | 'center' | 'flex-end' }>`
  justify-content: ${props => props.$alignment || 'center'};
  padding: ${({ theme }) => theme.spacing.small};
  display: flex;
  align-items: center;
  outline: ${({ theme }) => theme.debugOutline ? `2px dashed ${theme.colors.secondary}` : 'none'};
`;

const ActionButtonSlot = styled.nav`
  justify-content: flex-end;
  padding: ${({ theme }) => theme.spacing.small};
  display: flex;
  align-items: center;
  outline: ${({ theme }) => theme.debugOutline ? `2px dashed ${theme.colors.secondary}` : 'none'};
`;

const LargeQuizTitle = styled(PageTitle) <{ align?: 'left' | 'center' | 'right' }>`
  font-size: ${({ theme }) => theme.fontSizes.xxl};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  margin: 0;
  padding: 0.5rem 0;
  text-align: ${props => props.align || 'left'};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  outline: ${({ theme }) => theme.debugOutline ? `2px dashed ${theme.colors.secondary}` : 'none'};
`;

const SectionLabel = styled.div`
  font-weight: bold;
  font-size: ${({ theme }) => theme.fontSizes.xl};
  text-align: center;
  margin: 1rem auto 1.5rem;
  padding: ${({ theme }) => theme.spacing.medium};
  width: 100%;
  max-width: 800px;
  outline: ${({ theme }) => theme.debugOutline ? `2px dashed ${theme.colors.secondary}` : 'none'};
`;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PROGRESS BAR CONTAINER
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// This container is placed in the third column of the HeaderRow grid
// It uses multiple techniques to ensure perfect centering:
const ProgressBarContainer = styled.div<{
    $width?: string;
    $centerProgressBar?: boolean;
    $alignment?: 'flex-start' | 'center' | 'flex-end';
}>`
  /* 1. Width of the progress bar itself - configurable via headerConfig */
  width: ${props => props.$width || '400px'};
  
  /* 2. Height of the container */
  height: 16px;
  
  /* 3. Centers the progress bar horizontally within its own container */
  margin: ${props => props.$alignment === 'flex-start' ? '0' :
        props.$alignment === 'flex-end' ? '0 0 0 auto' : '0 auto'};
  
  /* 4. Styling properties */
  transform-origin: center;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  
  /* Visual debugging outline */
  outline: ${({ theme }) => theme.debugOutline ? `2px dashed ${theme.colors.secondary}` : 'none'};
  
  /* 5. CRITICAL FOR CENTERING: This 3-property combo ensures perfect centering */
  /* These properties shift the progress bar to the exact center, even if the */
  /* containing column is wider than the progress bar itself */
  /* This can now be toggled on/off with the centerProgressBar config */
  position: ${props => props.$centerProgressBar !== false ? 'relative' : 'static'};
  left: ${props => props.$centerProgressBar !== false ? '50%' : 'auto'};
  transform: ${props => props.$centerProgressBar !== false ? 'translateX(-50%)' : 'none'};
`;

// This is a wrapper that will be used in the QuizLayout component
// to ensure outline visibility while maintaining positioning
const ProgressBarWrapper = styled.div<{ $alignment?: 'flex-start' | 'center' | 'flex-end' }>`
  position: relative;
  outline: ${({ theme }) => theme.debugOutline ? `2px dashed red` : 'none'};
  height: 16px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: ${props => props.$alignment || 'center'};
`;

const ContentContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  margin: 0 auto;
  padding: 0;
  outline: ${({ theme }) => theme.debugOutline ? `2px dashed ${theme.colors.secondary}` : 'none'};  
`;

const ContentGrid = styled.div<{ variant: QuizLayoutProps['variant'] }>`
  display: grid;
  width: 100%;
  height: 100%;
  margin: 0 auto;
  max-width: 850px;
  ${({ variant }) => {
        switch (variant) {
            case 'twoColumns':
                return 'grid-template-columns: 1fr 1fr; gap: 2rem;';
            case 'threeColumns':
                return 'grid-template-columns: 3fr 1fr; gap: 2.5rem; align-items: center;';
            case 'stacked':
                return 'grid-template-rows: repeat(3, auto); gap: 2rem;';
            default:
                return 'grid-template-columns: 1fr;';
        }
    }}
  outline: ${({ theme }) => theme.debugOutline ? `2px dashed ${theme.colors.secondary}` : 'none'};
`;

const GridColumn = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
  outline: ${({ theme }) => theme.debugOutline ? `2px dashed ${theme.colors.secondary}` : 'none'};
`;

const ButtonColumn = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: 100%;
  padding-left: 10px;
  outline: ${({ theme }) => theme.debugOutline ? `2px dashed ${theme.colors.secondary}` : 'none'};
`;

const Slot = styled.div<{ direction: 'row' | 'column' }>`
  display: flex;
  flex-direction: ${({ direction }) => direction};
  width: 100%;
  height: 100%;
  outline: ${({ theme }) => theme.debugOutline ? `2px dashed ${theme.colors.secondary}` : 'none'};
  
  /* Center content by default */
  align-items: center;
  justify-content: center;
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

const BackButton = styled.button`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  padding: ${({ theme }) => `${theme.spacing.small} ${theme.spacing.medium}`};
  background-color: transparent;
  border: 2px solid ${({ theme }) => theme.colors.secondary};
  border-radius: ${({ theme }) => theme.borderRadius};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.secondary + '22'};
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const NextButton = styled.button`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  padding: ${({ theme }) => `${theme.spacing.small} ${theme.spacing.medium}`};
  background-color: ${({ theme }) => theme.colors.secondary};
  color: white;
  border: 2px solid ${({ theme }) => theme.colors.black};
  border-radius: ${({ theme }) => theme.borderRadius};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: none;
  }
`;


// Customizable title container
const TitleContainer = styled.div<{ $alignment?: 'left' | 'center' | 'right', $width?: string }>`
  display: flex;
  justify-content: ${props => {
        switch (props.$alignment) {
            case 'left': return 'flex-start';
            case 'right': return 'flex-end';
            default: return 'center';
        }
    }};
  width: ${props => props.$width || '100%'};
  text-align: ${props => props.$alignment || 'center'};
  outline: ${({ theme }) => theme.debugOutline ? `2px dashed ${theme.colors.secondary}` : 'none'};
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
    activeTabIndex = 0,
    onTabSelect,
    titleAlign = 'left',
    subtitle,
    subtitleAlign = 'left',
    rowGap = 'normal',
    onSubmit = () => console.log('Submit clicked'),
    onReset = () => console.log('Reset clicked'),
    headerConfig = {},
    ...props
}) => {
    const childrenArray = React.Children.toArray(children);

    // Determine grid template based on headerConfig or default
    const gridTemplateColumns = headerConfig.gridTemplateColumns || '100px 1fr 400px 100px';

    // Determine title alignment
    const titleAlignment = headerConfig.titleAlignment || titleAlign;

    // Extract spacing configurations
    const columnGap = headerConfig.columnGap;
    const titleProgressGap = headerConfig.titleProgressGap;
    const backTitleGap = headerConfig.backTitleGap;
    const progressNextGap = headerConfig.progressNextGap;
    const centerProgressBar = headerConfig.centerProgressBar;
    const progressAlignment = headerConfig.progressAlignment || 'center';

    return (
        <Wrapper>
            <HeaderRow
                $gridTemplateColumns={gridTemplateColumns}
                $columnGap={columnGap}
                $titleProgressGap={titleProgressGap}
                $backTitleGap={backTitleGap}
                $progressNextGap={progressNextGap}
            >
                <BackButtonSlot>
                    {showBackButton ? <BackButton>Back</BackButton> : null}
                </BackButtonSlot>

                <TitleSlot>
                    <TitleContainer $alignment={titleAlignment} $width={headerConfig.titleWidth}>
                        <LargeQuizTitle align={titleAlignment}>{title}</LargeQuizTitle>
                    </TitleContainer>
                </TitleSlot>

                <ProgressBarSlot $alignment={progressAlignment}>
                    <ProgressBarWrapper $alignment={progressAlignment}>
                        <ProgressBarContainer
                            $width={headerConfig.progressBarWidth}
                            $centerProgressBar={centerProgressBar}
                            $alignment={progressAlignment}
                        >
                            {progressBar ?? <QuizProgressBar value={0} label="3/3" />}
                        </ProgressBarContainer>
                    </ProgressBarWrapper>
                </ProgressBarSlot>

                <ActionButtonSlot>
                    {nextButton ?? <NextButton>Next</NextButton>}
                </ActionButtonSlot>
            </HeaderRow>

            <SectionLabel>{quizStageLabel}</SectionLabel>

            <ContentContainer>
                <ContentGrid variant={variant}>
                    {/* For "threeColumns" variant (VowelShuffle), create a specific layout with exactly two columns */}
                    {variant === 'threeColumns' ? (
                        <>
                            {/* First column: Grid component with true center alignment */}
                            <GridColumn>
                                <Slot direction={slotDirections[0] || 'column'}>
                                    {childrenArray[0] || null}
                                </Slot>
                            </GridColumn>

                            {/* Second column: Button group */}
                            <ButtonColumn>
                                <Slot direction="column">
                                    <TonguePositionButtonGroup
                                        onSubmit={onSubmit}
                                        onReset={onReset}
                                    />
                                </Slot>
                            </ButtonColumn>
                        </>
                    ) : (
                        // Default handling for other layouts
                        childrenArray.map((child, idx) => (
                            <Slot key={idx} direction={slotDirections[idx] || 'column'}>
                                {child}
                            </Slot>
                        ))
                    )}
                </ContentGrid>
            </ContentContainer>
        </Wrapper>
    );
};

// Preset wrappers for quiz modules with visual debugging outlines

export function VowelShuffleLayout(props: Omit<QuizLayoutProps, 'variant' | 'slotDirections'>) {
    // Determine progress value based on quiz content and position
    // Tongue Position corresponds to 1/3 (33.33%)
    const isTonguePosition = props.quizStageLabel?.includes("Tongue Position");

    // Default to 33.33% for Tongue Position (first step)
    let progressValue = 33.33;

    if (props.title?.includes("3/3")) {
        progressValue = 100;
    } else if (props.title?.includes("2/3")) {
        progressValue = 66.67;
    }

    // Determine the label
    const progressLabel = isTonguePosition ? "1/3" :
        props.title?.includes("3/3") ? "3/3" :
            props.title?.includes("2/3") ? "2/3" : "1/3";

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // HEADER ROW CONFIGURATION
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // Optimized layout for Vowel Shuffle with progress bar with label on right

    const headerConfig = {
        // Title config
        titleAlignment: 'left' as const,
        titleWidth: '180px',  // Reduced width for title to create more room

        // Progress bar config - reduced width to accommodate label on right
        progressBarWidth: '350px',
        progressAlignment: 'flex-start' as const,  // Left-align progress bar in its slot

        // Grid layout adjusted to provide adequate space for progress bar + label
        gridTemplateColumns: '100px 180px 1fr 100px',

        // Gap controls
        columnGap: '0.75rem',        // Increased to give better spacing
        titleProgressGap: '0.65rem',  // Small gap between title and progress bar

        // No transform centering since we're using flex-start alignment
        centerProgressBar: false
    };

    return (
        <QuizLayout
            {...props}
            titleAlign="left"
            variant="threeColumns"
            slotDirections={['column', 'column']}
            rowGap="normal"
            headerConfig={headerConfig}
            progressBar={
                <QuizProgressBar
                    value={progressValue}
                    label={progressLabel}
                    labelOnRight={true}
                />
            }
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

/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * USAGE EXAMPLES
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * These examples demonstrate different ways to use the flexible configuration
 * system to achieve different layouts.
 *
 * Example 1: Default VowelShuffleLayout with optimal spacing
 * - Use the VowelShuffleLayout component directly
 * - Pass title and quizStageLabel props
 * - The component applies the optimized header layout automatically
 *
 * Example 2: Custom alignment with wider title area
 * - Use QuizLayout with threeColumns variant
 * - Configure headerConfig with:
 *   - titleAlignment: 'left'
 *   - titleWidth: '300px'
 *   - gridTemplateColumns: '100px 300px minmax(300px, 1fr) 100px'
 *   - columnGap: '0.25rem' for minimal gaps
 *   - titleProgressGap: '0' to remove gap after title
 *
 * Example 3: Completely custom spacing
 * - Define a custom headerConfig object
 * - Customize all spacing parameters:
 *   - Smaller elements: titleWidth, progressBarWidth
 *   - Custom grid layout: gridTemplateColumns
 *   - Fine-tuned gaps: backTitleGap, titleProgressGap, progressNextGap
 *   - Disable transform centering: centerProgressBar: false
 */
