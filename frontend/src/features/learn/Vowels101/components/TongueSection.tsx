// ============================================
// File: src/components/Vowels101/TongueSection.tsx
// ============================================
import React, { useState } from 'react';
import { SectionContainer } from '../Vowels101.styles';
import type { LessonSection } from '../types';
import { VowelGrid } from './VowelGrid';
import { ImageDisplay } from './ImageDisplay';
import { useAudio } from './useAudio';

interface Props {
    section: LessonSection;
}

export const TongueSection: React.FC<Props> = ({ section }) => {
    console.log('TongueSection: Rendering with section:', section);

    const [selectedVowelId, setSelectedVowelId] = useState<number | null>(null);
    const { play } = useAudio();

    const selectedCell = section.cells.find(cell =>
        cell.vowels.some(v => v.id === selectedVowelId)
    );
    const tongueSrc = selectedCell
        ? selectedCell.vowels.find(v => v.id === selectedVowelId)?.tongue_image_url
        : undefined;

    return (
        <SectionContainer>
            <VowelGrid
                cells={section.cells}
                selectedVowelId={selectedVowelId}
                onSelectVowel={(id: number) => {
                    setSelectedVowelId(id);
                    const url = section.cells
                        .flatMap(c => c.vowels)
                        .find(v => v.id === id)
                        ?.audio_url;
                    if (url) play(url);
                }}
            />

            <ImageDisplay src={tongueSrc} alt="Tongue position" />
        </SectionContainer>
    );
};
