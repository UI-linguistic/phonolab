// src/features/learn/Vowels101/components/LengthSection.tsx
// Vowels101/components/LengthSection.tsx
import React from 'react';
import { LengthList, LengthItem } from '../Vowels101.styles';
import { LessonSection } from '../types';

interface Props { section: LessonSection; }

export const LengthSection: React.FC<Props> = ({ section }) => (
    <LengthList>
        {section.cells.map(cell => (
            <LengthItem key={cell.id}>
                {cell.vowels.map(v => v.ipa).join(', ')}
            </LengthItem>
        ))}
    </LengthList>
);