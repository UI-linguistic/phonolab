// src/features/learn/Vowels101/components/VowelBubble.tsx
import React from 'react';
import styled from 'styled-components';
import type { Vowel } from '../types';

const Bubble = styled.span<{ isSelected: boolean }>`
  display: inline-block;
  margin: 0.25rem;
  padding: 0.5rem;
  border-radius: 0.25rem;
  background: ${({ isSelected }) => (isSelected ? '#ff0' : '#fff')};
  cursor: pointer;
  user-select: none;
  &:hover {
    background: #ffea00;
  }
`;

interface Props {
    vowel: Vowel;
    isSelected: boolean;
    onSelect: (id: number) => void;
}

export const VowelBubble: React.FC<Props> = ({ vowel, isSelected, onSelect }) => {
    const play = () => new Audio(vowel.audio_url).play();
    return (
        <Bubble
            isSelected={isSelected}
            onClick={() => {
                onSelect(vowel.id);
                play();
            }}
        >
            {vowel.ipa}
        </Bubble>
    );
};
