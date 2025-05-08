// ============================================
// File: src/features/learn/Vowels101/components/BackButtonRow.tsx
// ============================================
import React from 'react';
import { BackRow } from '../Vowels101.styles';
import BackButton from '@components/navigation/BackButton';

export function BackButtonRow() {
    return (
        <BackRow>
            <BackButton to="/learn/vowels-101" />
        </BackRow>
    );
}
