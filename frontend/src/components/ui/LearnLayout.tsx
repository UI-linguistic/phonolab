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
 *  • slotDirections?:   ('row' | 'column')[]       — flex direction for each child slot
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
    slotDirections?: ('row' | 'column')[];
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

  /* child 1: left edge margin */
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

  /* child 3: right edge margin + hug right */
  & > div:nth-child(3) {
    justify-self: end;
    margin-right: ${({ theme }) => theme.spacing.small};
  }
`;

const SubtitleWrapper = styled.div`
  outline: ${({ theme }) => theme.debugOutline ? `2px dashed ${theme.colors.secondary}` : 'none'};
`;

const SectionTabsWrapper = styled.div`
  outline: ${({ theme }) => theme.debugOutline ? `2px dashed ${theme.colors.secondary}` : 'none'};
`;

const ContentWrapper = styled.div<{ $variant?: LearnLayoutProps['variant'] }>`
  display: grid;
  ${({ $variant }) => {
        switch ($variant) {
            case 'twoColumns':
                return 'grid-template-columns: 1fr 1fr; gap: 2rem;';
            case 'threeColumns':
                return 'grid-template-columns: repeat(3, 1fr); gap: 2rem;';
            case 'multiRows':
                return 'grid-template-rows: repeat(3, auto); gap: 2rem;';
            default:
                return 'grid-template-columns: 1fr;';
        }
    }}
  outline: ${({ theme }) => theme.debugOutline ? `2px dashed ${theme.colors.secondary}` : 'none'};
`;

const SlotWrapper = styled.div<{ direction: 'row' | 'column' }>`
  display: flex;
  flex-direction: ${({ direction }) => direction};
  outline: ${({ theme }) => theme.debugOutline ? `2px dashed ${theme.colors.secondary}` : 'none'};
  padding: ${({ theme }) => theme.spacing.small};
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
                {contentArray.map((child, idx) => (
                    <SlotWrapper key={idx} direction={slotDirections[idx] || 'column'}>
                        {child}
                    </SlotWrapper>
                ))}
            </ContentWrapper>
        </LayoutWrapper>
    );
};

// Preset wrappers for Learn modules

export function Vowels101Layout(props: Omit<LearnLayoutProps, 'variant' | 'sectionTabs'>) {
    return (
        <LearnLayout
            {...props}
            rowGap="tight"
            titleAlign="center"
            sectionTabs={["Tongue Position", "Lip Shape", "Length"]}
            variant="threeColumns"
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
