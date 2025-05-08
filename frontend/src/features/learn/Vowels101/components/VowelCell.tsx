// ============================================
// File: src/components/Vowels101/VowelCell.tsx
// ============================================
import React from 'react';
import { Cell } from '../Vowels101.styles';
import { VowelGridCell } from '../types';

interface Props {
    cell: VowelGridCell;
    isHovered: boolean;
    isSelected: boolean;
    onHover: (enter: boolean) => void;
    onClick: () => void;
}

export const VowelCell: React.FC<Props> = ({ cell, isHovered, isSelected, onHover, onClick }) => {
    const ipa = cell.vowels[0]?.ipa;
    return (
        <Cell
            hovered={isHovered}
            selected={isSelected}
            onMouseEnter={() => onHover(true)}
            onMouseLeave={() => onHover(false)}
            onClick={onClick}
        >
            {ipa}
        </Cell>
    );
};
