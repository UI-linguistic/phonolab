// src/features/learn/Vowels101/components/LipSection.tsx
import React, { useState } from 'react';
import { SectionContainer } from '../Vowels101.styles';
import { LessonSection } from '../types';
import { VowelGrid } from './VowelGrid';
import { useAudio } from './useAudio';
import { ImageDisplay } from './ImageDisplay';

interface Props { section: LessonSection; }

export const LipSection: React.FC<Props> = ({ section }) => {
  const [hovered, setHovered] = useState<number | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const { play } = useAudio();

  const cell = section.cells.find(c => c.id === selected);
  const lipSrc = cell?.vowels[0]?.lip_image_url;

  return (
    <SectionContainer>
      <VowelGrid
        cells={section.cells}
        hoveredId={hovered}
        selectedId={selected}
        onHover={(id, enter) => setHovered(enter ? id : null)}
        onSelect={id => {
          setSelected(id);
          const url = section.cells.find(c => c.id === id)?.vowels[0].audio_url;
          if (url) play(url);
        }}
      />
      <ImageDisplay src={lipSrc} alt="Lip shape" />
    </SectionContainer>
  );
};