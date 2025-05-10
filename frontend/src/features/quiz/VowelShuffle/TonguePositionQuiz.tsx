// TonguePositionQuiz.tsx
import React from 'react';
import { InteractiveCollection, PhonemeBox } from '../../../components/ui';
import type { VowelSection } from './vowelShuffleService';
import { Phoneme } from './useVowelShuffleQuiz';

export default function TonguePositionQuiz({
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
    // 1) Extract the single group of items for tongue position:
    const items = section.groups[0];

    // 2) Use the matching correctGroups[0] as your initial and reset state:
    const correct = section.correctGroups[0];

    const [order, setOrder] = React.useState<string[]>(() => [...correct]);

    return (
        <>
            <h2>{section.title}</h2>
            <InteractiveCollection<Phoneme>
                items={items}
                getItemId={(p) => p.id}
                renderItem={(p) => <PhonemeBox label={p.symbol} mode="v1" />}
                layout={{ type: 'grid', columns: 3, gap: 8 }}
                mode="reorder"
                dropZoneId=""
                onReorder={(newItems) =>
                    setOrder(newItems.map((p) => p.id))
                }
                onDrop={() => { }}
            />

            <button onClick={() => onSubmit(order)}>Submit</button>
            <button onClick={() => setOrder([...correct])}>Reset</button>
            <div>{sectionNumber}/{totalSections}</div>
        </>
    );
}