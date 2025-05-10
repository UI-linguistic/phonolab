// src/components/DraggableGridWrapper.tsx

/*────────────────────────────────────────────────────────────
  Component: DraggableGridWrapper
  - Makes any child draggable as a unit
───────────────────────────────────────────────────────────*/
import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

interface DraggableGridWrapperProps {
    id: string;
    children: React.ReactNode;
}

export function DraggableGridWrapper({ id, children }: DraggableGridWrapperProps) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id });
    const style: React.CSSProperties = {
        transform: transform ? CSS.Translate.toString(transform) : undefined,
        opacity: isDragging ? 0.5 : 1,
        cursor: 'grab',
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            {children}
        </div>
    );
}
