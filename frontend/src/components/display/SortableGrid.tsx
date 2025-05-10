// src/components/SortableGrid.tsx
import React from 'react';
import {
    DndContext, useSensor, useSensors, PointerSensor,
} from '@dnd-kit/core';
import {
    SortableContext, rectSortingStrategy, arrayMove,
} from '@dnd-kit/sortable';
import { SimpleGrid } from '@mantine/core';
import { Cell } from './Cell';
import { SortableItem } from './SortableItem'; // see below

interface Item { id: string; label: string; }

export function SortableGrid({
    items,
    setItems,
}: {
    items: Item[];
    setItems: (next: Item[] | ((prev: Item[]) => Item[])) => void;
}) {
    const sensors = useSensors(useSensor(PointerSensor));

    return (
        <DndContext
            sensors={sensors}
            onDragEnd={({ active, over }) => {
                if (over && active.id !== over.id) {
                    setItems((arr: Item[]) => {
                        const oldIdx = arr.findIndex((i: Item) => i.id === active.id);
                        const newIdx = arr.findIndex((i: Item) => i.id === over.id);
                        return arrayMove(arr, oldIdx, newIdx);
                    });
                }
            }}
        >
            <SortableContext items={items.map((i) => i.id)} strategy={rectSortingStrategy}>
                <SimpleGrid cols={5} spacing="xs">
                    {items.map((it) => (
                        <SortableItem key={it.id} id={it.id}>
                            <Cell>{it.label}</Cell>
                        </SortableItem>
                    ))}
                </SimpleGrid>
            </SortableContext>
        </DndContext>
    );
}
