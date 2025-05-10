// src/features/quiz/VowelShuffle/VowelShuffleIntro.tsx
import React from 'react';
import { InstructionBox } from '../../../components/ui';
import { useNavigate } from 'react-router-dom';


export default function VowelShuffleIntro() {
    const nav = useNavigate();
    return (
        <InstructionBox mode="v1" direction="column" gap={16}>
            <p>
                You will be shown the three vowel categories: tongue position, lip
                shape, and length. Then drag them into their correct spots.
            </p>
            <button onClick={() => nav('start')}>
                Start
            </button>
        </InstructionBox>
    );
}