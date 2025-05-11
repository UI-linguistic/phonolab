/**
 * SortableGrid.tsx
 * 
 * A grid where you can drag and drop items to reorder them.
 * 
 * What It Does:
 * • Shows items in a grid layout
 * • Lets you drag items to new positions
 * • Updates order automatically
 * • Works with any content
 * 
 * Props You Can Use:
 * • items: Array of {id, content} objects
 * • onSort: Function to run when order changes
 * • cols: Number of columns (1-4)
 * • spacing: "sm" or "md" for gaps
 * 
 * Usage Example:
 * ```tsx
 * const items = [
 *   { id: '1', content: <VowelCard /> },
 *   { id: '2', content: <VowelCard /> }
 * ];
 * 
 * <SortableGrid
 *   items={items}
 *   onSort={(newOrder) => console.log('New order:', newOrder)}
 *   cols={2}
 *   spacing="md"
 * />
 * ```
 */

// React and core dependencies
import React from 'react';

// DND Kit components
import {
    DndContext,
    useSensor,
    useSensors,
    PointerSensor,
} from '@dnd-kit/core';
import {
    SortableContext,
    rectSortingStrategy,
    arrayMove,
} from '@dnd-kit/sortable';

// Mantine UI components
import { SimpleGrid } from '@mantine/core';

// Local components
import { Cell } from '@components/display/Cell';
import { SortableItem } from '@components/display/SortableItem';

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
