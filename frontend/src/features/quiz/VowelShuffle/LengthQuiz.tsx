// src/features/quiz/VowelShuffle/LengthQuiz.tsx

import React from 'react';
import { InteractiveCollection, PhonemeBox } from '../../../components/ui';
import type { VowelSection } from './vowelShuffleService';
import type { Phoneme } from './useVowelShuffleQuiz';

export default function LengthQuiz({
    section,
    onSubmit,
    sectionNumber,
    totalSections,
}: {
    section: VowelSection<Phoneme>;
    onSubmit: (order: string[]) => Promise<void>;
    sectionNumber: number;
    totalSections: number;
}) {
    const groups = section.groups; // T[][]

    // track dropped IDs per column index
    const [assigned, setAssigned] = React.useState<Record<number, string[]>>({});

    // normalize dropped to array, then record IDs
    const handleDrop = (idx: number) => (dropped: Phoneme | Phoneme[]) => {
        const arr = Array.isArray(dropped) ? dropped : [dropped];
        setAssigned(a => ({
            ...a,
            [idx]: arr.map(p => p.id),
        }));
    };

    // flatten and submit
    const handleSubmit = async () => {
        const flat = Object.values(assigned).flat();
        await onSubmit(flat);
    };

    // reset assignments
    const handleReset = () => setAssigned({});

    return (
        <>
            <h2>{section.title}</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {groups.map((groupItems, idx) => (
                    <InteractiveCollection<Phoneme>
                        key={idx}
                        items={groupItems}
                        getItemId={(p) => p.id}
                        renderItem={(p) => <PhonemeBox label={p.symbol} mode="v1" />}
                        layout={{ type: 'column', gap: 4 }}
                        mode="group"
                        dropZoneId={`length-target-${idx}`}
                        onDrop={handleDrop(idx)}
                        onReorder={() => { }}
                    />
                ))}
            </div>

            <button
                disabled={Object.keys(assigned).length === 0}
                onClick={handleSubmit}
            >
                Submit
            </button>
            <button onClick={handleReset}>Reset</button>

            <div>
                {sectionNumber}/{totalSections}
            </div>
        </>
    );
}
