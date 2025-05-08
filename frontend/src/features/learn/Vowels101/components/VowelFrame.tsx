// src/features/learn/Vowels101/components/VowelFrame.tsx
import React from 'react';
import styled from 'styled-components';
import type { VowelGridCell } from '../types';
import { VowelBubble } from './VowelBubble';

const Frame = styled.div`
  border: 1px solid #333;
  min-height: 4rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

interface Props {
    cell: VowelGridCell;
    selectedVowelId: number | null;
    onSelectVowel: (id: number) => void;
}

export const VowelFrame: React.FC<Props & React.HTMLAttributes<HTMLDivElement>> = ({
    cell,
    selectedVowelId,
    onSelectVowel,
    style,
}) => {
    return (
        <Frame style={style}>
            {cell.vowels.map(v => (
                <VowelBubble
                    key={v.id}
                    vowel={v}
                    isSelected={v.id === selectedVowelId}
                    onSelect={onSelectVowel}
                />
            ))}
        </Frame>
    );
};
