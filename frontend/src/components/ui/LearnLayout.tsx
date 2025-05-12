/**
 * LearnLayout.tsx
 *
 * Page-level layout system for Learn module screens.
 * Handles consistent layout structure across all Learn experiences.
 *
 * Variants (`variant` prop):
 *  - single:       Single full-width section
 *  - twoColumns:   Two side-by-side containers (50/50)
 *  - threeColumns: Three equal-width sections
 *  - multiRows:    Three stacked full-width containers
 *
 * Slot direction control (`slotDirections` prop):
 *  • Accepts an array like ['row', 'column', 'row'] to control flex direction
 *    of each content slot (child). Defaults to 'column' per slot.
 *  • New 'freeform' option allows custom positioning with flexbox
 *
 * Key behaviors:
 *  • Renders a title row with optional back and next buttons
 *  • Optional subtitle and tab menu
 *  • Dashed outlines for all major regions to aid visual layout during development
 *  • Each child is wrapped in a SlotWrapper, where flex direction is applied
 *
 * Props:
 *  • title:             string                     — main heading (required)
 *  • subtitle?:         string                     — optional subtitle
 *  • showBackButton?:   boolean                    — whether to show back button placeholder
 *  • additionalButton?: ReactNode                  — optional custom button in title row
 *  • nextButton?:       ReactNode                  — optional 'next' button or placeholder
 *  • sectionTabs?:      string[]                   — tab labels (horizontal menu under title)
 *  • activeTabIndex?:   number                     — which tab is currently active
 *  • onTabSelect?:      (i: number) => void        — called when a tab is clicked
 *  • variant?:          'single' | 'twoColumns' |
 *                       'threeColumns' | 'multiRows' — layout style for content slots
 *  • slotDirections?:   ('row' | 'column' | 'grid' | 'freeform')[]  — flex direction for each child slot
 *  • slotStyles?:       Record<string | number, React.CSSProperties> — custom styles for slots when using freeform
 *  • children:          ReactNode[]                — each becomes a content slot
 *
 * Usage example:
 *  <TackleMinimalPairsLayout
 *    title="Tackle Minimal Pairs"
 *    subtitle="Minimal pairs differ by only one phoneme."
 *    slotDirections={['column', 'row']}
 *  >
 *    <div>Audio section</div>
 *    <div>Word pair cards</div>
 *  </TackleMinimalPairsLayout>
 */

import React from 'react';
import styled, { DefaultTheme } from 'styled-components';
import { LayoutTitle, LayoutSubtitle } from '../typography/PageTypography';
import { MenuList } from './Menu';

interface CustomCSSProperties extends React.CSSProperties {
    [key: string]: any;
}

interface LearnLayoutProps {
    title: string;
    titleAlign?: 'left' | 'center' | 'right';
    subtitle?: string;
    subtitleAlign?: 'left' | 'center' | 'right';
    rowGap?: string | keyof DefaultTheme['heroGaps'];
    showBackButton?: boolean;
    additionalButton?: React.ReactNode;
    nextButton?: React.ReactNode;
    sectionTabs?: string[];
    activeTabIndex?: number;
    onTabSelect?: (index: number) => void;
    variant?: 'single' | 'twoColumns' | 'threeColumns' | 'multiRows';
    slotDirections?: ('row' | 'column' | 'grid' | 'freeform')[];
    slotStyles?: Record<string | number, CustomCSSProperties>;
    children: React.ReactNode;
}

type HeroGapKey = keyof DefaultTheme['heroGaps']; // "tight" | "normal" | "wide"

interface LayoutWrapperProps {
    /** one of theme.heroGaps: "tight", "normal", or "wide" */
    rowGap?: HeroGapKey;
}

const LayoutWrapper = styled.div<{ rowGap?: string }>`
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


const TopRowWrapper = styled.div`
  /* 1. Fill the parent */
  width: 100%;
  max-width: 100%;
  min-width: 0; /* allow it to shrink properly */

  display: grid;
  /* 2. Three columns: auto | flex‑fill | auto */
  grid-template-columns: auto 1fr auto;
  column-gap: ${({ theme }) => theme.spacing.small};

  justify-items: start; /* default for slot 1 */
  align-items: center;

  outline: ${({ theme }) =>
        theme.debugOutline ? `2px dashed ${theme.colors.secondary}` : "none"};

  & > div {
    min-width: 0;
    padding: ${({ theme }) => theme.spacing.small};
    outline: ${({ theme }) =>
        theme.debugOutline ? `2px dashed ${theme.colors.secondary}` : "none"};
  }

  /* square back + next button slots */
  & > div:nth-child(1),
  & > div:nth-child(3) {
    width: ${({ theme }) => theme.spacing.xlarge};
    aspect-ratio: 1 / 1;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  /* child 1: left edge margin */
  & > div:nth-child(1) {
    justify-self: start;
    margin-left: ${({ theme }) => theme.spacing.small};
  }

  /* center title slot: centered */
  & > div:nth-child(2) {
    width: 100%;
    justify-self: center;
    text-align: center;
    display: inline-block;
  }

  /* child 3: right edge margin + hug right */
  & > div:nth-child(3) {
    justify-self: end;
    margin-right: ${({ theme }) => theme.spacing.small};
  }
`;

const SubtitleWrapper = styled.div`
  outline: ${({ theme }) => theme.debugOutline ? `2px dashed ${theme.colors.secondary}` : 'none'};
`;

const SectionTabsWrapper = styled.div`
  margin-top: 1.5rem;
  outline: ${({ theme }) => theme.debugOutline ? `2px dashed ${theme.colors.secondary}` : 'none'};
`;

const ContentWrapper = styled.div<{ $variant?: LearnLayoutProps['variant'] }>`
  margin-top: 1.5rem;
  display: grid;
  ${({ $variant }) => {
        switch ($variant) {
            case 'twoColumns':
                return 'grid-template-columns: 1fr 1fr; gap: 2rem;';
            case 'threeColumns':
                return 'grid-template-columns: minmax(200px, 0.8fr) minmax(400px, 1.5fr) minmax(250px, 1fr); gap: 2.8rem;';
            case 'multiRows':
                return 'grid-template-rows: repeat(3, auto); gap: 2rem;';
            default:
                return 'grid-template-columns: 1fr;';
        }
    }}
  outline: ${({ theme }) => theme.debugOutline ? `2px dashed ${theme.colors.secondary}` : 'none'};
`;

interface SlotWrapperProps {
    direction: 'row' | 'column' | 'grid' | 'freeform';
    $variant?: string;
    style?: React.CSSProperties;
}

const SlotWrapper = styled.div<SlotWrapperProps>`
  ${({ direction, style }) => {
        if (direction === 'freeform') {
            return `
        display: flex;
        flex-wrap: wrap;
        align-items: flex-start;
        align-content: flex-start;
        justify-content: flex-start;
      `;
        } else {
            return `
        display: ${direction === 'grid' ? 'grid' : 'flex'};
        flex-direction: ${direction === 'grid' ? undefined : direction};
        grid-template-columns: ${direction === 'grid' ? 'repeat(3, 1fr)' : undefined};
        gap: ${direction === 'grid' ? '0.5rem' : '1rem'};
      `;
        }
    }}
  outline: ${({ theme }) => theme.debugOutline ? `2px dashed ${theme.colors.secondary}` : 'none'};
  padding: ${({ theme, $variant }) => $variant === 'vowels101' ? `${theme.spacing.small} ${theme.spacing.xsmall}` : theme.spacing.small};
  border-radius: ${({ theme }) => theme.borderRadius};
`;

// Wrapper for individual items inside a freeform SlotWrapper
const FreeformItemWrapper = styled.div<{ $customStyle?: React.CSSProperties }>`
  ${({ $customStyle }) => $customStyle ? Object.entries($customStyle).map(([key, value]) => `${key}: ${value};`).join('\n') : ''}
`;

const LearnLayout: React.FC<LearnLayoutProps> = ({
    title,
    titleAlign = 'left',
    subtitle,
    subtitleAlign = 'left',
    showBackButton = true,
    additionalButton,
    nextButton,
    sectionTabs,
    activeTabIndex = 0,
    onTabSelect,
    variant = 'single',
    slotDirections = [],
    slotStyles = {},
    children,
    rowGap,
}) => {
    const contentArray = React.Children.toArray(children).flatMap(child => {
        if (
            React.isValidElement(child) &&
            child.type === React.Fragment
        ) {
            return React.Children.toArray(child.props.children);
        }
        return [child];
    });

    return (
        <LayoutWrapper rowGap={rowGap}>
            <TopRowWrapper>
                <div>{showBackButton ? 'Back button placeholder' : null}</div>
                <div><LayoutTitle align={titleAlign}>{title}</LayoutTitle></div>
                <div>{nextButton ?? 'Next button placeholder'}</div>
            </TopRowWrapper>

            {subtitle && (
                <SubtitleWrapper>
                    <LayoutSubtitle align={subtitleAlign}>{subtitle}</LayoutSubtitle>
                </SubtitleWrapper>
            )}

            {sectionTabs && (
                <SectionTabsWrapper>
                    <MenuList
                        items={sectionTabs}
                        orientation="horizontal"
                        size="md"
                        activeIndex={activeTabIndex}
                        onSelect={onTabSelect}
                        horizontalPadding="1rem"
                        buttonWidth="220px"
                        itemGap="5rem"
                        textWeight="bold"
                    />
                </SectionTabsWrapper>
            )}

            <ContentWrapper $variant={variant}>
                {contentArray.map((child, idx) => {
                    const direction = slotDirections[idx] || 'column';

                    // If this is a freeform layout and we have children as an array
                    if (direction === 'freeform' && React.isValidElement(child) && child.props.children) {
                        const freeformChildren = React.Children.toArray(child.props.children);

                        return (
                            <SlotWrapper
                                key={idx}
                                direction="freeform"
                                $variant={variant === 'threeColumns' && title.includes('Vowels are organized') ? 'vowels101' : undefined}
                            >
                                {freeformChildren.map((freeformChild, freeformIdx) => (
                                    <FreeformItemWrapper
                                        key={freeformIdx}
                                        $customStyle={slotStyles && slotStyles[`${idx}-${freeformIdx}`]}
                                    >
                                        {freeformChild}
                                    </FreeformItemWrapper>
                                ))}
                            </SlotWrapper>
                        );
                    }

                    // Regular slot wrapper
                    return (
                        <SlotWrapper
                            key={idx}
                            direction={direction}
                            $variant={variant === 'threeColumns' && title.includes('Vowels are organized') ? 'vowels101' : undefined}
                            style={slotStyles && slotStyles[idx]}
                        >
                            {child}
                        </SlotWrapper>
                    );
                })}
            </ContentWrapper>
        </LayoutWrapper>
    );
};

// Preset wrappers for Learn modules

export function Vowels101Layout(props: Omit<LearnLayoutProps, 'variant' | 'sectionTabs'>) {
    // Default styles for the Vowels 101 layout that match the image
    const defaultSlotStyles: Record<string | number, CustomCSSProperties> = {
        // Left column custom styles
        0: {
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
            justifyContent: 'center',
            alignItems: 'flex-start',
            minWidth: '360px',
            maxWidth: '390px',
            flexShrink: 0,
            padding: '1rem 0.5rem'
        },
        // Middle column (vowel grid) custom styles  
        1: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            flexGrow: 1,
            width: '100%',
            padding: '0 1rem'
        },
        // Right column (tongue diagram) custom styles
        2: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            alignItems: 'center',
            flexShrink: 1,
            minWidth: '300px',
            height: '100%',
            padding: '1rem 0.5rem'
        }
    };

    return (
        <LearnLayout
            {...props}
            rowGap="tight"
            titleAlign="center"
            sectionTabs={["Tongue Position", "Lip Shape", "Length"]}
            variant="threeColumns"
            slotDirections={['column', 'column', 'column']}
            slotStyles={props.slotStyles ? { ...defaultSlotStyles, ...props.slotStyles } : defaultSlotStyles}
        />
    );
}

export function TackleMinimalPairsLayout(props: Omit<LearnLayoutProps, 'variant'>) {
    return <LearnLayout {...props} variant="twoColumns" />;
}

export function GetYourGraphemesLayout(props: Omit<LearnLayoutProps, 'variant'>) {
    return <LearnLayout {...props} variant="multiRows" />;
}

export function MapVowelSpaceLayout(props: Omit<LearnLayoutProps, 'variant'>) {
    return <LearnLayout {...props} variant="threeColumns" />;
}

const LayoutPresets = { Vowels101Layout, TackleMinimalPairsLayout, GetYourGraphemesLayout, MapVowelSpaceLayout };
export default LayoutPresets;
