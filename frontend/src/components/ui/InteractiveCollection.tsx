// InteractiveCollection.tsx
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

    /** How to render each item */
    renderItem: (item: T, index: number) => React.ReactElement & { props: { id: string } };

    /** Layout of the collection: column/row/grid */
    layout: CollectionLayout;

    /** single | group | reorder */
    mode: InteractionMode;

    /** ID to identify the drop zone you want to accept items */
    dropZoneId: string;

    /** Called when an item or group is dropped into the drop zone */
    onDrop: (data: T | T[]) => void;

    /** Called when reordering in “reorder” mode */
    onReorder?: (newItems: T[]) => void;
}

export function InteractiveCollection<T extends { id: string }>({
    items,
    renderItem,
    layout,
    mode,
    dropZoneId,
    onDrop,
    onReorder,
}: InteractiveCollectionProps<T>) {
    // 1) Handlers for drag end
    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        // CASE: single item dropped into dropZone
        if (mode === 'single' && items.length === 1) {
            if (over?.id === dropZoneId) {
                onDrop(items[0]);
            }
        }

        // CASE: group dropped into dropZone
        if (mode === 'group' && items.length > 1) {
            if (over?.id === dropZoneId) {
                onDrop(items);
            }
        }

        // CASE: reordering within the same list
        if (mode === 'reorder' && over && active.id !== over.id) {
            const oldIndex = items.findIndex(i => i.id === active.id);
            const newIndex = items.findIndex(i => i.id === over.id);
            if (oldIndex !== -1 && newIndex !== -1 && onReorder) {
                onReorder(arrayMove(items, oldIndex, newIndex));
            }
        }
    };

    // 2) Wrap everything in DndContext
    return (
        <DndContext
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            {/* 3) Your drop zone */}
            <DropZone id={dropZoneId}>
                {/* You can render a highlight or background here */}
            </DropZone>

            {/* 4) Render depending on mode */}
            {mode === 'reorder' ? (
                <SortableContext
                    items={items.map(i => i.id)}
                    strategy={verticalListSortingStrategy}
                >
                    <Collection
                        items={items}
                        layout={layout}
                        renderItem={(item, idx) => (
                            <SortableItem key={item.id} id={item.id}>
                                {renderItem(item, idx)}
                            </SortableItem>
                        )}
                    />
                </SortableContext>
            ) : mode === 'group' ? (
                <DraggableContainer id="group-root">
                    <Collection
                        items={items}
                        layout={layout}
                        renderItem={renderItem}
                    />
                </DraggableContainer>
            ) : (
                // mode === 'single'
                items.length === 1 && (
                    <DraggableContainer id={items[0].id}>
                        {renderItem(items[0], 0)}
                    </DraggableContainer>
                )
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
