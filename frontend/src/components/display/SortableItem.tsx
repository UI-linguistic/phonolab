/**
 * SortableItem.tsx
 * 
 * A single item that can be dragged and dropped.
 * 
 * What It Does:
 * • Shows content in a draggable container
 * • Changes style when being dragged
 * • Works with drag-and-drop sorting
 * • Can be any content you want
 * 
 * Props You Can Use:
 * • id: Unique identifier
 * • children: Content to show inside
 * 
 * Usage Example:
 * ```tsx
 * <SortableItem id="item-1">
 *   <VowelCard />
 * </SortableItem>
 * ```
 */

// React and core dependencies
import React from 'react';

// DND Kit components
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export function SortableItem({
    id,
    children,
}: {
    id: string;
    children: React.ReactNode;
}) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
        opacity: transform ? 0.5 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            {children}
        </div>
    );
}
