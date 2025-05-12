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
 * Structure:
 *  • Row 1: back button | title | progress bar | next button
 *  • Row 2: quiz section label
 *  • Row 3: content placeholders (1–3), depending on variant
 */
import React from 'react';
import styled, { DefaultTheme, css } from 'styled-components';
import { PageTitle } from '../typography/PageTypography';
import { TonguePositionButtonGroup } from './MenuPresets';
import QuizProgressBar from './Pbar';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Type definitions
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
type HeroGapKey = keyof DefaultTheme['heroGaps']; // "tight" | "normal" | "wide"
type AlignmentType = 'left' | 'center' | 'right';
type FlexAlignmentType = 'flex-start' | 'center' | 'flex-end';

interface QuizLayoutProps {
  title: string;
  titleAlign?: AlignmentType;
  subtitle?: string;
  subtitleAlign?: AlignmentType;
  rowGap?: string | HeroGapKey;
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
    titleAlignment?: AlignmentType;
    progressAlignment?: FlexAlignmentType;
    gridTemplateColumns?: string;
    columnGap?: string;
    titleProgressGap?: string;
    backTitleGap?: string;
    progressNextGap?: string;
  };
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Main Layout Container
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const Wrapper = styled.div<{ rowGap: string }>`
  display: flex;
  flex-direction: column;
  gap: ${({ theme, rowGap }) =>
    rowGap && theme.heroGaps[rowGap as HeroGapKey]
      ? theme.heroGaps[rowGap as HeroGapKey]
      : theme.spacing.large};
  padding: ${({ theme }) => `${theme.spacing.xlarge} ${theme.spacing.xlarge}`};
  background-color: transparent;
  border-radius: ${({ theme }) => theme.borderRadius};
  outline: ${({ theme }) => theme.debug.enabled ? theme.debug.outlines.container : 'none'};
  margin: 0 auto;
  max-width: ${({ theme }) => theme.layout.maxWidth};
  width: 100%;
  
  @media ${({ theme }) => theme.media.mobile.replace('@media ', '')} {
    padding: ${({ theme }) => theme.spacing.large};
  }
`;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Header Row Components
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const HeaderRow = styled.div<{
  $gridTemplateColumns?: string;
  $columnGap?: string;
}>`
  display: grid;
  grid-template-columns: ${({ $gridTemplateColumns }) => $gridTemplateColumns || '100px 1fr 1fr 100px'};
  gap: ${({ theme, $columnGap }) => $columnGap || theme.spacing.medium};
  align-items: center;
  min-height: 80px;
  outline: ${({ theme }) => theme.debug.enabled ? theme.debug.outlines.grid : 'none'};
  justify-content: center;
  column-gap: ${props => props.$columnGap || props.theme.spacing.medium};
  width: 100%;
  margin: 0 auto 1rem;
  padding: 0.5rem 0;
  box-sizing: border-box;
  
  @media ${({ theme }) => theme.media.mobile.replace('@media ', '')} {
    grid-template-columns: auto 1fr auto;
    grid-template-areas: 
      "back title next"
      "progress progress progress";
    row-gap: ${({ theme }) => theme.spacing.medium};
    
    & > *:nth-child(1) { grid-area: back; }
    & > *:nth-child(2) { grid-area: title; }
    & > *:nth-child(3) { grid-area: progress; }
    & > *:nth-child(4) { grid-area: next; }
  }
  
  @media ${({ theme }) => theme.media.tablet.replace('@media ', '')} {
    grid-template-columns: auto 1fr auto auto;
    grid-template-areas: "back title progress next";
    
    & > *:nth-child(1) { grid-area: back; }
    & > *:nth-child(2) { grid-area: title; }
    & > *:nth-child(3) { grid-area: progress; }
    & > *:nth-child(4) { grid-area: next; }
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
    background-color: ${({ theme }) => theme.colors.quizNavigationHover + '22'};
  }
  
  &:active {
    transform: translateY(0);
  }
  
  @media ${({ theme }) => theme.media.mobile.replace('@media ', '')} {
    font-size: ${({ theme }) => theme.fontSizes.md};
    padding: ${({ theme }) => `${theme.spacing.xsmall} ${theme.spacing.small}`};
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
    background-color: ${({ theme }) => theme.colors.quizNavigationHover};
  }
  
  @media ${({ theme }) => theme.media.mobile.replace('@media ', '')} {
    font-size: ${({ theme }) => theme.fontSizes.md};
    padding: ${({ theme }) => `${theme.spacing.xsmall} ${theme.spacing.small}`};
  }
`;

// Special components for threeColumns layout
const GridColumn = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
  
  @media ${({ theme }) => theme.media.mobile.replace('@media ', '')} {
    padding: 10px;
  }
`;

const ButtonColumn = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: 100%;
  padding-left: 10px;
  outline: ${({ theme }) => theme.debug.enabled ? theme.debug.outlines.element : 'none'};
  
  @media ${({ theme }) => theme.media.mobile.replace('@media ', '')} {
    justify-content: center;
    padding-left: 0;
  }
`;

const BackButtonSlot = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  outline: ${({ theme }) => theme.debug.enabled ? theme.debug.outlines.cell : 'none'};
`;

const TitleSlot = styled.div<{
  $alignment: 'left' | 'center' | 'right';
  $width?: string;
}>`
  display: flex;
  justify-content: ${({ $alignment }) =>
    $alignment === 'left' ? 'flex-start' :
      $alignment === 'right' ? 'flex-end' : 'center'
  };
  align-items: center;
  width: ${({ $width }) => $width || '100%'};
  outline: ${({ theme }) => theme.debug.enabled ? theme.debug.outlines.cell : 'none'};
  
  @media ${({ theme }) => theme.media.mobile.replace('@media ', '')} {
    grid-column: 1 / -1;
    justify-content: center;
  }
`;

const ProgressBarSlot = styled.div<{
  $alignment: 'flex-start' | 'center' | 'flex-end';
}>`
  display: flex;
  justify-content: ${({ $alignment }) => $alignment};
  align-items: center;
  outline: ${({ theme }) => theme.debug.enabled ? theme.debug.outlines.cell : 'none'};
  
  @media ${({ theme }) => theme.media.mobile.replace('@media ', '')} {
    grid-column: 1 / -1;
    grid-row: 2;
    justify-content: center;
    margin-top: ${({ theme }) => theme.spacing.small};
  }
`;

const ProgressBarContainer = styled.div<{
  $width?: string;
  $alignment: 'flex-start' | 'center' | 'flex-end';
}>`
  width: ${({ $width }) => $width || '100%'};
  display: flex;
  justify-content: ${({ $alignment }) => $alignment};
  outline: ${({ theme }) => theme.debug.enabled ? theme.debug.outlines.element : 'none'};
`;


const ActionButtonSlot = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  outline: ${({ theme }) => theme.debug.enabled ? theme.debug.outlines.cell : 'none'};
  
  @media ${({ theme }) => theme.media.mobile.replace('@media ', '')} {
    display: none;
  }
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  outline: ${({ theme }) => theme.debug.enabled ? theme.debug.outlines.component : 'none'};
`;

// Update the SectionLabel component
const SectionLabel = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.medium};
  outline: ${({ theme }) => theme.debug.enabled ? theme.debug.outlines.element : 'none'};
  
  @media ${({ theme }) => theme.media.mobile.replace('@media ', '')} {
    font-size: ${({ theme }) => theme.fontSizes.md};
    margin-bottom: ${({ theme }) => theme.spacing.small};
  }
`;


const ContentGrid = styled.div<{ variant: QuizLayoutProps['variant'] }>`
  display: grid;
  width: 100%;
  height: 100%;
  margin: 0 auto;
  outline: ${({ theme }) => theme.debug.enabled ? theme.debug.outlines.grid : 'none'};
    
  ${({ variant, theme }) => {
    switch (variant) {
      case 'twoColumns':
        return twoColumnsLayout;
      case 'threeColumns':
        return threeColumnsLayout;
      case 'stacked':
        return stackedLayout;
      default:
        return 'grid-template-columns: 1fr;';
    }
  }}
`;


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Main QuizLayout Component
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
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
  const gridTemplateColumns = headerConfig.gridTemplateColumns;

  // Determine title alignment
  const titleAlignment = headerConfig.titleAlignment || titleAlign;

  // Determine progress alignment
  const progressAlignment = headerConfig.progressAlignment || 'center';

  return (
    <Wrapper rowGap={rowGap as string}>
      <HeaderRow
        $gridTemplateColumns={gridTemplateColumns}
        $columnGap={headerConfig.columnGap}
      >
        <BackButtonSlot>
          {showBackButton ? <BackButton>Back</BackButton> : null}
        </BackButtonSlot>

        <TitleSlot
          $alignment={titleAlignment}
          $width={headerConfig.titleWidth}
        >
          <LargeQuizTitle>
            {title}
          </LargeQuizTitle>
        </TitleSlot>

        <ProgressBarSlot $alignment={progressAlignment}>
          <ProgressBarContainer
            $width={headerConfig.progressBarWidth}
            $alignment={progressAlignment}
          >
            {progressBar ?? <QuizProgressBar value={0} label="3/3" />}
          </ProgressBarContainer>
        </ProgressBarSlot>

        <ActionButtonSlot>
          {nextButton ?? <NextButton>Next</NextButton>}
        </ActionButtonSlot>
      </HeaderRow>

      <SectionLabel>{quizStageLabel}</SectionLabel>

      <ContentContainer>
        <ContentGrid variant={variant}>
          {variant === 'threeColumns' ? (
            <>
              {/* First column: Grid component with true center alignment */}
              <GridColumn>
                <Slot direction={slotDirections[0] || 'column'} index={0}>
                  {childrenArray[0] || null}
                </Slot>
              </GridColumn>

              {/* Second column: Button group */}
              <ButtonColumn>
                <Slot direction="column" index={1}>
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
              <Slot
                key={idx}
                direction={slotDirections[idx] || 'column'}
                index={idx}
              >
                {child}
              </Slot>
            ))
          )}
        </ContentGrid>
      </ContentContainer>
    </Wrapper>
  );
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Intro Layout Components
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const IntroWrapper = styled.div<{ rowGap?: string }>`
  display: flex;
  flex-direction: column;
  gap: ${({ theme, rowGap }) =>
    rowGap && theme.heroGaps[rowGap as HeroGapKey]
      ? theme.heroGaps[rowGap as HeroGapKey]
      : theme.spacing.large};
  padding: ${({ theme }) => `${theme.spacing.xlarge} ${theme.spacing.xlarge}`};
  background-color: transparent;
  border-radius: ${({ theme }) => theme.borderRadius};
  outline: ${({ theme }) => theme.debug.enabled ? theme.debug.outlines.container : 'none'};
  margin: 0 auto;
  max-width: ${({ theme }) => theme.layout.maxWidth};
  width: 100%;
  font-size: 1.25em;
  
  @media ${({ theme }) => theme.media.mobile.replace('@media ', '')} {
    padding: ${({ theme }) => theme.spacing.large};
    font-size: 1em;
  }
`;

const IntroHeaderRow = styled.div`
  display: grid;
  grid-template-columns: max-content 1fr max-content;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.medium};
  min-height: 120px;
  margin-bottom: 1.5rem;
  
  & > div {
    padding: ${({ theme }) => theme.spacing.small};
    
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
  
  @media ${({ theme }) => theme.media.mobile.replace('@media ', '')} {
    min-height: 80px;
    grid-template-columns: max-content 1fr;
    
    & > div:last-child {
      display: none;
    }
  }
`;

const LargeTitle = styled(PageTitle)`
  font-size: ${({ theme }) => theme.fontSizes.xxxl};
  font-weight: ${({ theme }) => theme.fontWeights.extrabold};
  line-height: 1.2;
  text-align: center;
  margin: 1rem 0;
  
  @media ${({ theme }) => theme.media.mobile.replace('@media ', '')} {
    font-size: ${({ theme }) => theme.fontSizes.xxl};
  }
`;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Quiz Intro Layout Component
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
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
    <IntroWrapper rowGap={rowGap as string}>
      <IntroHeaderRow>
        <div>{showBackButton ? <BackButton>Back</BackButton> : null}</div>
        <div><LargeTitle>{title}</LargeTitle></div>
        <div>{/* Empty slot for balance */}</div>
      </IntroHeaderRow>

      <ContentGrid
        variant={variant}
        style={{
          maxWidth: '1000px',
          margin: '0 auto',
          padding: '1.5rem 0'
        }}
      >
        {childrenArray.map((child, idx) => (
          <Slot
            key={idx}
            direction={slotDirections[idx] || 'column'}
            index={idx}
          >
            {child}
          </Slot>
        ))}
      </ContentGrid>
    </IntroWrapper>
  );
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Preset Layout Components
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// VowelShuffleLayout: Optimized for vowel grid + spectrum + answer box
export function VowelShuffleLayout(props: Omit<QuizLayoutProps, 'variant' | 'slotDirections'>) {
  // Determine progress value based on quiz content and position
  const isTonguePosition = props.quizStageLabel?.includes("Tongue Position");
  let progressValue = 33.33; // Default to 33.33% for Tongue Position (first step)

  if (props.title?.includes("3/3")) {
    progressValue = 100;
  } else if (props.title?.includes("2/3")) {
    progressValue = 66.67;
  }

  // Determine the label
  const progressLabel = isTonguePosition ? "1/3" :
    props.title?.includes("3/3") ? "3/3" :
      props.title?.includes("2/3") ? "2/3" : "1/3";

  // Optimized header config for VowelShuffle
  const headerConfig = {
    titleAlignment: 'left' as const,
    titleWidth: '280px',
    progressBarWidth: '350px',
    progressAlignment: 'flex-start' as const,
    gridTemplateColumns: '100px 280px minmax(200px, 1fr) 100px',
    columnGap: '0.75rem',
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

// SpellAndTellLayout: Two-column layout for spelling exercises
export function SpellAndTellLayout(props: Omit<QuizLayoutProps, 'variant' | 'slotDirections'>) {
  return (
    <QuizLayout
      {...props}
      variant="twoColumns"
      slotDirections={['column', 'row']}
    />
  );
}

// PairPlayLayout: Stacked layout for pair matching exercises
export function PairPlayLayout(props: Omit<QuizLayoutProps, 'variant' | 'slotDirections'>) {
  return (
    <QuizLayout
      {...props}
      variant="stacked"
      slotDirections={['row', 'column', 'row']}
    />
  );
}

// PhonicTrioLayout: Two-column layout for phonics exercises
export function PhonicTrioLayout(props: Omit<QuizLayoutProps, 'variant' | 'slotDirections'>) {
  return (
    <QuizLayout
      {...props}
      variant="twoColumns"
      slotDirections={['column', 'column']}
    />
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Intro Layout Presets
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// VowelShuffleInstructionsGrid: 2x2 grid for instructions with centered button
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
      padding: 1rem;
      
      /* Add transition for hover effects */
      transition: all 0.3s ease;
      
      /* Hover effect */
      &:hover {
        transform: translateY(-5px);
        box-shadow: 0 5px 15px rgba(0,0,0,0.1);
      }
      
      /* Focus effect for accessibility */
      &:focus-within {
        outline: 3px solid ${({ theme }) => theme.colors.primary};
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
  
  /* Responsive adjustments */
  @media ${({ theme }) => theme.media.mobile.replace('@media ', '')} {
    padding: 1rem;
    gap: 2rem;
    
    .instructions-grid {
      grid-template-columns: 1fr;
      grid-template-rows: repeat(4, auto);
      gap: 1.5rem;
    }
    
    .button-row {
      margin-top: 1.5rem;
    }
  }
  
  @media ${({ theme }) => theme.media.tablet.replace('@media ', '')} {
    .instructions-grid {
      gap: 1.5rem;
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
 * 
 * Example 1: Default VowelShuffleLayout
 * ```tsx
 * <VowelShuffleLayout
 *   title="Vowel Shuffle 1/3"
 *   quizStageLabel="Tongue Position"
 * >
 *   <VowelGrid />
 * </VowelShuffleLayout>
 * ```
 * 
 * Example 2: Two-column layout with custom header
 * ```tsx
 * <QuizLayout
 *   title="Minimal Pairs"
 *   quizStageLabel="Listen and Choose"
 *   variant="twoColumns"
 *   slotDirections={['column', 'row']}
 *   headerConfig={{
 *     titleAlignment: 'left',
 *     titleWidth: '300px',
 *     progressBarWidth: '250px',
 *     gridTemplateColumns: '100px 300px minmax(250px, 1fr) 100px'
 *   }}
 * >
 *   <AudioPlayer />
 *   <AnswerOptions />
 * </QuizLayout>
 * ```
 * 
 * Example 3: Intro layout with instructions
 * ```tsx
 * <VowelShuffleIntroLayout title="Vowel Shuffle Instructions">
 *   <>
 *     <InstructionBox>Step 1: Listen to the vowel sound</InstructionBox>
 *     <InstructionBox>Step 2: Find the vowel on the grid</InstructionBox>
 *     <InstructionBox>Step 3: Select the correct tongue position</InstructionBox>
 *     <InstructionBox>Step 4: Submit your answer</InstructionBox>
 *   </>
 *   <Button>Start Exercise</Button>
 * </VowelShuffleIntroLayout>
 * ```
 */
