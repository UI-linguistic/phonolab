// src/features/learn/Vowels101/components/LengthSection.tsx
import React from 'react';
import styled from 'styled-components';
import { TextSection, Illustration } from '@components/ui';
import type { LessonSection } from '../types';

interface LengthSectionProps {
    sections: LessonSection[];
}

export const LengthSection: React.FC<LengthSectionProps> = ({ sections }) => (
    <SectionContainer>
        {sections.map(sec => (
            <Pane key={sec.id}>
                <h3>{sec.name}</h3>
                <TableWrapper>
                    <table>
                        <thead>
                            <tr>
                                <th>Cell</th>
                                <th>Length</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sec.cells.map(cell => (
                                <tr key={cell.id}>
                                    <td>{`(${cell.row},${cell.col})`}</td>
                                    <td>{cell.length_type || '—'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </TableWrapper>
            </Pane>
        ))}
    </SectionContainer>
);

const SectionContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.5fr 1fr;
  gap: ${({ theme }) => theme.spacing.medium};
`;

const Pane = styled.div`
  padding: ${({ theme }) => theme.spacing.medium};
`;

const TableWrapper = styled.div`
  overflow-x: auto;
  table {
    width: 100%;
    border-collapse: collapse;
    th, td {
      border: 1px solid ${({ theme }) => theme.colors.greyLight};
      padding: ${({ theme }) => theme.spacing.small};
      text-align: center;
    }
  }
`;
