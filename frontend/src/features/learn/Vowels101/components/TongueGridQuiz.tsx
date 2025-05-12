import React, { useState, useEffect, useCallback } from 'react';
import styled, { useTheme } from 'styled-components';
import {
    DndContext,
    DragEndEvent,
    DragOverlay,
    DragStartEvent,
    PointerSensor,
    useSensor,
    useSensors,
    closestCenter,
    useDraggable,
    useDroppable
} from '@dnd-kit/core';
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
    $isOver?: boolean;
    $isDragging?: boolean;
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
  background-color: ${({ $isActive, $isOver, theme }) =>
        $isActive ? `${theme.colors.secondary}50` :
            $isOver ? `${theme.colors.primary}30` : 'transparent'};
  box-sizing: border-box;
  transition: all 0.2s ease;
  position: relative;
  touch-action: none; /* Helps with touch devices */
  
  &:hover {
    background-color: ${({ $isActive, $isOver, theme }) =>
        $isActive ? `${theme.colors.secondary}50` :
            $isOver ? `${theme.colors.primary}30` : `${theme.colors.secondary}15`};
  }
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border: ${({ $isDragging }) => $isDragging ? '2px dashed #000' : 'none'};
    pointer-events: none;
    z-index: 1;
  }
`;

// For quiz mode, we remove hover effects and clickable styles
const VowelButtonQuiz = styled.div<{ isActive?: boolean }>`
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
  font-size: 1.25rem;
  font-weight: bold;
  background-color: ${({ isActive }) =>
        isActive === true ? 'hsl(54, 100.00%, 64.90%)' : 'transparent'};
  cursor: grab;
  
  &:active {
    cursor: grabbing;
  }
`;

// Wrapper to ensure the component is centered in its layout slot
const SlotCenteredWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: transparent;
`;

// Interface for vowel objects from JSON
interface VowelData {
    id: string;
    ipa: string;
    pronounced?: string;
    audio_url: string[];
    position?: {
        row: number;
        col: number;
    };
}

// Interface for grid cell data in the quiz mode
interface GridCellData {
    id: string;
    row: number;
    col: number;
    vowels: VowelData[];
}

// Quiz feedback component
const QuizFeedback = styled.div<{ $correct: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1rem;
  padding: 0.5rem;
  color: white;
  border-radius: ${({ theme }) => theme.borderRadius};
  background-color: ${({ $correct, theme }) =>
        $correct ? theme.colors.primary : theme.colors.secondary};
  font-weight: bold;
  opacity: ${({ $correct }) => $correct ? 1 : 0};
  transition: opacity 0.3s ease;
`;

// Styled component for the drag overlay
const DragOverlayStyles = styled.div<{ $isEmpty?: boolean }>`
  opacity: 0.8;
  transform: scale(1.05);
  cursor: grabbing;
  z-index: 1000;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
  background: white;
  border: ${({ $isEmpty }) => $isEmpty
        ? '2px dashed #777'
        : '2px solid var(--mantine-color-primary)'};
  border-radius: 4px;
  padding: ${({ $isEmpty }) => $isEmpty ? '5px' : '0'};
`;

// Props for the TongueGridQuiz component
interface TongueGridQuizProps {
    onCorrectPlacement?: () => void;
    onComplete?: () => void;
    showCorrectFeedback?: boolean;
}

const TongueGridQuiz: React.FC<TongueGridQuizProps> = ({
    onCorrectPlacement,
    onComplete,
    showCorrectFeedback = true
}) => {
    // State to track if the user has completed the quiz
    const [isComplete, setIsComplete] = useState(false);
    // Track the active grid cell for highlighting
    const [activeCell, setActiveCell] = useState<string | null>(null);
    // State for grid data that can be rearranged
    const [gridData, setGridData] = useState<GridCellData[]>([]);
    // Track the original "correct" positions for validation
    const [originalPositions, setOriginalPositions] = useState<Record<string, { row: number, col: number }>>({});
    // Track correct placements for feedback
    const [correctPlacements, setCorrectPlacements] = useState<Record<string, boolean>>({});
    // Track active drag item
    const [activeId, setActiveId] = useState<string | null>(null);

    const theme = useTheme();

    // Set up sensors for drag and drop
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5, // 5px movement required before drag starts
            },
        })
    );

    // Initialize grid data from vowels JSON, but randomly shuffle the positions
    useEffect(() => {
        try {
            // Access the tongue_position grid data from the JSON
            const sourceGrid = vowelsData.content.tongue_position.grid;
            const processedData: GridCellData[] = [];
            const originalPositionsMap: Record<string, { row: number, col: number }> = {};

            // Process each row in the grid to create cells with vowels
            sourceGrid.forEach((row, rowIndex) => {
                row.forEach((column, colIndex) => {
                    // Create a cell ID regardless of whether there are vowels
                    const cellId = `cell-${rowIndex}-${colIndex}`;

                    // Only add original positions if there are vowels
                    if (column && column.length > 0) {
                        column.forEach(vowel => {
                            originalPositionsMap[vowel.id] = { row: rowIndex, col: colIndex };
                        });

                        processedData.push({
                            id: cellId,
                            row: rowIndex,
                            col: colIndex,
                            vowels: column
                        });
                    } else {
                        // Create an empty cell that can still be dragged and dropped
                        processedData.push({
                            id: cellId,
                            row: rowIndex,
                            col: colIndex,
                            vowels: []
                        });
                    }
                });
            });

            // Save the original positions for validation
            setOriginalPositions(originalPositionsMap);

            // Shuffle the grid data for the quiz
            const shuffledData = [...processedData];
            shuffleArray(shuffledData);

            // Reassign positions after shuffle
            shuffledData.forEach((cell, index) => {
                const row = Math.floor(index / 3);
                const col = index % 3;
                cell.row = row;
                cell.col = col;
            });

            setGridData(shuffledData);
        } catch (error) {
            console.error('Error processing vowel grid data:', error);
        }
    }, []);

    // Fisher-Yates shuffle algorithm
    const shuffleArray = (array: any[]) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    };

    // Check if all cells are in their correct positions
    const checkCorrectPlacements = useCallback(() => {
        const newCorrectPlacements: Record<string, boolean> = {};
        let allCorrect = true;

        gridData.forEach(cell => {
            // For each vowel in the cell, check if it's in the right position
            cell.vowels.forEach(vowel => {
                const originalPos = originalPositions[vowel.id];
                const isCorrect = originalPos && originalPos.row === cell.row && originalPos.col === cell.col;
                newCorrectPlacements[vowel.id] = isCorrect;

                if (!isCorrect) {
                    allCorrect = false;
                }
            });
        });

        setCorrectPlacements(newCorrectPlacements);

        // If all positions are correct, set the quiz to complete
        if (allCorrect && !isComplete) {
            setIsComplete(true);
            onComplete && onComplete();
        }

        return allCorrect;
    }, [gridData, originalPositions, isComplete, onComplete]);

    // Handle drag start - improve to store the active cell data
    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        setActiveId(active.id as string);

        // Highlight the cell being dragged
        setActiveCell(active.id as string);

        // Play a subtle sound for better feedback
        try {
            const audio = new Audio('/sounds/drag-start.mp3');
            audio.volume = 0.3;
            audio.play().catch(() => console.log('Audio not supported or allowed'));
        } catch (e) {
            // Silently fail if audio isn't supported
        }
    };

    // Handle drag end - improved with better cell swapping
    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        // Clear the active state immediately
        setActiveId(null);
        setActiveCell(null);

        // Play completion sound for feedback
        try {
            const audio = new Audio('/sounds/drop.mp3');
            audio.volume = 0.3;
            audio.play().catch(() => console.log('Audio not supported or allowed'));
        } catch (e) {
            // Silently fail if audio isn't supported
        }

        // Only process if we have both a source and target
        if (!over || active.id === over.id) return;

        // Find the cells to swap
        const activeCellData = gridData.find(cell => cell.id === active.id);
        const overCellData = gridData.find(cell => cell.id === over.id);

        if (!activeCellData || !overCellData) return;

        // Swap positions
        setGridData(prev => {
            const newData = [...prev];

            // Find the indices
            const sourceIndex = newData.findIndex(cell => cell.id === active.id);
            const targetIndex = newData.findIndex(cell => cell.id === over.id);

            if (sourceIndex === -1 || targetIndex === -1) return prev;

            // Create copies of the cells
            const sourceCell = { ...newData[sourceIndex] };
            const targetCell = { ...newData[targetIndex] };

            // Swap row/column positions
            const tempRow = sourceCell.row;
            const tempCol = sourceCell.col;
            sourceCell.row = targetCell.row;
            sourceCell.col = targetCell.col;
            targetCell.row = tempRow;
            targetCell.col = tempCol;

            // Update the array with swapped cells
            newData[sourceIndex] = sourceCell;
            newData[targetIndex] = targetCell;

            return newData;
        });

        // After moving, check if positions are correct with slight delay to allow for animation
        setTimeout(() => {
            const correct = checkCorrectPlacements();
            if (correct && onCorrectPlacement) {
                onCorrectPlacement();

                // Play success sound
                try {
                    const audio = new Audio('/sounds/success.mp3');
                    audio.volume = 0.5;
                    audio.play().catch(() => console.log('Audio not supported or allowed'));
                } catch (e) {
                    // Silently fail if audio isn't supported
                }
            }
        }, 250);
    };

    // Create a draggable grid cell component
    const DraggableCellComponent = ({ cellData, isActive }: { cellData: GridCellData, isActive: boolean }) => {
        const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
            id: cellData.id,
            data: cellData
        });

        // Handle empty cells differently from cells with vowels
        const isEmpty = cellData.vowels.length === 0;

        // Only show active state during dragging or for completed cells
        const showActiveState = isDragging || (isComplete && isActive);

        return (
            <GridCell
                ref={setNodeRef}
                $isActive={showActiveState}
                $isOver={false}
                $isDragging={isDragging}
                onClick={() => { }} // Let the parent handle clicks
                style={{
                    cursor: isDragging ? 'grabbing' : 'grab',
                    // Add a subtle dotted border for empty cells to indicate they're interactive
                    border: isEmpty ? '1px dotted #777' : '1px solid black',
                    // Add a subtle background to empty cells to make them more visible
                    backgroundColor: isEmpty && !isDragging ? 'rgba(0,0,0,0.03)' : undefined
                }}
                {...attributes}
                {...listeners}
            >
                {isEmpty ? (
                    // For empty cells, add a visual indicator that they can be dragged
                    <div style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        border: '1px dashed #999',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        opacity: isDragging ? 0.8 : 0.4,
                        fontSize: '1rem'
                    }}>
                        {isDragging ? '✓' : '⇄'}
                    </div>
                ) : (
                    // For cells with vowels, render as before
                    cellData.vowels.map(vowel => {
                        // Only show correct position highlight when completed or during drag/hover
                        const isCorrectPosition = isComplete && correctPlacements[vowel.id];

                        return (
                            <VowelButtonQuiz
                                key={vowel.id}
                                isActive={isCorrectPosition}
                            >
                                {vowel.ipa}
                            </VowelButtonQuiz>
                        );
                    })
                )}
            </GridCell>
        );
    };

    // Create a droppable cell container
    const DroppableCellContainer = ({ id, children, onActiveChange }: {
        id: string,
        children: React.ReactNode,
        onActiveChange: (isActive: boolean) => void
    }) => {
        const { isOver, setNodeRef } = useDroppable({
            id,
            data: { type: 'cell' }
        });

        // Only trigger the active change when a cell becomes a drop target
        useEffect(() => {
            onActiveChange(isOver);
            // When dropping ends, active state should be cleared
            return () => {
                if (!isOver) onActiveChange(false);
            };
        }, [isOver, onActiveChange]);

        return (
            <div ref={setNodeRef} style={{ width: '100%', height: '100%' }}>
                {children}
            </div>
        );
    };

    // Find which cell should render at a specific grid position
    const getCellAtPosition = (row: number, col: number) => {
        const cell = gridData.find(cell => cell.row === row && cell.col === col);
        const isActive = cell && activeCell === cell.id;
        const cellId = cell ? cell.id : `empty-${row}-${col}`;

        // If no cell found at this position (should not happen anymore with our updated initialization)
        if (!cell) {
            console.warn(`No cell found at position (${row}, ${col}). This should not happen.`);
            return (
                <GridCell key={cellId} $isActive={false} />
            );
        }

        // Check if this cell has vowels in their correct positions
        // Only highlight correct placements when the quiz is completed
        const hasCorrectPlacements = isComplete &&
            cell.vowels.length > 0 &&
            cell.vowels.some(vowel => {
                const originalPos = originalPositions[vowel.id];
                return originalPos && originalPos.row === cell.row && originalPos.col === cell.col;
            });

        // Return a droppable container with a draggable cell inside
        return (
            <DroppableCellContainer
                key={cellId}
                id={cellId}
                onActiveChange={(isOver) => {
                    // Only update active cell state when a cell is being dragged over
                    if (isOver && activeId) {
                        setActiveCell(cellId);
                    }
                }}
            >
                <DraggableCellComponent
                    cellData={cell}
                    isActive={!!(hasCorrectPlacements || isActive)}
                />
            </DroppableCellContainer>
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
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
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

                {/* Feedback when quiz is completed */}
                {showCorrectFeedback && (
                    <QuizFeedback $correct={isComplete}>
                        Correct! You've placed all vowels in their proper positions.
                    </QuizFeedback>
                )}

                {/* Improved drag overlay with better styling */}
                <DragOverlay>
                    {activeId ? (
                        (() => {
                            const cell = gridData.find(c => c.id === activeId);
                            if (!cell) return null;

                            const isEmpty = cell.vowels.length === 0;

                            return (
                                <DragOverlayStyles $isEmpty={isEmpty}>
                                    <DraggableCellComponent
                                        cellData={cell}
                                        isActive={true}
                                    />
                                </DragOverlayStyles>
                            );
                        })()
                    ) : null}
                </DragOverlay>
            </TonguePositionWrapper>
        </DndContext>
    );
};

export default TongueGridQuiz;
