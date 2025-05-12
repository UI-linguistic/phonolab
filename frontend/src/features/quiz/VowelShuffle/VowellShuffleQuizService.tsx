import { GridItem } from '@components/display/ConfigurableGrid';

export interface GridPosition {
    row: number;
    col: number;
}

export interface GridCell {
    id: string;
    content: React.ReactNode;
    correctPosition?: GridPosition; // Where this cell should be placed
    currentPosition?: GridPosition; // Where it currently is
}

export interface GridQuizState {
    cells: GridCell[];
    gridSize: number; // e.g., 3 for a 3x3 grid
    isComplete: boolean;
    score: number;
}

export default GridQuizState;
