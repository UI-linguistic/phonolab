/**
 * InteractiveCollection.tsx
 *
 * Extends Collection with full DnDKit drag‑and‑drop support:
 *
 * Modes (`mode` prop):
 *  - single:   Drag a single item into a designated drop zone
 *  - group:    Drag the entire set of items as one unit into a drop zone
 *  - reorder:  Reorder items in place (column, row, or grid)
 *
 * Key behaviors:
 *  • Wraps in <DndContext> with collisionDetection=closestCenter
 *  • In ‘single’ or ‘group’ mode:
 *      – Uses useDraggable to make either the one item or the entire Collection draggable
 *      – Accepts one drop target via `dropZoneId` and fires `onDrop`
 *  • In ‘reorder’ mode:
 *      – Uses SortableContext + useSortable on each item
 *      – Fires `onReorder` with the new array order after drag end
 *  • Requires a `getItemId` callback to map data → stable IDs/keys for DnDKit
 *
 * Props:
 *  • items:        T[]                            — array of data items
 *  • getItemId:    (item) ⇒ string                — returns unique ID for each item
 *  • renderItem:   (item, index) ⇒ ReactNode      — UI for each item (no ID/key needed)
 *  • layout:       CollectionLayout              — passes directly to Collection
 *  • mode:         'single'|'group'|'reorder'      — DnD behavior
 *  • dropZoneId:   string                         — the droppable target ID
 *  • onDrop:       (T \| T[]) ⇒ void             — called when drop completes
 *  • onReorder?:   (newItems: T[]) ⇒ void         — called after reorder in ‘reorder’ mode
 *
 * Usage example:
 *  <InteractiveCollection
 *    items={phonemes}
 *    getItemId={p => p.id}
 *    renderItem={(p) => <PhonemeBox label={p.symbol} />}
 *    layout={{ type:'column', gap:8, flexFill:true }}
 *    mode="reorder"
 *    dropZoneId="trash-bin"
 *    onDrop={() => {}}
 *    onReorder={setPhonemes}
 *  />
 */


import React from 'react';
import {
    DndContext,
    useDraggable,
    useDroppable,
    DragEndEvent,
    closestCenter,
} from '@dnd-kit/core';
import {
    SortableContext,
    useSortable,
    arrayMove,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { Collection, CollectionLayout } from './Collection';

export type InteractionMode = 'single' | 'group' | 'reorder';


export interface InteractiveCollectionProps<T> {
    /** Your data items */
    items: T[];

    /** Gives the stable key / drag ID for each item */
    getItemId: (item: T) => string;

    /** Renders each item’s content */
    renderItem: (item: T, index: number) => React.ReactNode;

    /** Layout: column / row / grid */
    layout: CollectionLayout;

    /** Interaction mode: single | group | reorder */
    mode: InteractionMode;

    /** ID of the droppable zone to accept items or the group */
    dropZoneId: string;

    /** Called when a single item or the group is dropped into that zone */
    onDrop: (dropped: T | T[]) => void;

    /** Called when items are reordered (only in `reorder` mode) */
    onReorder?: (newItems: T[]) => void;
}


export function InteractiveCollection<T>({
    items,
    getItemId,
    renderItem,
    layout,
    mode,
    dropZoneId,
    onDrop,
    onReorder,
}: InteractiveCollectionProps<T>) {
    // drag‑end handler uses getItemId instead of element.props.id
    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        const activeId = active.id as string;
        const overId = over?.id as string;

        // single‑item
        if (mode === 'single' && items.length === 1 && overId === dropZoneId) {
            onDrop(items[0]);
        }

        // group
        if (mode === 'group' && items.length > 1 && overId === dropZoneId) {
            onDrop(items);
        }

        // reorder
        if (mode === 'reorder' && overId && activeId !== overId && onReorder) {
            const oldIndex = items.findIndex(i => getItemId(i) === activeId);
            const newIndex = items.findIndex(i => getItemId(i) === overId);
            onReorder(arrayMove(items, oldIndex, newIndex));
        }
    };

    return (
        <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCenter}>
            <DropZone id={dropZoneId} />

            {mode === 'reorder' ? (
                <SortableContext items={items.map(getItemId)} strategy={verticalListSortingStrategy}>
                    <Collection
                        items={items}
                        layout={layout}
                        renderItem={(item, i) => (
                            <SortableItem key={getItemId(item)} id={getItemId(item)}>
                                {renderItem(item, i)}
                            </SortableItem>
                        )}
                    />
                </SortableContext>

            ) : mode === 'group' ? (
                <DraggableContainer id="group-root">
                    <Collection items={items} layout={layout} renderItem={renderItem} />
                </DraggableContainer>

            ) : (
                // single
                <DraggableContainer id={getItemId(items[0])}>
                    {renderItem(items[0], 0)}
                </DraggableContainer>
            )}
        </DndContext>
    );
}


//
// Helper: DraggableContainer wraps any ReactNode in useDraggable
//
function DraggableContainer({
    id,
    children,
}: {
    id: string;
    children: React.ReactNode;
}) {
    const { attributes, listeners, setNodeRef, transform, isDragging } =
        useDraggable({ id });

    return (
        <div
            ref={setNodeRef}
            {...attributes}
            {...listeners}
            style={{
                transform: transform ? CSS.Transform.toString(transform) : undefined,
                opacity: isDragging ? 0.5 : 1,
            }}
        >
            {children}
        </div>
    );
}

//
// Helper: define a drop zone via useDroppable
//
function DropZone({ id }: { id: string }) {
    const { setNodeRef, isOver } = useDroppable({ id });
    return (
        <div
            ref={setNodeRef}
            style={{
                border: '2px dashed #888',
                background: isOver ? 'rgba(200,200,200,0.3)' : 'transparent',
                minHeight: '120px',
                marginBottom: '1rem',
            }}
        >
            {/* Optional content or styling for drop area */}
        </div>
    );
}


//
// Helper: SortableItem wraps an element in useSortable
//
function SortableItem({
    id,
    children,
}: {
    id: string;
    children: React.ReactNode;
}) {
    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({ id });

    return (
        <div
            ref={setNodeRef}
            {...attributes}
            {...listeners}
            style={{
                transform: transform
                    ? CSS.Transform.toString(transform)
                    : undefined,
                transition,
            }}
        >
            {children}
        </div>
    );
}
