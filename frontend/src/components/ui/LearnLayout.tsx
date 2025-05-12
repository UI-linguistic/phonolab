/**
 * LearnLayout.tsx
 *
 * Responsive page-level layout system for Learn module screens.
 * Handles consistent layout structure across all Learn experiences.
 *
 * Variants (`variant` prop):
 *  - single:       Single full-width section
 *  - twoColumns:   Two side-by-side containers (50/50)
 *  - threeColumns: Three equal-width sections
 *  - multiRows:    Three stacked full-width containers
 *
 * Uses Mantine UI for responsive design and CSS media queries for device detection.
 */

import React, { useState, useEffect } from 'react';
import styled, { DefaultTheme, css } from 'styled-components';
import { Container, Flex, Box, Group } from '@mantine/core';
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

// Media query breakpoints
const breakpoints = {
    mobile: 480,
    tablet: 768,
    laptop: 992,
    desktop: 1200,
    widescreen: 1600,
};

const LayoutWrapper = styled.div<{ rowGap?: string }>`
  display: flex;
  flex-direction: column;
  gap: ${({ theme, rowGap }) =>
        rowGap
            ? theme.heroGaps[rowGap as HeroGapKey]
            : theme.spacing.large
    };
  padding: ${({ theme }) => `${theme.spacing.medium} ${theme.spacing.xsmall}`};
  background-color: transparent;
  border-radius: ${({ theme }) => theme.borderRadius};
  outline: none;
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;
  
  @media (min-width: ${breakpoints.tablet}px) {
    padding: ${({ theme }) => `${theme.spacing.medium} ${theme.spacing.small}`};
  }
  
  @media (min-width: ${breakpoints.desktop}px) {
    padding: ${({ theme }) => `${theme.spacing.medium} ${theme.spacing.medium}`};
  }
`;

const TopRowWrapper = styled.div`
  width: 100%;
  max-width: 100%;
  min-width: 0;
  display: grid;
  grid-template-columns: auto 1fr auto;
  column-gap: ${({ theme }) => theme.spacing.xsmall};
  justify-items: start;
  align-items: center;
  outline: none;

  & > div {
    min-width: 0;
    padding: ${({ theme }) => theme.spacing.xsmall};
    outline: none;
  }

  /* square back + next button slots */
  & > div:nth-child(1),
  & > div:nth-child(3) {
    width: ${({ theme }) => theme.spacing.large};
    aspect-ratio: 1 / 1;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    
    @media (min-width: ${breakpoints.tablet}px) {
      width: ${({ theme }) => theme.spacing.xlarge};
    }
  }

  /* child 1: left edge margin */
  & > div:nth-child(1) {
    justify-self: start;
    margin-left: ${({ theme }) => theme.spacing.xsmall};
    
    @media (min-width: ${breakpoints.tablet}px) {
      margin-left: ${({ theme }) => theme.spacing.small};
    }
  }

  /* center title slot: centered */
  & > div:nth-child(2) {
    width: 100%;
    justify-self: center;
    text-align: center;
    display: inline-block;
    
    /* Responsive title size */
    & h1 {
      font-size: 1.5rem;
      line-height: 1.2;
      
      @media (min-width: ${breakpoints.tablet}px) {
        font-size: 2rem;
      }
      
      @media (min-width: ${breakpoints.desktop}px) {
        font-size: 2.5rem;
      }
    }
  }

  /* child 3: right edge margin + hug right */
  & > div:nth-child(3) {
    justify-self: end;
    margin-right: ${({ theme }) => theme.spacing.xsmall};
    
    @media (min-width: ${breakpoints.tablet}px) {
      margin-right: ${({ theme }) => theme.spacing.small};
    }
  }
`;

const SubtitleWrapper = styled.div`
  outline: none;
  width: 100%;
  padding: ${({ theme }) => `0 ${theme.spacing.small}`};
  
  @media (min-width: ${breakpoints.tablet}px) {
    padding: ${({ theme }) => `0 ${theme.spacing.medium}`};
  }
`;

const SectionTabsWrapper = styled.div`
  margin-top: 1rem;
  outline: none;
  width: 100%;
  overflow-x: auto;
  padding-bottom: 0.5rem;
  
  @media (min-width: ${breakpoints.tablet}px) {
    margin-top: 1.5rem;
    overflow-x: visible;
  }
`;

// Content grid styles for different viewports
const MobileContentGrid = styled.div`
  margin-top: 1rem;
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  outline: none;
  width: 100%;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
  min-height: 450px;
  align-items: start;
`;

const TabletContentGrid = styled.div<{ $variant?: LearnLayoutProps['variant'] }>`
  margin-top: 1.5rem;
  display: grid;
  ${({ $variant }) => {
        switch ($variant) {
            case 'twoColumns':
                return 'grid-template-columns: 1fr 1fr; gap: 1.5rem;';
            case 'threeColumns':
                return 'grid-template-columns: 1fr minmax(300px, 2fr) 1fr; gap: 1rem;';
            case 'multiRows':
                return 'grid-template-rows: repeat(3, auto); gap: 1.5rem;';
            default:
                return 'grid-template-columns: 1fr;';
        }
    }}
  outline: none;
  width: 100%;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
  min-height: 500px;
  align-items: start;
`;

const DesktopContentGrid = styled.div<{ $variant?: LearnLayoutProps['variant'] }>`
  margin-top: 1.5rem;
  display: grid;
  ${({ $variant }) => {
        switch ($variant) {
            case 'twoColumns':
                return 'grid-template-columns: 1fr 1fr; gap: 2rem;';
            case 'threeColumns':
                return 'grid-template-columns: minmax(280px, 0.5fr) minmax(450px, 3fr) minmax(250px, 0.5fr); gap: 1.5rem;';
            case 'multiRows':
                return 'grid-template-rows: repeat(3, auto); gap: 2rem;';
            default:
                return 'grid-template-columns: 1fr;';
        }
    }}
  outline: none;
  width: 100%;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
  min-height: 550px;
  align-items: start;
`;

// Wrapper for slots with responsive styles
const MobileSlotWrapper = styled.div<{
    direction: 'row' | 'column' | 'grid' | 'freeform';
    $variant?: string;
    style?: React.CSSProperties;
}>`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 100%;
  max-width: 100%;
  outline: none;
  padding: ${({ theme, $variant }) => {
        if ($variant === 'vowelGrid') return '0';
        if ($variant === 'vowels101') return `${theme.spacing.xsmall} ${theme.spacing.xsmall}`;
        return `${theme.spacing.xsmall}`;
    }};
  border-radius: ${({ theme }) => theme.borderRadius};
  
  ${({ $variant }) => $variant === 'vowelGrid' ? `
    display: flex;
    justify-content: center;
    align-items: flex-start;
    width: 100%;
    height: auto;
    min-height: 400px; 
    overflow: visible;
    padding: 0;
  ` : ''}
`;

const TabletSlotWrapper = styled.div<{
    direction: 'row' | 'column' | 'grid' | 'freeform';
    $variant?: string;
    style?: React.CSSProperties;
}>`
  ${({ direction }) => {
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
        gap: ${direction === 'grid' ? '0.5rem' : '0.75rem'};
        width: 100%;
        max-width: 100%;
      `;
        }
    }}
  outline: none;
  padding: ${({ theme, $variant }) => {
        if ($variant === 'vowelGrid') return '0';
        if ($variant === 'vowels101') return `${theme.spacing.small} ${theme.spacing.xsmall}`;
        return `${theme.spacing.small}`;
    }};
  border-radius: ${({ theme }) => theme.borderRadius};
  
  ${({ $variant }) => $variant === 'vowelGrid' ? `
    display: flex;
    justify-content: center;
    align-items: flex-start;
    width: 100%;
    height: auto;
    min-height: 500px;
    overflow: visible;
    padding: 0;
  ` : ''}
`;

const DesktopSlotWrapper = styled.div<{
    direction: 'row' | 'column' | 'grid' | 'freeform';
    $variant?: string;
    style?: React.CSSProperties;
}>`
  ${({ direction }) => {
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
        width: 100%;
        max-width: 100%;
      `;
        }
    }}
  outline: none;
  padding: ${({ theme, $variant }) => {
        if ($variant === 'vowelGrid') return '0';
        if ($variant === 'vowels101') return `${theme.spacing.small} ${theme.spacing.xsmall}`;
        return `${theme.spacing.small}`;
    }};
  border-radius: ${({ theme }) => theme.borderRadius};
  
  ${({ $variant }) => $variant === 'vowelGrid' ? `
    display: flex;
    justify-content: center;
    align-items: flex-start;
    width: 100%;
    height: auto;
    min-height: 550px;
    overflow: visible;
    padding: 0;
  ` : ''}
`;

// Wrapper for individual items inside a freeform SlotWrapper
const MobileFreeformItemWrapper = styled.div<{
    $customStyle?: React.CSSProperties
}>`
  width: 100%;
  margin-bottom: 1rem;
  
  ${({ $customStyle }) => {
        if (!$customStyle) return '';

        // Adjust custom styles for mobile
        const adjustedStyles = { ...$customStyle };

        // Make sure items don't overflow on mobile
        if (adjustedStyles.minWidth && parseInt(adjustedStyles.minWidth as string) > 280) {
            adjustedStyles.minWidth = 'auto';
        }
        if (adjustedStyles.maxWidth && parseInt(adjustedStyles.maxWidth as string) > 280) {
            adjustedStyles.maxWidth = '100%';
        }

        return Object.entries(adjustedStyles)
            .map(([key, value]) => `${key}: ${value};`)
            .join('\n');
    }}
`;

const TabletFreeformItemWrapper = styled.div<{
    $customStyle?: React.CSSProperties
}>`
  ${({ $customStyle }) => $customStyle ? Object.entries($customStyle).map(([key, value]) => `${key}: ${value};`).join('\n') : ''}
`;

const DesktopFreeformItemWrapper = styled.div<{
    $customStyle?: React.CSSProperties
}>`
  ${({ $customStyle }) => $customStyle ? Object.entries($customStyle).map(([key, value]) => `${key}: ${value};`).join('\n') : ''}
`;

// Main component implementation
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
    // Process children into array
    const contentArray = React.Children.toArray(children).flatMap(child => {
        if (
            React.isValidElement(child) &&
            child.type === React.Fragment
        ) {
            return React.Children.toArray(child.props.children);
        }
        return [child];
    });

    // Track window size for responsive rendering
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // Helper to check screen size
    const isMobile = windowWidth < breakpoints.tablet;
    const isTablet = windowWidth >= breakpoints.tablet && windowWidth < breakpoints.desktop;
    const isDesktop = windowWidth >= breakpoints.desktop;

    // Special case for Vowels101 layout
    const isVowels101 = variant === 'threeColumns' && title.includes('Vowels are organized');

    // Render appropriate content grid based on screen size
    const renderContentGrid = () => {
        if (isMobile) {
            return (
                <MobileContentGrid>
                    {contentArray.map((child, idx) => {
                        const direction = slotDirections[idx] || 'column';
                        let slotVariant = undefined;
                        if (isVowels101) {
                            slotVariant = 'vowels101';
                            if (idx === 1) slotVariant = 'vowelGrid';
                        }

                        // Mobile styles for slots
                        const mobileStyles = { ...slotStyles[idx] };
                        if (idx === 1 && isVowels101) {
                            mobileStyles.minHeight = '400px';
                            mobileStyles.maxWidth = '100%';
                            mobileStyles.margin = '0 auto';
                            mobileStyles.padding = '0';
                        } else {
                            mobileStyles.minWidth = 'auto';
                            mobileStyles.maxWidth = '100%';
                            mobileStyles.width = '100%';
                        }

                        if (direction === 'freeform' && React.isValidElement(child) && child.props.children) {
                            const freeformChildren = React.Children.toArray(child.props.children);
                            return (
                                <MobileSlotWrapper
                                    key={idx}
                                    direction="freeform"
                                    $variant={slotVariant}
                                >
                                    {freeformChildren.map((freeformChild, freeformIdx) => (
                                        <MobileFreeformItemWrapper
                                            key={freeformIdx}
                                            $customStyle={slotStyles && slotStyles[`${idx}-${freeformIdx}`]}
                                        >
                                            {freeformChild}
                                        </MobileFreeformItemWrapper>
                                    ))}
                                </MobileSlotWrapper>
                            );
                        }

                        return (
                            <MobileSlotWrapper
                                key={idx}
                                direction={direction}
                                $variant={slotVariant}
                                style={mobileStyles}
                            >
                                {child}
                            </MobileSlotWrapper>
                        );
                    })}
                </MobileContentGrid>
            );
        } else if (isTablet) {
            return (
                <TabletContentGrid $variant={variant}>
                    {contentArray.map((child, idx) => {
                        const direction = slotDirections[idx] || 'column';
                        let slotVariant = undefined;
                        if (isVowels101) {
                            slotVariant = 'vowels101';
                            if (idx === 1) slotVariant = 'vowelGrid';
                        }

                        // Tablet styles
                        const tabletStyles = { ...slotStyles[idx] };
                        if (isVowels101) {
                            if (idx === 0) {
                                tabletStyles.minWidth = '280px';
                                tabletStyles.maxWidth = '320px';
                            } else if (idx === 1) {
                                tabletStyles.minHeight = '500px';
                            } else if (idx === 2) {
                                tabletStyles.minWidth = '240px';
                                tabletStyles.maxWidth = '280px';
                                tabletStyles.marginTop = '0.75rem';
                            }
                        }

                        if (direction === 'freeform' && React.isValidElement(child) && child.props.children) {
                            const freeformChildren = React.Children.toArray(child.props.children);
                            return (
                                <TabletSlotWrapper
                                    key={idx}
                                    direction="freeform"
                                    $variant={slotVariant}
                                >
                                    {freeformChildren.map((freeformChild, freeformIdx) => (
                                        <TabletFreeformItemWrapper
                                            key={freeformIdx}
                                            $customStyle={slotStyles && slotStyles[`${idx}-${freeformIdx}`]}
                                        >
                                            {freeformChild}
                                        </TabletFreeformItemWrapper>
                                    ))}
                                </TabletSlotWrapper>
                            );
                        }

                        return (
                            <TabletSlotWrapper
                                key={idx}
                                direction={direction}
                                $variant={slotVariant}
                                style={tabletStyles}
                            >
                                {child}
                            </TabletSlotWrapper>
                        );
                    })}
                </TabletContentGrid>
            );
        } else {
            return (
                <DesktopContentGrid $variant={variant}>
                    {contentArray.map((child, idx) => {
                        const direction = slotDirections[idx] || 'column';
                        let slotVariant = undefined;
                        if (isVowels101) {
                            slotVariant = 'vowels101';
                            if (idx === 1) slotVariant = 'vowelGrid';
                        }

                        if (direction === 'freeform' && React.isValidElement(child) && child.props.children) {
                            const freeformChildren = React.Children.toArray(child.props.children);
                            return (
                                <DesktopSlotWrapper
                                    key={idx}
                                    direction="freeform"
                                    $variant={slotVariant}
                                >
                                    {freeformChildren.map((freeformChild, freeformIdx) => (
                                        <DesktopFreeformItemWrapper
                                            key={freeformIdx}
                                            $customStyle={slotStyles && slotStyles[`${idx}-${freeformIdx}`]}
                                        >
                                            {freeformChild}
                                        </DesktopFreeformItemWrapper>
                                    ))}
                                </DesktopSlotWrapper>
                            );
                        }

                        return (
                            <DesktopSlotWrapper
                                key={idx}
                                direction={direction}
                                $variant={slotVariant}
                                style={slotStyles[idx]}
                            >
                                {child}
                            </DesktopSlotWrapper>
                        );
                    })}
                </DesktopContentGrid>
            );
        }
    };

    // Render MenuList with appropriate size based on screen size
    const renderSectionTabs = () => {
        if (isMobile) {
            return (
                <MenuList
                    items={sectionTabs as string[]}
                    orientation="horizontal"
                    size="sm"
                    activeIndex={activeTabIndex}
                    onSelect={onTabSelect}
                    horizontalPadding="0.5rem"
                    buttonWidth="120px"
                    itemGap="1rem"
                    textWeight="bold"
                />
            );
        } else if (isTablet) {
            return (
                <MenuList
                    items={sectionTabs as string[]}
                    orientation="horizontal"
                    size="md"
                    activeIndex={activeTabIndex}
                    onSelect={onTabSelect}
                    horizontalPadding="0.75rem"
                    buttonWidth="180px"
                    itemGap="3rem"
                    textWeight="bold"
                />
            );
        } else {
            return (
                <MenuList
                    items={sectionTabs as string[]}
                    orientation="horizontal"
                    size="md"
                    activeIndex={activeTabIndex}
                    onSelect={onTabSelect}
                    horizontalPadding="1rem"
                    buttonWidth="220px"
                    itemGap="5rem"
                    textWeight="bold"
                />
            );
        }
    };

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
                    {renderSectionTabs()}
                </SectionTabsWrapper>
            )}

            {/* Content Grid */}
            {renderContentGrid()}
        </LayoutWrapper>
    );
};

// Preset styles for specific layouts
const vowels101Styles: Record<string | number, CustomCSSProperties> = {
    // Left column styles
    0: {
        display: 'flex',
        flexDirection: 'column' as React.CSSProperties['flexDirection'],
        gap: '1.5rem',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        minWidth: '330px',
        maxWidth: '370px',
        flexShrink: 0,
        padding: '1rem 0.5rem',
        alignSelf: 'flex-start'
    },
    // Middle column (vowel grid) styles
    1: {
        display: 'flex',
        flexDirection: 'column' as React.CSSProperties['flexDirection'],
        alignItems: 'center',
        justifyContent: 'flex-start',
        flexGrow: 2,
        width: '100%',
        height: 'auto',
        minHeight: '550px',
        maxWidth: '100%',
        padding: '0',
        margin: '0 auto',
        overflow: 'visible',
        alignSelf: 'flex-start'
    },
    // Right column (tongue diagram) styles
    2: {
        display: 'flex',
        flexDirection: 'column' as React.CSSProperties['flexDirection'],
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexShrink: 1,
        minWidth: '280px',
        maxWidth: '320px',
        height: 'auto',
        padding: '0',
        alignSelf: 'flex-start',
        marginTop: '1rem'
    }
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
            slotDirections={['column', 'column', 'column']}
            slotStyles={props.slotStyles ? { ...vowels101Styles, ...props.slotStyles } : vowels101Styles}
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
