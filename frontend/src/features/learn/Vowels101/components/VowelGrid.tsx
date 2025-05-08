import React, { useState } from 'react';
import styled from 'styled-components';
import { VowelGridCell, Vowel } from '../types';
import { VowelCell } from './VowelCell';

interface Props {
    cells: VowelGridCell[];
    selectedVowelId: number | null;
    onSelectVowel: (id: number) => void;
}

export const VowelGrid: React.FC<Props> = ({ cells, selectedVowelId, onSelectVowel }) => {
    const [hoveredCellId, setHoveredCellId] = useState<number | null>(null);
    const [hoveredVowelId, setHoveredVowelId] = useState<number | null>(null);

    // Find max rows and columns to determine grid size
    const maxRow = Math.max(...cells.map(cell => cell.row), 0);
    const maxCol = Math.max(...cells.map(cell => cell.col), 0);

    // Create a 2D grid structure
    const grid: (VowelGridCell | null)[][] = Array(maxRow + 1)
        .fill(null)
        .map(() => Array(maxCol + 1).fill(null));

    // Place cells in the grid
    cells.forEach(cell => {
        grid[cell.row][cell.col] = cell;
    });

    return (
        <GridContainer rows={maxRow + 1} cols={maxCol + 1}>
            {grid.map((row, rowIndex) =>
                row.map((cell, colIndex) => {
                    if (!cell) return <EmptyCell key={`empty-${rowIndex}-${colIndex}`} />;

                    const isHovered = hoveredCellId === cell.id;
                    const isSelected = cell.vowels.some(v => v.id === selectedVowelId);

                    return (
                        <VowelCell
                            key={cell.id}
                            cell={cell}
                            isHovered={isHovered}
                            isSelected={isSelected}
                            onHover={(enter) => setHoveredCellId(enter ? cell.id : null)}
                            onClick={() => {
                                // If cell has only one vowel, select it
                                if (cell.vowels.length === 1) {
                                    onSelectVowel(cell.vowels[0].id);
                                }
                                // For multiple vowels, we'll handle clicks in the VowelBubble component
                            }}
                        >
                            {/* Render individual vowel bubbles */}
                            <VowelBubbleContainer>
                                {cell.vowels.map(vowel => (
                                    <VowelBubble
                                        key={vowel.id}
                                        isSelected={vowel.id === selectedVowelId}
                                        isHovered={vowel.id === hoveredVowelId}
                                        onMouseEnter={() => setHoveredVowelId(vowel.id)}
                                        onMouseLeave={() => setHoveredVowelId(null)}
                                        onClick={(e) => {
                                            e.stopPropagation(); // Prevent cell click
                                            onSelectVowel(vowel.id);
                                        }}
                                    >
                                        {vowel.ipa}
                                    </VowelBubble>
                                ))}
                            </VowelBubbleContainer>
                        </VowelCell>
                    );
                })
            )}
        </GridContainer>
    );
};

const GridContainer = styled.div<{ rows: number; cols: number }>`
  display: grid;
  grid-template-rows: repeat(${props => props.rows}, 80px);
  grid-template-columns: repeat(${props => props.cols}, 80px);
  gap: 8px;
  margin-bottom: 20px;
`;

const EmptyCell = styled.div`
  background: transparent;
`;

const VowelBubbleContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  width: 100%;
  height: 100%;
`;

const VowelBubble = styled.div<{ isSelected: boolean; isHovered: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  font-weight: ${props => (props.isSelected ? 'bold' : 'normal')};
  cursor: pointer;
  transition: all 0.2s ease;
  
  /* Yellow highlight for hovered vowel */
  background-color: ${props =>
        props.isSelected ? 'var(--color-primary)' :
            props.isHovered ? 'rgba(255, 220, 0, 0.7)' :
                'transparent'
    };
  
  color: ${props => props.isSelected ? 'white' : 'black'};
  
  &:hover {
    transform: scale(1.05);
  }
`;
