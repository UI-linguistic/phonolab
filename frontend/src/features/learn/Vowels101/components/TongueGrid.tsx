import React, { useState, useEffect } from 'react';
import styled, { useTheme } from 'styled-components';
import vowelsData from '@api/fallback/vowels-101.json';

// Main outer container - Layer 1
const MainContainer = styled.div`
  display: grid;
  grid-template-rows: auto 1fr;
  width: 100%;
  max-width: 450px;
  margin: 0 auto;
  outline: 3px solid #555555;
  padding: 1rem;
  box-sizing: border-box;
  background: transparent;
  
  /* Center the component in its slot */
  justify-self: center;
  align-self: center;
  
  /* Ensure it maintains a good size within the available space */
  min-height: 350px;
  height: fit-content;
`;

// Wrapper with column title for the column-based layout
const TonguePositionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin: 0 auto;
  background: transparent;
`;

// Horizontal labels title row
const HorizontalTitle = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  margin-bottom: 1rem;
  background: transparent;
`;

const HorizontalTitleText = styled.div`
  font-size: ${({ theme }) => theme.typography.layoutSubtitle};
  color: ${({ theme }) => theme.colors.textSubtle};
  font-weight: bold;
  text-align: center;
  background: transparent;
`;

// Layer 1 - Row 1 (header section with 2 columns)
const HeaderSection = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  width: 100%;
  /* outline: 2px dashed #ff0000; */
  box-sizing: border-box;
  margin-bottom: 0.5rem;
  background: transparent;
`;

// Empty Column in Header (Layer 1, Row 1, Column 1)
const EmptyHeaderColumn = styled.div`
  width: 5.75rem; /* Updated to match wider vertical label column + arrow column + half the grid gap */
  /* outline: 2px dashed #999999; */
  box-sizing: border-box;
  background: transparent;
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
`;

const HorizontalLabel = styled.div`
  color: #8b2252;
  font-weight: bold;
  font-size: 1.5rem;
  text-align: center;
  padding: 0.5rem 0.25rem;
  box-sizing: border-box;
  /* outline: 2px solid #0000ff; */
  background: transparent;
`;

// Horizontal arrow (Layer 1, Row 1, Column 2, Row 2)
const HorizontalArrowContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0;
  padding: 0.25rem 0;
  box-sizing: border-box;
  height: 2rem;
  background: transparent;
  /* outline: 2px dashed #8800ff; */
  svg {
    width: 98%;
    height: 1.5rem;
    margin: 0 auto;
  }
`;

// Layer 1 - Row 2 (grid section)
const GridSection = styled.div`
  display: grid;
  grid-template-columns: auto auto 1fr;
  width: 100%;
  grid-gap: 0.25rem;
  box-sizing: border-box;
  /* outline: 2px dashed #ff00ff; */
  background: transparent;
`;

// Layer 1 - Row 2, Column 1 (vertical labels)
const VerticalLabelsColumn = styled.div`
  display: grid;
  grid-template-rows: repeat(3, 1fr);
  width: 4rem;
  box-sizing: border-box;
  /* outline: 2px solid #ff8800; */
  background: transparent;
`;

const VerticalLabel = styled.div`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: bold;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  text-align: right;
  height: 100%;
  padding: 0 0.5rem 0 0;
  box-sizing: border-box;
  /* outline: 2px solid #00ffff; */
  background: transparent;
`;

// Layer 1 - Row 2, Column 2 (vertical arrow)
const VerticalArrowContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 1.5rem;
  box-sizing: border-box;
  /* outline: 2px dashed #00ff88; */
  background: transparent;
  
  svg {
    height: 95%;
    width: 1.5rem;
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
  /* outline: 2px dashed #88ff00; */
  background: transparent;
`;

const VowelGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  gap: 2px;
  width: 100%;
  aspect-ratio: 1 / 1;
  border: 3px solid black;
  background: transparent;
  padding: 3px;
  box-sizing: border-box;
  /* outline: 2px solid #ff0088; */
`;

interface GridCellProps {
    $isActive?: boolean;
}

const GridCell = styled.div<GridCellProps>`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border: 1px solid black;
  padding: 4px;
  gap: 4px;
  aspect-ratio: 1 / 1;
  overflow: hidden;
  background-color: ${({ $isActive, theme }) =>
        $isActive ? `${theme.colors.secondary}50` : 'transparent'};
  box-sizing: border-box;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: ${({ $isActive, theme }) =>
        $isActive ? `${theme.colors.secondary}50` : `${theme.colors.secondary}15`};
  }
  
  /* outline: 1px solid #008888; */
`;

const VowelButton = styled.button<{ isActive?: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 34px;
  height: 34px;
  min-width: 30px;
  min-height: 30px;
  max-width: 40px;
  max-height: 40px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  font-size: 1.25rem;
  font-weight: bold;
  background-color: ${({ isActive }) =>
        isActive ? 'hsl(54, 100.00%, 64.90%)' : 'transparent'};
  transition: transform 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  
  &:hover {
    background-color: ${({ isActive }) =>
        isActive ? 'rgba(255, 232, 26, 0.94)' : 'rgba(255, 235, 59, 0.1)'};
  }
  
  &:focus {
    outline: none;
    transform: scale(0.95);
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1) inset;
  }
  
  &:active {
    transform: scale(0.9);
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
  margin-top: 1.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: transparent;
`;

const TongueGrid: React.FC<TongueGridProps> = ({ onVowelClick }) => {
    const [activeVowel, setActiveVowel] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [gridData, setGridData] = useState<GridCellData[]>([]);
    const theme = useTheme();

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

    return (
        <TonguePositionWrapper>
            {/* <HorizontalTitle>
                <HorizontalTitleText>Vowels are organized by tongue position</HorizontalTitleText>
            </HorizontalTitle> */}
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
                                <svg viewBox="0 0 200 30" xmlns="http://www.w3.org/2000/svg">
                                    <line x1="15" y1="15" x2="185" y2="15" stroke="#444" strokeWidth="4" />
                                    <polygon points="15,15 30,7 30,23" fill="#444" />
                                    <polygon points="185,15 170,7 170,23" fill="#444" />
                                </svg>
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
                            <svg viewBox="0 0 30 200" xmlns="http://www.w3.org/2000/svg">
                                <line x1="15" y1="15" x2="15" y2="185" stroke="#444" strokeWidth="4" />
                                <polygon points="15,15 7,30 23,30" fill="#444" />
                                <polygon points="15,185 7,170 23,170" fill="#444" />
                            </svg>
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

export default TongueGrid; 