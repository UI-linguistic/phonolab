// src/features/learn/Vowels101/components/LipSection.tsx
import React from 'react';
import styled from 'styled-components';
import type { LessonSection } from '../types';
import { Illustration } from '@components/ui';

interface LipSectionProps {
  sections: LessonSection[];
}

export const LipSection: React.FC<LipSectionProps> = ({ sections }) => (
  <SectionContainer>
    {sections.map(sec => (
      <SectionGroup key={sec.id}>
        <h3>{sec.name}</h3>
        <CellsGrid>
          {sec.cells.map(cell => {
            // take the first vowel in this cell (if any)
            const vowel = cell.vowels[0];
            if (!vowel) return null;
            return (
              <Pane key={cell.id}>
                <Illustration
                  src={vowel.lip_image_url}
                  alt={`${sec.name} – cell ${cell.id}`}
                  size="medium"
                />
                <Caption>Cell {cell.row},{cell.col}</Caption>
              </Pane>
            );
          })}
        </CellsGrid>
      </SectionGroup>
    ))}
  </SectionContainer>
);

const SectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.large};
`;

const SectionGroup = styled.div`
  outline: 1px dashed rgba(128, 0, 128, 0.6); /* debug */
  padding: ${({ theme }) => theme.spacing.medium};
`;

const CellsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: ${({ theme }) => theme.spacing.medium};
  margin-top: ${({ theme }) => theme.spacing.medium};
`;

const Pane = styled.div`
  text-align: center;
`;

const Caption = styled.div`
  margin-top: ${({ theme }) => theme.spacing.small};
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textSubtle};
`;
