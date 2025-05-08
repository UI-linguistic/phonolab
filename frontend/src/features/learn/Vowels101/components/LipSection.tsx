// src/features/learn/Vowels101/components/LipSection.tsx
import React, { useState } from 'react';
import { SectionContainer } from '../Vowels101.styles';
import type { LessonSection } from '../types';
import { VowelGrid } from './VowelGrid';
import { ImageDisplay } from './ImageDisplay';
import { useAudio } from './useAudio';

interface Props {
  section: LessonSection;
}

export const LipSection: React.FC<Props> = ({ section }) => {
  const [selectedVowelId, setSelectedVowelId] = useState<number | null>(null);
  const { play } = useAudio();

  const selectedCell = section.cells.find(cell =>
    cell.vowels.some(v => v.id === selectedVowelId)
  );
  const lipSrc = selectedCell
    ? selectedCell.vowels.find(v => v.id === selectedVowelId)?.lip_image_url
    : undefined;

  const handleVowelSelect = (id: number) => {
    setSelectedVowelId(id);
    const vowel = section.cells
      .flatMap(c => c.vowels)
      .find(v => v.id === id);

    if (vowel?.audio_url) {
      play(vowel.audio_url);
    }
  };

  return (
    <SectionContainer>
      <VowelGrid
        cells={section.cells}
        selectedVowelId={selectedVowelId}
        onSelectVowel={handleVowelSelect}
      />

      <ImageDisplay src={lipSrc} alt="Lip shape" />
    </SectionContainer>
  );
};
