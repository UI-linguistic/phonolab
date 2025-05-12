import React, { useState, useEffect } from 'react';
import styled, { useTheme } from 'styled-components';
import vowelsData from '@api/fallback/vowels-101.json';

// Media query breakpoints
const breakpoints = {
    mobile: 480,
    tablet: 768,
    laptop: 992,
    desktop: 1200,
    widescreen: 1600,
};

// Main outer container - Layer 1
const MainContainer = styled.div`
  display: grid;
  grid-template-rows: auto 1fr;
  width: fit-content;
  margin: 0 auto;
  outline: ${({ theme }) => `1px solid ${theme.colors.tongueGridBorder}`};
  padding: 0.75rem;
  box-sizing: border-box;
  background: transparent;
  
  /* Center the component in its slot */
  justify-self: center;
  align-self: center;
  
  /* Ensure it maintains a good size within the available space */
  min-height: 250px;
  min-width: 250px;
  max-width: 100%;
  
  /* Responsive sizing for different screen sizes */
  @media (min-width: ${({ theme }) => theme.breakpoints.mobile}) {
    min-height: 280px;
    min-width: 280px;
    padding: 0.85rem;
  }
  
  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 1rem;
    min-height: 350px;
    min-width: 350px;
  }
  
  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    padding: 1.2rem;
    min-height: 400px;
    min-width: 400px;
  }
  
  @media (min-width: ${({ theme }) => theme.breakpoints.widescreen}) {
    padding: 1.4rem;
    min-height: 450px;
    min-width: 450px;
  }
`;

// Wrapper with column title for the column-based layout
const TonguePositionWrapper = styled.section`
  display: flex;
  align-items: center;
  justify-content: center;
  width: fit-content;
  height: fit-content;
  background: transparent;
  outline: none;
`;

// Layer 1 - Row 1 (header section with 2 columns)
const HeaderSection = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  width: 100%;
  box-sizing: border-box;
  margin-bottom: ${({ theme }) => theme.spacing.xsmall};
  background: transparent;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    margin-bottom: ${({ theme }) => theme.spacing.small};
  }
  
  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    margin-bottom: ${({ theme }) => theme.spacing.medium};
  }
  
  @media (min-width: ${({ theme }) => theme.breakpoints.widescreen}) {
    margin-bottom: ${({ theme }) => theme.spacing.large};
  }
`;

// Empty Column in Header (Layer 1, Row 1, Column 1)
const EmptyHeaderColumn = styled.div`
  width: 5.75rem; /* Updated to match wider vertical label column + arrow column + half the grid gap */
  /* outline: 2px dashed #999999; */
  box-sizing: border-box;
  background: transparent;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    width: 6.25rem;
  }
  
  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    width: 6.75rem;
  }
  
  @media (min-width: ${({ theme }) => theme.breakpoints.widescreen}) {
    width: 7.25rem;
  }
`;

// Layer 1, Row 1, Column 2 (contains horizontal labels and arrow)
const HorizontalLabelContainer = styled.div`
  display: grid;
  grid-template-rows: auto auto;
  width: 100%;
  box-sizing: border-box;
  /* outline: 2px dashed #00ff00; */
  background: transparent;
`;

// Horizontal labels row (Layer 1, Row 1, Column 2, Row 1)
const HorizontalLabelsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  width: 100%;
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  /* outline: 2px solid #33cc33; */
  background: transparent;
  min-width: 300px;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    min-width: 350px;
  }
  
  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    min-width: 400px;
  }
  
  @media (min-width: ${({ theme }) => theme.breakpoints.widescreen}) {
    min-width: 450px;
  }
`;

const HorizontalLabel = styled.div`
  color: ${({ theme }) => theme.colors.tongueGridFront};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  font-size: 0.9rem;
  text-align: center;
  padding: ${({ theme }) => `${theme.spacing.xsmall} ${theme.spacing.xsmall}`};
  box-sizing: border-box;
  background: transparent;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: 1rem;
    padding: ${({ theme }) => `${theme.spacing.small} ${theme.spacing.xsmall}`};
  }
  
  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    font-size: 1.1rem;
    padding: ${({ theme }) => `${theme.spacing.small} ${theme.spacing.small}`};
  }
  
  @media (min-width: ${({ theme }) => theme.breakpoints.widescreen}) {
    font-size: 1.2rem;
  }
`;

// Horizontal arrow (Layer 1, Row 1, Column 2, Row 2)
const HorizontalArrowContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0;
  padding: ${({ theme }) => `${theme.spacing.xsmall} 0`};
  box-sizing: border-box;
  height: 2rem;
  background: transparent;
  min-width: 300px;
  
  svg {
    width: 98%;
    height: 1.5rem;
    margin: 0 auto;
  }
  
  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    height: 2.25rem;
    min-width: 350px;
    svg {
      height: 1.75rem;
    }
  }
  
  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    height: 2.5rem;
    min-width: 400px;
    svg {
      height: 2rem;
    }
  }
  
  @media (min-width: ${({ theme }) => theme.breakpoints.widescreen}) {
    height: 3rem;
    min-width: 450px;
    svg {
      height: 2.25rem;
    }
  }
`;

// Layer 1 - Row 2 (grid section)
const GridSection = styled.div`
  display: grid;
  grid-template-columns: auto auto 1fr;
  width: 100%;
  grid-gap: ${({ theme }) => theme.spacing.xsmall};
  box-sizing: border-box;
  background: transparent;
  align-items: stretch;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-gap: ${({ theme }) => theme.spacing.small};
  }
  
  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    grid-gap: ${({ theme }) => theme.spacing.medium};
  }
`;

// Layer 1 - Row 2, Column 1 (vertical labels)
const VerticalLabelsColumn = styled.div`
  display: grid;
  grid-template-rows: repeat(3, 1fr);
  width: 4rem;
  box-sizing: border-box;
  background: transparent;
  min-height: 300px;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    width: 4.5rem;
    min-height: 350px;
  }
  
  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    width: 5rem;
    min-height: 400px;
  }
  
  @media (min-width: ${({ theme }) => theme.breakpoints.widescreen}) {
    min-height: 450px;
  }
`;

const VerticalLabel = styled.div`
  color: ${({ theme }) => theme.colors.tongueGridHigh};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  text-align: right;
  height: 100%;
  padding: ${({ theme }) => `0 ${theme.spacing.xsmall} 0 0`};
  box-sizing: border-box;
  background: transparent;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: 1rem;
    padding: ${({ theme }) => `0 ${theme.spacing.small} 0 0`};
  }
  
  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    font-size: 1.1rem;
    padding: ${({ theme }) => `0 ${theme.spacing.medium} 0 0`};
  }
  
  @media (min-width: ${({ theme }) => theme.breakpoints.widescreen}) {
    font-size: 1.2rem;
  }
`;

// Layer 1 - Row 2, Column 2 (vertical arrow)
const VerticalArrowContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 1.5rem;
  box-sizing: border-box;
  background: transparent;
  min-height: 300px;
  
  svg {
    height: 95%;
    width: 1.2rem;
  }
  
  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    width: 1.7rem;
    min-height: 350px;
    svg {
      width: 1.4rem;
    }
  }
  
  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    width: 2rem;
    min-height: 400px;
    svg {
      width: 1.6rem;
    }
  }
  
  @media (min-width: ${({ theme }) => theme.breakpoints.widescreen}) {
    min-height: 450px;
  }
`;

// Layer 1 - Row 2, Column 3 (tongue grid)
const TongueGridContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
  background: transparent;
  min-height: 100%;
`;

const VowelGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  gap: 0.5rem;
  width: 100%;
  min-height: 100%;
  aspect-ratio: 1 / 1;
  border: 1px solid ${({ theme }) => theme.colors.black};
  background: transparent;
  padding: 0.5rem;
  box-sizing: border-box;
  min-width: 250px;
  min-height: 250px;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.mobile}) {
    gap: 0.6rem;
    padding: 0.6rem;
    min-width: 280px;
    min-height: 280px;
  }
  
  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    gap: 0.8rem;
    padding: 0.75rem;
    border-width: 1.1px;
    min-width: 350px;
    min-height: 350px;
  }
  
  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    gap: 1rem;
    padding: 0.9rem;
    border-width: 1.2px;
    min-width: 400px;
    min-height: 400px;
  }
  
  @media (min-width: ${({ theme }) => theme.breakpoints.widescreen}) {
    min-width: 450px;
    min-height: 450px;
  }
`;

interface GridCellProps {
    $isActive?: boolean;
}

const GridCell = styled.div<GridCellProps>`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border: 1px solid ${({ theme }) => theme.colors.black};
  padding: ${({ theme }) => theme.spacing.xsmall || '0.25rem'};
  gap: ${({ theme }) => theme.spacing.xsmall || '0.25rem'};
  aspect-ratio: 1 / 1;
  overflow: hidden;
  background-color: ${({ $isActive, theme }) =>
        $isActive ? theme.colors.tongueGridCellActive : 'transparent'};
  box-sizing: border-box;
  transition: background-color 150ms ease-out;
  
  &:hover {
    background-color: ${({ $isActive, theme }) =>
        $isActive ? theme.colors.tongueGridCellActive : theme.colors.tongueGridCellHover};
  }
  
  @media (min-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: ${({ theme }) => theme.spacing.xsmall};
    gap: ${({ theme }) => theme.spacing.xsmall};
  }
  
  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    border-width: 1.1px;
    padding: ${({ theme }) => theme.spacing.small};
    gap: ${({ theme }) => theme.spacing.small};
  }
  
  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    border-width: 1.2px;
    padding: calc(${({ theme }) => theme.spacing.small} * 1.2);
  }
`;

const getResponsiveButtonSize = (theme: any, screenSize: 'tablet' | 'desktop' | 'widescreen'): string => {
    const baseSize = theme.tongueGrid.vowelButtonSize;
    const baseValue = parseInt(baseSize, 10);

    if (screenSize === 'tablet') {
        return `${baseValue * 1.2}px`;
    } else if (screenSize === 'desktop') {
        return `${baseValue * 1.35}px`;
    } else if (screenSize === 'widescreen') {
        return `${baseValue * 1.5}px`;
    }
    return baseSize;
};

const VowelButton = styled.button<{ isActive?: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 28px;
  height: 28px;
  min-width: 24px;
  min-height: 24px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: ${({ theme }) => theme.fontWeights?.bold || 'bold'};
  background-color: ${({ isActive, theme }) =>
        isActive ? theme.colors?.tongueGridVowelActive || 'rgba(255, 235, 59, 0.5)' : 'transparent'};
  transition: transform 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  
  &:hover {
    background-color: ${({ isActive, theme }) =>
        isActive ? theme.colors?.tongueGridVowelHover || 'rgba(255, 235, 59, 0.7)' : 'rgba(255, 235, 59, 0.1)'};
    transform: scale(1.05);
  }
  
  &:focus {
    outline: none;
    transform: scale(0.95);
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1) inset;
  }
  
  &:active {
    transform: scale(0.9);
  }
  
  @media (min-width: ${({ theme }) => theme.breakpoints.mobile}) {
    width: 30px;
    height: 30px;
    font-size: 16px;
  }
  
  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    width: calc(32px * 1.25);
    height: calc(32px * 1.25);
    font-size: calc(16px * 1.25);
  }
  
  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    width: calc(32px * 1.5);
    height: calc(32px * 1.5);
    font-size: calc(16px * 1.5);
  }
  
  @media (min-width: ${({ theme }) => theme.breakpoints.widescreen}) {
    width: calc(32px * 1.75);
    height: calc(32px * 1.75);
    font-size: calc(16px * 1.75);
  }
`;

// Interface for vowel objects from JSON
interface VowelData {
    id: string;
    ipa: string;
    pronounced?: string;
    audio_url: string[];
}

// Interface for our processed grid data
interface GridCellData {
    rowIndex: number;
    colIndex: number;
    vowels: VowelData[];
}

// Props for the TongueGrid component
interface TongueGridProps {
    onVowelClick?: (vowel: string, audioUrl: string) => void;
}

// Wrapper to ensure the component is centered in its layout slot
const SlotCenteredWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: fit-content;
  height: fit-content;
  margin: 0 auto;
  background: transparent;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: ${({ theme }) => theme.spacing.xsmall};
  }
  
  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: ${({ theme }) => theme.spacing.small};
  }
  
  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    padding: ${({ theme }) => theme.spacing.medium};
  }
  
  @media (min-width: ${({ theme }) => theme.breakpoints.widescreen}) {
    padding: ${({ theme }) => theme.spacing.large};
  }
`;

// TongueGrid base component that uses the responsive context
const TongueGridBase: React.FC<TongueGridProps> = ({ onVowelClick }) => {
    const [activeVowel, setActiveVowel] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [gridData, setGridData] = useState<GridCellData[]>([]);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const theme = useTheme();

    // Track window size for responsive rendering
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
    const isDesktop = windowWidth >= breakpoints.desktop;

    // Process the vowel data from JSON on component mount
    useEffect(() => {
        try {
            // Access the tongue_position grid data from the JSON
            const sourceGrid = vowelsData.content.tongue_position.grid;
            const processedData: GridCellData[] = [];

            // Process each row in the grid
            sourceGrid.forEach((row, rowIndex) => {
                // Process each column in the row
                row.forEach((column, colIndex) => {
                    // Only process if there are vowels in this cell
                    if (column && column.length > 0) {
                        processedData.push({
                            rowIndex,
                            colIndex,
                            vowels: column,
                        });
                    }
                });
            });

            setGridData(processedData);
        } catch (error) {
            console.error('Error processing vowel grid data:', error);
        }
    }, []);

    const handleVowelClick = (vowel: VowelData, e: React.MouseEvent) => {
        // Prevent event bubbling
        e.preventDefault();
        e.stopPropagation();

        // Avoid processing if already handling a click or clicking the same vowel
        if (isProcessing || vowel.ipa === activeVowel) return;

        // Set processing flag
        setIsProcessing(true);

        // Update active vowel
        setActiveVowel(vowel.ipa);

        // Try to use audio URLs from the vowel's audio_url array
        if (onVowelClick && vowel.audio_url && vowel.audio_url.length > 0) {
            // Start with the first URL
            const primaryUrl = vowel.audio_url[0];

            // Call the callback with the first audio URL
            onVowelClick(vowel.ipa, primaryUrl);
        }

        // Reset processing flag after a delay
        setTimeout(() => {
            setIsProcessing(false);
        }, 300);
    };

    // Find which cell should render at a specific grid position
    const getCellAtPosition = (row: number, col: number) => {
        const cell = gridData.find(cell => cell.rowIndex === row && cell.colIndex === col);
        const isActive = cell && cell.vowels.some(vowel => vowel.ipa === activeVowel);

        // If no cell found at this position, return an empty cell
        if (!cell) {
            return (
                <GridCell key={`empty-${row}-${col}`} $isActive={false} />
            );
        }

        // Return a cell with vowel buttons
        return (
            <GridCell
                key={`cell-${row}-${col}`}
                $isActive={isActive}
            >
                {cell.vowels.map(vowel => (
                    <VowelButton
                        key={vowel.id}
                        isActive={activeVowel === vowel.ipa}
                        onClick={(e) => handleVowelClick(vowel, e)}
                    >
                        {vowel.ipa}
                    </VowelButton>
                ))}
            </GridCell>
        );
    };

    // Generate all cells for the 3x3 grid
    const renderGrid = () => {
        const cells = [];
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                cells.push(getCellAtPosition(row, col));
            }
        }
        return cells;
    };

    // Render the horizontal arrow based on screen size
    const renderHorizontalArrow = () => {
        if (isMobile) {
            return (
                <svg viewBox="0 0 200 30" xmlns="http://www.w3.org/2000/svg">
                    <line x1="15" y1="15" x2="185" y2="15" stroke={theme.colors.tongueGridArrow} strokeWidth="3" />
                    <polygon points="15,15 30,7 30,23" fill={theme.colors.tongueGridArrow} />
                    <polygon points="185,15 170,7 170,23" fill={theme.colors.tongueGridArrow} />
                </svg>
            );
        } else {
            return (
                <svg viewBox="0 0 200 30" xmlns="http://www.w3.org/2000/svg">
                    <line x1="15" y1="15" x2="185" y2="15" stroke={theme.colors.tongueGridArrow} strokeWidth="4" />
                    <polygon points="15,15 30,7 30,23" fill={theme.colors.tongueGridArrow} />
                    <polygon points="185,15 170,7 170,23" fill={theme.colors.tongueGridArrow} />
                </svg>
            );
        }
    };

    // Render the vertical arrow based on screen size
    const renderVerticalArrow = () => {
        if (isMobile) {
            return (
                <svg viewBox="0 0 30 200" xmlns="http://www.w3.org/2000/svg">
                    <line x1="15" y1="15" x2="15" y2="185" stroke={theme.colors.tongueGridArrow} strokeWidth="3" />
                    <polygon points="15,15 7,30 23,30" fill={theme.colors.tongueGridArrow} />
                    <polygon points="15,185 7,170 23,170" fill={theme.colors.tongueGridArrow} />
                </svg>
            );
        } else {
            return (
                <svg viewBox="0 0 30 200" xmlns="http://www.w3.org/2000/svg">
                    <line x1="15" y1="15" x2="15" y2="185" stroke={theme.colors.tongueGridArrow} strokeWidth="4" />
                    <polygon points="15,15 7,30 23,30" fill={theme.colors.tongueGridArrow} />
                    <polygon points="15,185 7,170 23,170" fill={theme.colors.tongueGridArrow} />
                </svg>
            );
        }
    };

    return (
        <TonguePositionWrapper>
            <SlotCenteredWrapper>
                <MainContainer>
                    {/* Layer 1 - Row 1 (Header Section with 2 columns) */}
                    <HeaderSection>
                        {/* Empty first column to align with vertical labels */}
                        <EmptyHeaderColumn />

                        {/* Layer 1, Row 1, Column 2 - Contains horizontal labels and arrow */}
                        <HorizontalLabelContainer>
                            {/* Horizontal Labels Row */}
                            <HorizontalLabelsRow>
                                <HorizontalLabel>Front</HorizontalLabel>
                                <HorizontalLabel>Central</HorizontalLabel>
                                <HorizontalLabel>Back</HorizontalLabel>
                            </HorizontalLabelsRow>

                            {/* Horizontal Arrow */}
                            <HorizontalArrowContainer>
                                {renderHorizontalArrow()}
                            </HorizontalArrowContainer>
                        </HorizontalLabelContainer>
                    </HeaderSection>

                    {/* Layer 1 - Row 2 (Grid Section) */}
                    <GridSection>
                        {/* Layer 1 - Row 2, Column 1 (Vertical Labels) */}
                        <VerticalLabelsColumn>
                            <VerticalLabel>High</VerticalLabel>
                            <VerticalLabel>Mid</VerticalLabel>
                            <VerticalLabel>Low</VerticalLabel>
                        </VerticalLabelsColumn>

                        {/* Layer 1 - Row 2, Column 2 (Vertical Arrow) */}
                        <VerticalArrowContainer>
                            {renderVerticalArrow()}
                        </VerticalArrowContainer>

                        {/* Layer 1 - Row 2, Column 3 (Tongue Grid) */}
                        <TongueGridContainer>
                            <VowelGrid>
                                {renderGrid()}
                            </VowelGrid>
                        </TongueGridContainer>
                    </GridSection>
                </MainContainer>
            </SlotCenteredWrapper>
        </TonguePositionWrapper>
    );
};

// Exported component wrapped with ResponsiveProvider
const TongueGrid: React.FC<TongueGridProps> = (props) => {
    return (
        <TongueGridBase {...props} />
    );
};

export default TongueGrid; 