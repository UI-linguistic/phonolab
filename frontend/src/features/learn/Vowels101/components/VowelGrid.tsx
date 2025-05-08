// ============================================
// File: src/components/Vowels101/Tabs.tsx
// ============================================
import React from 'react';
import { Grid } from '../Vowels101.styles';
import { VowelGridCell } from '../types';
import { VowelCell } from './VowelCell';

interface Props {
    cells: VowelGridCell[];
    hoveredId: number | null;
    selectedId: number | null;
    onHover: (id: number, enter: boolean) => void;
    onSelect: (id: number) => void;
}

export const VowelGrid: React.FC<Props> = ({ cells, hoveredId, selectedId, onHover, onSelect }) => (
    <Grid>
        {cells.map(cell => (
            <VowelCell
                key={cell.id}
                cell={cell}
                isHovered={hoveredId === cell.id}
                isSelected={selectedId === cell.id}
                onHover={enter => onHover(cell.id, enter)}
                onClick={() => onSelect(cell.id)}
            />
        ))}
    </Grid>
);