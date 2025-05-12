import React from 'react';
import { GridItem } from '@components/display/ConfigurableGrid';
import { Vowel } from '@api/types';
import { PhonemeCell } from './PhonemeCell';

// Define the structure for our grid positions
export interface GridPosition {
    row: number;
    col: number;
}

// Define the structure for a cell in our quiz grid
export interface QuizCell {
    id: string;
    content: React.ReactNode;
    vowels: Vowel[];
    correctPosition: GridPosition;
    currentPosition?: GridPosition;
}

// Define the structure for our quiz state
export interface GridQuizState {
    cells: QuizCell[];
    gridSize: number; // 3 for a 3x3 grid
    isComplete: boolean;
    score: number;
}

// Define the structure for the tongue position data from JSON
interface TonguePositionRow {
    row: string;
    columns: {
        Front: string[];
        Central: string[];
        Back: string[];
    };
}

interface TonguePositionData {
    title: string;
    description: string;
    grid: TonguePositionRow[];
}

class GridQuizService {
    // Convert the tongue position data to a flat array of cells
    parseTonguePositionData(data: TonguePositionData[], vowels: Vowel[]): QuizCell[] {
        const cells: QuizCell[] = [];

        if (!data || !data[0] || !data[0].grid) {
            console.error('Invalid tongue position data');
            return [];
        }

        const grid = data[0].grid;

        // Map the grid data to our cell structure
        grid.forEach((rowData, rowIndex) => {
            const columnTypes = ['Front', 'Central', 'Back'];

            columnTypes.forEach((colType, colIndex) => {
                const ipaSymbols = rowData.columns[colType as keyof typeof rowData.columns] || [];

                // Find vowels that match the IPA symbols in this cell
                const cellVowels = vowels.filter(vowel =>
                    ipaSymbols.includes(vowel.ipa)
                );

                // Create content for the cell using PhonemeCell component
                const content = 'string';

                cells.push({
                    id: `cell-${rowIndex}-${colIndex}`,
                    content,
                    vowels: cellVowels,
                    correctPosition: { row: rowIndex, col: colIndex }
                });
            });
        });

        return cells;
    }

    // Create a new quiz with randomized cell positions
    createQuiz(cells: QuizCell[], gridSize: number = 3): GridQuizState {
        // Ensure we have the right number of cells
        if (cells.length !== gridSize * gridSize) {
            console.error(`Expected ${gridSize * gridSize} cells, got ${cells.length}`);
            // If we don't have enough cells, pad with empty ones
            while (cells.length < gridSize * gridSize) {
                cells.push({
                    id: `empty-${cells.length}`,
                    content: 'string',
                    vowels: [],
                    correctPosition: {
                        row: Math.floor(cells.length / gridSize),
                        col: cells.length % gridSize
                    }
                });
            }
            // If we have too many cells, truncate
            if (cells.length > gridSize * gridSize) {
                cells = cells.slice(0, gridSize * gridSize);
            }
        }

        // Randomize the current positions (for initial state)
        const shuffledCells = this.shuffleCells([...cells], gridSize);

        return {
            cells: shuffledCells,
            gridSize,
            isComplete: false,
            score: 0
        };
    }

    // Shuffle cells to random positions
    shuffleCells(cells: QuizCell[], gridSize: number): QuizCell[] {
        // Fisher-Yates shuffle algorithm
        for (let i = cells.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [cells[i], cells[j]] = [cells[j], cells[i]];
        }

        // Update current positions after shuffle
        return cells.map((cell, index) => {
            const row = Math.floor(index / gridSize);
            const col = index % gridSize;
            return { ...cell, currentPosition: { row, col } };
        });
    }

    // Check if the current arrangement is correct
    checkAnswer(state: GridQuizState): { isCorrect: boolean; score: number; feedback: string } {
        const { cells } = state;
        let correctCount = 0;

        for (const cell of cells) {
            if (
                cell.correctPosition.row === cell.currentPosition?.row &&
                cell.correctPosition.col === cell.currentPosition?.col
            ) {
                correctCount++;
            }
        }

        const totalCells = cells.length;
        const score = Math.round((correctCount / totalCells) * 100);
        const isCorrect = correctCount === totalCells;

        let feedback = '';
        if (isCorrect) {
            feedback = 'Perfect! All phonemes are in the correct position.';
        } else if (score >= 70) {
            feedback = 'Almost there! A few phonemes are still out of place.';
        } else if (score >= 40) {
            feedback = 'Good progress, but several phonemes need to be rearranged.';
        } else {
            feedback = 'Keep trying! Most phonemes are not in the correct position yet.';
        }

        return { isCorrect, score, feedback };
    }

    // Convert quiz cells to format needed by ConfigurableGrid
    cellsToGridItems(cells: QuizCell[]): GridItem[] {
        // Sort by current position
        const sortedCells = [...cells].sort((a, b) => {
            const aPos = a.currentPosition || { row: 0, col: 0 };
            const bPos = b.currentPosition || { row: 0, col: 0 };

            // Calculate flat index based on row and column
            const aIndex = aPos.row * 3 + aPos.col;
            const bIndex = bPos.row * 3 + bPos.col;

            return aIndex - bIndex;
        });

        // Convert to GridItems
        return sortedCells.map(cell => ({
            id: cell.id,
            content: cell.content,
            data: cell
        }));
    }

    // Generate demo quiz data if we don't have real data yet
    generateDemoQuiz(gridSize: number = 3): GridQuizState {
        const cells: QuizCell[] = [];

        // Create cells with phoneme symbols
        const demoPhonemes = ['i', 'ɪ', 'e', 'ɛ', 'æ', 'ʌ', 'ɑ', 'ʊ', 'u'];

        for (let i = 0; i < gridSize * gridSize; i++) {
            const row = Math.floor(i / gridSize);
            const col = i % gridSize;

            const vowel = {
                id: i,
                ipa: demoPhonemes[i],
                audio_url: ''
            } as Vowel;

            cells.push({
                id: `cell-${i}`,
                content: String(vowel.ipa),
                vowels: [vowel],
                correctPosition: { row, col }
            });
        }

        return this.createQuiz(cells, gridSize);
    }
}

export default new GridQuizService();
