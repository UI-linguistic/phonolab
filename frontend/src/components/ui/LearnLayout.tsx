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
import styled, { useTheme } from 'styled-components';
import { PageTitle, PageSubtitle } from '../typography/PageTypography';

interface LearnLayoutProps {
    title: string;
    subtitle?: string;
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

const LayoutWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.large};
  padding: ${({ theme }) => theme.spacing.large};
  background-color: transparent;
  border-radius: ${({ theme }) => theme.borderRadius};
  outline: ${({ theme }) => theme.debugOutline ? `2px dashed ${theme.colors.secondary}` : 'none'};
`;

const TopRowWrapper = styled.div`
  display: grid;
  grid-template-columns: max-content 1fr max-content;
  align-items: center;
  outline: ${({ theme }) => theme.debugOutline ? `2px dashed ${theme.colors.secondary}` : 'none'};

  & > div {
    outline: ${({ theme }) => theme.debugOutline ? `2px dashed ${theme.colors.secondary}` : 'none'};
    padding: ${({ theme }) => theme.spacing.small};
    max-width: 15ch;
  }

  & > div:nth-child(2) {
    max-width: none;
    outline: ${({ theme }) => theme.debugOutline ? `2px dashed ${theme.colors.secondary}` : 'none'};
    text-align: center;
  }
`;

const SubtitleWrapper = styled.div`
  outline: ${({ theme }) => theme.debugOutline ? `2px dashed ${theme.colors.secondary}` : 'none'};
`;

const SectionTabsWrapper = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.medium};
  border-bottom: 2px solid ${({ theme }) => theme.colors.secondary};
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
    subtitle,
    showBackButton = true,
    additionalButton,
    nextButton,
    sectionTabs,
    activeTabIndex = 0,
    onTabSelect,
    variant = 'single',
    slotDirections = [],
    children,
}) => {
    const contentArray = React.Children.toArray(children);

    return (
        <LayoutWrapper>
            <TopRowWrapper>
                <div>{showBackButton ? 'Back button placeholder' : null}</div>
                <div><PageTitle>{title}</PageTitle></div>
                <div>{nextButton ?? 'Next button placeholder'}</div>
            </TopRowWrapper>

            {subtitle && (
                <SubtitleWrapper>
                    <PageSubtitle>{subtitle}</PageSubtitle>
                </SubtitleWrapper>
            )}

            {sectionTabs && (
                <SectionTabsWrapper>
                    {sectionTabs.map((tab, idx) => (
                        <button key={idx} onClick={() => onTabSelect?.(idx)}>
                            {tab}
                        </button>
                    ))}
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
