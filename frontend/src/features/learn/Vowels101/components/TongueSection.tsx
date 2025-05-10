// src/features/learn/Vowels101/components/TongueSection.tsx
import React from 'react';
import styled from 'styled-components';
import type { LessonSection, Vowel } from '../types';
import { Placement } from '@components/ui/Grid';
import { Grid } from '@components/ui';
import { useAudio } from './useAudio';
import { SubtitleContainer } from '@components/typography/PageTypography';

interface TongueSectionProps {
    sections: LessonSection[];
}


export const TongueSection: React.FC<TongueSectionProps> = ({ sections }) => {
    const { play } = useAudio();

    // Flatten all LessonSection.cells into one array
    const allCells = sections.flatMap(sec => sec.cells);

    // Build the 3×3 placement matrix
    const placements: Placement[] = [];
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            const match = allCells.find(c => c.row === row && c.col === col);
            placements.push({
                id: `${row}-${col}`,
                row,
                col,
                frames: match ? match.vowels : []
            });
        }
    }

    return (
        <SectionContainer>
            <Pane>
                <SubtitleContainer>
                    {sections.map(sec => (
                        <div key={sec.id}>
                            <h3>{sec.name}</h3>
                            <p>Explanation for this tongue section…</p>
                        </div>
                    ))}
                </SubtitleContainer>
            </Pane>

            <Pane>
                <Grid
                    mode="lesson"
                    items={placements}
                    onReorder={() => { }}
                    activeCellId={null}
                    activeVowelId={null}
                    onFrameClick={(_cellId: string, vowel: Vowel) => {
                        play(vowel.audio_url);
                    }}
                />
            </Pane>

            <Pane>
                {/* Placeholder image */}
                <img src="/images/tongue-diagram.png" alt="Tongue diagram" />
            </Pane>
        </SectionContainer>
    );
};

const SectionContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.2fr 1fr;
  gap: ${({ theme }) => theme.spacing.medium};

  padding: ${({ theme }) => theme.spacing.medium};
  outline: 2px dashed rgba(128, 0, 128, 0.6);
`;

const Pane = styled.div`
  padding: ${({ theme }) => theme.spacing.medium};


  outline: 1px dashed rgba(0, 128, 128, 0.6); /* teal: pane */
`;