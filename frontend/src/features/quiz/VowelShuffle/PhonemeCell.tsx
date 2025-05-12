import { GridPosition } from './GridService';
import { Vowel } from '@api/types';

/**
 * Represents a cell in the phoneme grid with a vowel and position information
 */
export interface PhonemeCell {
    /**
     * Unique identifier for the cell
     */
    id: string | number;

    /**
     * The vowel phoneme associated with this cell
     */
    vowel: Vowel;

    /**
     * The correct position this cell should be in
     */
    correctPosition: GridPosition;

    /**
     * The current position of this cell in the grid
     */
    currentPosition: GridPosition;

    /**
     * Optional label for the cell (may be used for additional information)
     */
    label?: string;

    /**
     * Optional description or hint about the phoneme
     */
    description?: string;
}

/**
 * Factory function to create a new PhonemeCell
 */
export function createPhonemeCell(
    id: string | number,
    vowel: Vowel,
    correctPosition: GridPosition,
    currentPosition?: GridPosition,
    label?: string,
    description?: string
): PhonemeCell {
    return {
        id,
        vowel,
        correctPosition,
        currentPosition: currentPosition || { ...correctPosition },
        label,
        description,
    };
}

/**
 * Checks if two positions are equal
 */
export function arePositionsEqual(pos1: GridPosition, pos2: GridPosition): boolean {
    return pos1.row === pos2.row && pos1.col === pos2.col;
}

/**
 * Calculates the distance between two positions (Manhattan distance)
 */
export function getPositionDistance(pos1: GridPosition, pos2: GridPosition): number {
    return Math.abs(pos1.row - pos2.row) + Math.abs(pos1.col - pos2.col);
}

/**
 * Converts a PhonemeCell to a display format suitable for the grid
 */
export function phonemeCellToDisplay(cell: PhonemeCell): {
    id: string | number;
    content: string;
    description?: string;
} {
    return {
        id: cell.id,
        content: cell.vowel.ipa,
        description: cell.description || `${cell.vowel.ipa} phoneme`,
    };
}
